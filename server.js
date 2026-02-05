require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { doubleCsrf } = require('csrf-csrf');

// Validate environment variables
const SESSION_SECRET = process.env.SESSION_SECRET;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Extract and validate database environment variables
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

if (!DB_USER || !DB_HOST || !DB_NAME || !DB_PASSWORD || !DB_PORT) {
  console.error('CRITICAL: Database environment variables (DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT) must all be defined.');
  process.exit(1);
}

if (!SESSION_SECRET || SESSION_SECRET.length < 32 || SESSION_SECRET === 'super-secret-key') {
  console.error('CRITICAL: SESSION_SECRET must be defined in environment variables, be at least 32 characters long, and not be a default value.');
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
app.use(cors({
  origin: 'http://localhost:4200', // Default Angular port
  credentials: true
}));

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: { error: 'Too many attempts, please try again later' }
});

// Session configuration
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session',
    createTableIfMissing: true
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  rolling: true, // Refresh cookie on every request
  cookie: {
    maxAge: 2 * 60 * 60 * 1000, // 2 hours in milliseconds
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax'
  }
}));

// CSRF protection configuration
const { generateToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => SESSION_SECRET,
  cookieName: "x-csrf-token",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: IS_PRODUCTION,
  },
  getTokenFromRequest: (req) => req.headers["x-csrf-token"],
});

// CSRF protection middleware
app.use(doubleCsrfProtection);

app.get('/api/csrf-token', (req, res) => {
  const csrfToken = generateToken(req, res);
  res.json({ csrfToken });
});

/**
 * Ensure the required `users` table exists in the PostgreSQL database.
 */
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      bio TEXT,
      is_public BOOLEAN DEFAULT false
    )
  `);
}

// Routes
app.post('/api/register', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores'
    });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }

  if (password.length > 128) {
    return res.status(400).json({ error: 'Password must not exceed 128 characters' });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: 'Password must contain at least one letter and one number' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') { // Unique violation
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: 'Database error' });
    }
  }
});

app.post('/api/login', authLimiter, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (password.length > 128) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    // Mitigate timing attacks by always performing the comparison
    const targetHash = user ? user.password : dummyHash;
    const isMatch = await bcrypt.compare(password, targetHash);

    if (user && isMatch) {
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: 'Session regeneration failed' });
        }
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: 'Session save failed' });
          }
          res.json({ id: user.id, username: user.username });
        });
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ error: 'Could not log out' });
      }
      res.json({ message: 'Logged out' });
    });
  });
});

app.get('/api/status', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true, user: { id: req.session.userId, username: req.session.username } });
  } else {
    res.json({ authenticated: false });
  }
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Initialize the database and start the Express HTTP server on the configured port.
 * Retries connection if the database is not ready.
 */
async function startServer() {
  const maxRetries = 10;
  const retryInterval = 2000; // 2 seconds

  // Pre-calculate a dummy hash for timing attack mitigation
  // using the same cost factor (10) as the real password hashes.
  dummyHash = await bcrypt.hash('dummy_password_for_timing_mitigation', 10);

  for (let i = 0; i < maxRetries; i++) {
    try {
      await initDb();
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
      return;
    } catch (err) {
      if (err.code === 'ECONNREFUSED' && i < maxRetries - 1) {
        console.log(`Database connection failed. Retrying in ${retryInterval / 1000}s... (${i + 1}/${maxRetries})`);
        await sleep(retryInterval);
      } else {
        if (err.code === 'ECONNREFUSED') {
          console.error('CRITICAL: Could not connect to the PostgreSQL database.');
          console.error('Ensure that your PostgreSQL server is running and accessible.');
          console.error('If you have Docker installed, you can start the database using: npm run db:up');
        } else {
          console.error('Error starting server:', err);
        }
        process.exit(1);
      }
    }
  }
}

startServer();
