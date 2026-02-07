require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const PgSession = require("connect-pg-simple")(session);
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const lusca = require("lusca");

// Validate environment variables
const SESSION_SECRET = process.env.SESSION_SECRET;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const PORT = process.env.PORT || 3000;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Auto-update state
let updatePending = false;
let restartAt = null;
let updateVersion = null;
let pendingRemoteSha = null;
let currentVersionCache = "Unknown";

/**
 * Update the module-level cached current version from the changelogs.md file.
 *
 * If changelogs.md exists, reads its first line, trims it, and stores it in
 * `currentVersionCache`. On any filesystem error the cache is left unchanged
 * and an error is logged to the console.
 */
function refreshCurrentVersion() {
  try {
    const changelogPath = path.join(__dirname, "changelogs.md");
    if (fs.existsSync(changelogPath)) {
      const content = fs.readFileSync(changelogPath, "utf8");
      currentVersionCache = content.split("\n")[0].trim();
    }
  } catch (err) {
    console.error("Error refreshing current version cache:", err);
  }
}

// Auto-update environment variables
// Whether or not to use the automatic update system. (Default = true)
const AUTO_UPDATE = process.env.AUTO_UPDATE !== "false";
// In seconds, the interval between checking updates. (Default = 600)
const parsedInterval = parseInt(process.env.AUTO_UPDATE_INTERVAL, 10);
const AUTO_UPDATE_INTERVAL = Number.isNaN(parsedInterval) ? 600 : parsedInterval;
// In seconds, how long before running git pull after an update was detected. (Default = 60)
const parsedWait = parseInt(process.env.AUTO_UPDATE_WAIT, 10);
const AUTO_UPDATE_WAIT = Number.isNaN(parsedWait) ? 60 : parsedWait;
// Whether or not to show changelogs.
const AUTO_UPDATE_SHOW_CHANGELOGS =
  process.env.AUTO_UPDATE_SHOW_CHANGELOGS !== "false";

// Extract and validate database environment variables
// We handle $$ as an escape for $ to maintain compatibility with Docker Compose
const DB_USER = process.env.DB_USER?.replace(/\$\$/g, "$");
const DB_HOST = process.env.DB_HOST?.replace(/\$\$/g, "$");
const DB_NAME = process.env.DB_NAME?.replace(/\$\$/g, "$");
const DB_PASSWORD = process.env.DB_PASSWORD?.replace(/\$\$/g, "$");
const DB_PORT = process.env.DB_PORT?.replace(/\$\$/g, "$");

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD || !DB_PORT) {
  console.error(
    "CRITICAL: Database environment variables (DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT) must all be defined.",
  );
  process.exit(1);
}

if (
  !SESSION_SECRET ||
  SESSION_SECRET.length < 32 ||
  SESSION_SECRET === "super-secret-key"
) {
  console.error(
    "CRITICAL: SESSION_SECRET must be defined in environment variables, be at least 32 characters long, and not be a default value.",
  );
  console.error(
    "HINT: If your secret contains '#' it must be wrapped in single quotes (e.g., SESSION_SECRET='abc#123').",
  );
  console.error(
    "HINT: If your secret contains '$' and is used in Docker Compose, use '$$' to escape it.",
  );
  process.exit(1);
}

const app = express();

let dummyHash;

// Database connection
const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
});

// Middleware
if (IS_PRODUCTION) {
  // Trust the first proxy (e.g. Cloudflare, Nginx, Heroku router)
  // Essential for correct IP detection in rate limiting and secure cookies
  app.set("trust proxy", 1);
}

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:4200", // Default Angular port
    credentials: true,
  }),
);

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: "Too many attempts, please try again later" },
});

// General API rate limiter for status and updates
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Higher limit for polling
  message: { error: "Too many requests, please try again later" },
});


// Session configuration
app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true, // Refresh cookie on every request
    cookie: {
      maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: "lax",
    },
  }),
);

// CSRF protection middleware
app.use(lusca.csrf());

app.get("/api/csrf-token", apiLimiter, (req, res) => {
  res.json({ csrfToken: res.locals._csrf });
});

