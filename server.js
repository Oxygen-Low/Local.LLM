require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
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

// Auto-update state
let updatePending = false;
let restartAt = null;
let updateVersion = null;

// Auto-update environment variables
// Whether or not to use the automatic update system. (Default = true)
const AUTO_UPDATE = process.env.AUTO_UPDATE !== "false";
// In seconds, the interval between checking updates. (Default = 600)
const AUTO_UPDATE_INTERVAL = parseInt(
  process.env.AUTO_UPDATE_INTERVAL || "600",
  10,
);
// In seconds, how long before running git pull after an update was detected. (Default = 60)
const AUTO_UPDATE_WAIT = parseInt(process.env.AUTO_UPDATE_WAIT || "60", 10);
// Whether or not to show changelogs.
const AUTO_UPDATE_SHOW_CHANGELOGS =
  process.env.AUTO_UPDATE_SHOW_CHANGELOGS === "true";

// Extract and validate database environment variables
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

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

app.get("/api/csrf-token", (req, res) => {
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
 * Ensure the required `users` table exists in the PostgreSQL database.
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

// Routes
app.post("/api/register", authLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error:
        "Username must be 3-20 characters long and contain only letters, numbers, and underscores",
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

app.get("/api/status", (req, res) => {
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
 */
const updateStatusLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
});

app.get("/api/update-status", updateStatusLimiter, async (req, res) => {
  let lastUpdateAt = null;
  let currentVersion = "Unknown";

  try {
    const lastUpdateResult = await pool.query(
      "SELECT value FROM system_info WHERE key = 'last_update_at'",
    );
    lastUpdateAt = lastUpdateResult.rows[0]?.value || null;

    const changelogPath = path.join(__dirname, "changelogs.md");
    if (fs.existsSync(changelogPath)) {
      const content = fs.readFileSync(changelogPath, "utf8");
      currentVersion = content.split("\n")[0].trim();
    }
  } catch (err) {
    console.error("Error fetching update status details:", err);
  }

  res.json({
    updatePending,
    restartAt,
    updateVersion, // This is the version of the PENDING update
    currentVersion, // This is the version currently installed
    lastUpdateAt,
    autoUpdateShowChangelogs: AUTO_UPDATE_SHOW_CHANGELOGS,
  });
});

/**
 * Returns the content of changelogs.md and the last update timestamp.
 * Access is restricted to logged-in users, and respects AUTO_UPDATE_SHOW_CHANGELOGS for non-admins.
 */
app.get("/api/changelogs", async (req, res) => {
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
 * Checks for updates by fetching the remote main branch and comparing it with the local HEAD.
 */
async function checkForUpdates() {
  if (updatePending || !AUTO_UPDATE) return;

  console.log("Checking for updates...");
  exec("git fetch origin main", (err) => {
    if (err) {
      console.error("Update check failed (fetch):", err);
      return;
    }

    exec("git rev-parse HEAD", (err, stdoutHead) => {
      if (err) {
        console.error("Error getting local HEAD:", err);
        return;
      }
      const local = stdoutHead.trim();

      exec("git rev-parse origin/main", (err, stdoutRemote) => {
        if (err) {
          console.error("Error getting origin/main HEAD:", err);
          return;
        }
        const remote = stdoutRemote.trim();

        // If local and remote differ, an update is available
        if (local !== remote) {
          console.log(`Update detected! Local: ${local}, Remote: ${remote}`);
          updatePending = true;
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
 * Pulls the latest changes from origin/main, records the update time, and triggers a restart.
 */
async function performUpdate() {
  console.log("Performing git pull from origin main...");
  exec("git pull origin main", async (err) => {
    if (err) {
      console.error("Git pull failed:", err);
      // Proceeding with restart anyway as we are in an update cycle
    }

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
 * Spawns a detached restart script and exits the current process.
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

  const child = spawn(
    isWindows ? "cmd.exe" : "/bin/bash",
    isWindows ? ["/c", scriptPath] : [scriptPath],
    {
      detached: true,
      stdio: "ignore",
      cwd: __dirname,
    },
  );

  child.unref();
  process.exit(0);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialize the database and start the Express HTTP server, retrying if the database is not ready.
 *
 * Precomputes a dummy bcrypt hash for timing-attack mitigation, then attempts to initialize the database
 * and start listening on the configured PORT. On an ECONNREFUSED error it retries multiple times with a
 * short delay; if the database remains unreachable the process exits after logging diagnostic guidance.
 */
async function startServer() {
  const maxRetries = 10;
  const retryInterval = 2000; // 2 seconds

  // Pre-calculate a dummy hash for timing attack mitigation
  // using the same cost factor (10) as the real password hashes.
  dummyHash = await bcrypt.hash("dummy_password_for_timing_mitigation", 10);

  for (let i = 0; i < maxRetries; i++) {
    try {
      await initDb();
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