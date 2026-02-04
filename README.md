# Local.LLM

Local.LLM is a community focused ai platform that provides tools for almost anyone.

You can skip the setup by installing [Oxygen Low's Software App](https://github.com/Oxygen-Low/Oxygen-Lows-Software-App)

# Setup

## Prerequisites

Before you begin, ensure you have the following installed:

1. [Git](https://git-scm.com/install/)
2. [Node.js](https://nodejs.org/en/download/) (v18 or later recommended)
3. [PostgreSQL](https://www.postgresql.org/download/) (v14 or later recommended)

## Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Oxygen-Low/Local.LLM
   cd Local.LLM
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and populate it with your configuration. You can use `.env.example` as a template:
   ```bash
   cp .env.example .env
   ```
   **Important**:
   - Ensure you set a secure `SESSION_SECRET` that is at least 32 characters long and not a default value.
   - Provide your PostgreSQL connection details (`DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME`, `DB_PORT`).

4. **Prepare the database**:
   The application will automatically create the necessary tables (`users`, `session`) upon startup if they do not exist. Ensure your PostgreSQL server is running and the database specified in `.env` exists.

5. **Start the application**:
   ```bash
   npm start
   ```
   This will concurrently start the Angular development server and the Express backend.
   - Frontend: [http://localhost:4200](http://localhost:4200)
   - Backend: [http://localhost:3000](http://localhost:3000)

## Development

- **Run unit tests**: `npm test`
- **Build for production**: `npm run build`
- **Start backend only**: `npm run server`

## Security

- **Authentication**: Session-based authentication with session regeneration on login/logout.
- **Validation**: User registration requires a username (3-20 characters, alphanumeric/underscore) and a strong password (at least 8 characters, including one letter and one number).
- **Protection**: CSRF protection using Double Cookie Anti-CSRF and secure HTTP headers via Helmet.

## License
Distributed under the MIT License. See `LICENSE` for more information.