// Error handler for CSRF and other errors
app.use((err, req, res, next) => {
  if (
    err.code === "EBADCSRFTOKEN" ||
    err.message === "invalid csrf token" ||
    err.status === 403
  ) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

/**
 * Create the users and system_info tables in the database if they do not already exist.
 *
 * The `users` table stores account records (id, username, password, bio, is_public).
 * The `system_info` table stores key/value metadata used for update-related state.
 */
async function initDb() {
  // Initialize users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      is_public BOOLEAN DEFAULT false
    )
  `);

  // Initialize system_info table for storing update information
  await pool.query(`
    CREATE TABLE IF NOT EXISTS system_info (
      key TEXT PRIMARY KEY,
      value TEXT
    )
  `);
}

/**
 * Checks if the configured ADMIN_USERNAME exists in the database.
 * If not, and if ADMIN_PASSWORD is provided, it creates the admin user.
 */
async function seedAdmin() {
  if (!ADMIN_USERNAME) return;

  try {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [
      ADMIN_USERNAME,
    ]);
    if (res.rows.length === 0) {
      if (ADMIN_PASSWORD) {
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        await pool.query(
          "INSERT INTO users (username, password) VALUES ($1, $2)",
          [ADMIN_USERNAME, hashedPassword],
        );
        console.log("Admin account created using ADMIN_PASSWORD.");
      } else {
        console.log(
          "NOTICE: ADMIN_USERNAME is set but ADMIN_PASSWORD is not set. Admin account was NOT seeded. Public registration for this username is blocked.",
        );
      }
    } else {
      console.log("Admin account already exists.");
    }
  } catch (err) {
    console.error("Error seeding admin account:", err);
  }
}

// Routes
app.post("/api/register", authLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens",
    });
  }

  // Prevent public registration of the admin username to avoid takeover
  if (ADMIN_USERNAME && username === ADMIN_USERNAME) {
    return res.status(403).json({
      error: "This username is reserved and cannot be registered publicly.",
    });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters long" });
  }

  if (password.length > 128) {
    return res
      .status(400)
      .json({ error: "Password must not exceed 128 characters" });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        error: "Password must contain at least one letter and one number",
      });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username",
      [username, hashedPassword],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation
      res.status(409).json({ error: "Username already exists" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
});

app.post("/api/login", authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  if (password.length > 128) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    // Mitigate timing attacks by always performing the comparison
    const targetHash = user ? user.password : dummyHash;
    const isMatch = await bcrypt.compare(password, targetHash);

    if (user && isMatch) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session regeneration failed" });
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }
          res.json({ id: user.id, username: user.username });
        });
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: "Could not log out" });
    }
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: "Could not log out" });
      }
      res.json({ message: "Logged out" });
    });
  });
});

app.get("/api/status", apiLimiter, (req, res) => {
  if (req.session.userId) {
    const isAdmin = ADMIN_USERNAME && req.session.username === ADMIN_USERNAME;
    res.json({
      authenticated: true,
      user: {
        id: req.session.userId,
        username: req.session.username,
        isAdmin: isAdmin,
      },
    });
  } else {
    res.json({ authenticated: false });
  }
});

/**
 * Returns the current update status and whether changelogs should be shown.
 * Access is restricted to logged-in users.
 */
app.get("/api/update-status", apiLimiter, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let lastUpdateAt = null;

  try {
    const lastUpdateResult = await pool.query(
      "SELECT value FROM system_info WHERE key = 'last_update_at'",
    );
    lastUpdateAt = lastUpdateResult.rows[0]?.value || null;
  } catch (err) {
    console.error("Error fetching update status details:", err);
  }

  res.json({
    updatePending,
    restartAt,
    updateVersion, // This is the version of the PENDING update
    currentVersion: currentVersionCache, // This is the version currently installed (cached)
    lastUpdateAt,
    autoUpdateShowChangelogs: AUTO_UPDATE_SHOW_CHANGELOGS,
  });
});

/**
 * Returns the content of changelogs.md and the last update timestamp.
 * Access is restricted to logged-in users, and respects AUTO_UPDATE_SHOW_CHANGELOGS for non-admins.
 */
app.get("/api/changelogs", apiLimiter, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const isAdmin = ADMIN_USERNAME && req.session.username === ADMIN_USERNAME;

  // If changelogs are disabled, only admins can view them
  if (!AUTO_UPDATE_SHOW_CHANGELOGS && !isAdmin) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    const changelogPath = path.join(__dirname, "changelogs.md");
    let content = "";
    if (fs.existsSync(changelogPath)) {
      content = fs.readFileSync(changelogPath, "utf8");
    }

    const lastUpdateResult = await pool.query(
      "SELECT value FROM system_info WHERE key = 'last_update_at'",
    );
    const lastUpdateAt = lastUpdateResult.rows[0]?.value || null;

    res.json({
      content,
      lastUpdateAt,
    });
  } catch (err) {
    console.error("Error reading changelogs:", err);
    res.status(500).json({ error: "Could not read changelogs" });
  }
});

/**
 * Check the remote Git repository for a newer commit and, if found, schedule applying the update.
 *
 * If AUTO_UPDATE is disabled or an update is already pending, this function returns without action.
 *
 * Side effects:
 * - Marks `updatePending` true and stores the remote SHA in `pendingRemoteSha`.
 * - Sets `restartAt` to now + AUTO_UPDATE_WAIT seconds.
 * - Attempts to set `updateVersion` from the first line of `changelogs.md` on origin/main, falling back to `"Unknown"`.
 * - Schedules `performUpdate` to run after AUTO_UPDATE_WAIT seconds.
 * - Reads `failed_remote_sha` from the `system_info` table and skips the update if it matches the remote SHA.
 *
 * Errors encountered while inspecting Git state or querying the database are logged and do not throw.
 */
async function checkForUpdates() {
  if (updatePending || !AUTO_UPDATE) return;

  console.log("Checking for updates...");
  exec("git fetch origin main", async (err) => {
    if (err) {
      console.error("Update check failed (fetch):", err);
      return;
    }

    exec("git rev-parse HEAD", async (err, stdoutHead) => {
      if (err) {
        console.error("Error getting local HEAD:", err);
        return;
      }
      const local = stdoutHead.trim();

      exec("git rev-parse origin/main", async (err, stdoutRemote) => {
        if (err) {
          console.error("Error getting origin/main HEAD:", err);
          return;
        }
        const remote = stdoutRemote.trim();

        // Check if this remote SHA has failed before
        try {
          const failedResult = await pool.query(
            "SELECT value FROM system_info WHERE key = 'failed_remote_sha'",
          );
          if (failedResult.rows[0]?.value === remote) {
            console.log(`Skipping update as remote SHA ${remote} previously failed.`);
            return;
          }
        } catch (dbErr) {
          console.error("Error checking failed_remote_sha:", dbErr);
        }

        // If local and remote differ, an update is available
        if (local !== remote) {
          console.log(`Update detected! Local: ${local}, Remote: ${remote}`);
          updatePending = true;
          pendingRemoteSha = remote;
          restartAt = Date.now() + AUTO_UPDATE_WAIT * 1000;

          // Attempt to get the new version from the remote changelogs.md
          exec("git show origin/main:changelogs.md", (err, stdoutChangelog) => {
            if (!err) {
              updateVersion = stdoutChangelog.split("\n")[0].trim();
            } else {
              updateVersion = "Unknown";
            }
            console.log(`Update Version: ${updateVersion}`);
          });

          // Schedule the pull and restart
          setTimeout(performUpdate, AUTO_UPDATE_WAIT * 1000);
        }
      });
    });
  });
}

/**
 * Pull and apply repository updates, record the update time, and initiate a restart.
 *
 * If the update succeeds, writes or updates the `last_update_at` key in the `system_info` table with the current timestamp and then triggers the application restart procedure. If the update fails and a pending remote SHA exists, stores that SHA under `failed_remote_sha` in `system_info` and clears pending update state.
 */
async function performUpdate() {
  console.log("Performing git pull from origin main...");
  exec("git pull origin main", async (err) => {
    if (err) {
      console.error("Git pull failed:", err);
      if (pendingRemoteSha) {
        try {
          await pool.query(
            "INSERT INTO system_info (key, value) VALUES ('failed_remote_sha', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
            [pendingRemoteSha],
          );
        } catch (dbErr) {
          console.error("Failed to store failed_remote_sha:", dbErr);
        }
      }
      updatePending = false;
      pendingRemoteSha = null;
      return;
    }

    // Update the version cache after a successful pull
    refreshCurrentVersion();

    try {
      // Record the last update timestamp in the database
      const now = new Date().toISOString();
      await pool.query(
        "INSERT INTO system_info (key, value) VALUES ('last_update_at', $1) ON CONFLICT (key) DO UPDATE SET value = $1",
        [now],
      );
    } catch (dbErr) {
      console.error("Failed to update last_update_at in database:", dbErr);
    }

    triggerRestart();
  });
}

/**
 * Start a detached, platform-specific restart script and terminate the current process.
 *
 * If the required restart script is missing or cannot be spawned, exits with code 1.
 * On successful spawn, exits with code 0 after detaching the child process.
 */
function triggerRestart() {
  console.log("Triggering application restart...");
  const isWindows = process.platform === "win32";
  const scriptName = isWindows ? "restart.bat" : "restart.sh";
  const scriptPath = path.join(__dirname, scriptName);

  if (!fs.existsSync(scriptPath)) {
    console.error(`Restart script not found at ${scriptPath}`);
    process.exit(1);
  }

  // Make sure the script is executable on Unix systems
  if (!isWindows) {
    try {
      fs.chmodSync(scriptPath, "755");
    } catch (e) {
      console.error("Failed to set executable permissions on restart script");
    }
  }

  try {
    let child;
    if (isWindows) {
      // Use completely hardcoded strings for spawn to satisfy CodeQL
      child = spawn("cmd.exe", ["/c", "restart.bat"], {
        detached: true,
        stdio: "ignore",
        cwd: __dirname,
      });
    } else {
      // Use completely hardcoded strings for spawn to satisfy CodeQL
      child = spawn("/bin/bash", ["./restart.sh"], {
        detached: true,
        stdio: "ignore",
        cwd: __dirname,
      });
    }

    if (child) {
      child.unref();
      process.exit(0);
    }
  } catch (err) {
    console.error("Error during spawn of restart script:", err);
    process.exit(1);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Start the HTTP server after ensuring required database schema exists, retrying on transient failures.
 *
 * Initializes the database and starts the Express listener on the configured port. If the database
 * connection is refused, retries initialization up to a fixed number of attempts with a short delay;
 * logs diagnostic messages and exits the process if the database remains unreachable. When auto-update
 * is enabled, schedules periodic update checks after the server starts.
 */
async function startServer() {
  const maxRetries = 10;
  const retryInterval = 2000; // 2 seconds

  // Initialize the current version cache
  refreshCurrentVersion();

  // Pre-calculate a dummy hash for timing attack mitigation
  // using the same cost factor (10) as the real password hashes.
  dummyHash = await bcrypt.hash("dummy_password_for_timing_mitigation", 10);

  for (let i = 0; i < maxRetries; i++) {
    try {
      await initDb();
      await seedAdmin();
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);

        // Start the update check interval if enabled
        if (AUTO_UPDATE) {
          console.log(
            `Auto-update system active. Checking every ${AUTO_UPDATE_INTERVAL} seconds.`,
          );
          setInterval(checkForUpdates, AUTO_UPDATE_INTERVAL * 1000);
          // Also check once on startup
          setTimeout(checkForUpdates, 5000);
        }
      });
      return;
    } catch (err) {
      if (err.code === "ECONNREFUSED" && i < maxRetries - 1) {
        console.log(
          `Database connection failed. Retrying in ${retryInterval / 1000}s... (${i + 1}/${maxRetries})`,
        );
        await sleep(retryInterval);
      } else {
        if (err.code === "ECONNREFUSED") {
          console.error(
            "CRITICAL: Could not connect to the PostgreSQL database.",
          );
          console.error(
            "Ensure that your PostgreSQL server is running and accessible.",
          );
          console.error(
            "If you have Docker installed, you can start the database using: npm run db:up",
          );
        } else {
          console.error("Error starting server:", err);
        }
        process.exit(1);
      }
    }
  }
}

startServer();