## 2026-02-08 - Session Management Hardening
**Vulnerability:** Default session configuration in Express/connect can lead to technology fingerprinting (via `connect.sid` cookie name), lingering sessions in the database if not explicitly destroyed on unset, and session cookie failures when deployed behind a reverse proxy without the `proxy` flag.
**Learning:** Hardening `express-session` involves multiple layers: custom naming, explicit unset behavior, and proxy awareness. Additionally, applying rate limits to the logout endpoint is a simple but effective defense against session-related DoS or abuse.
**Prevention:** Always use a custom cookie name, set `unset: 'destroy'`, and ensure `proxy: true` when `trust proxy` is enabled in the Express app.

## 2026-02-08 - Authentication Input Validation & DoS Protection
**Vulnerability:** Lack of explicit type checking for `username` and `password` could lead to logic bypasses (e.g., passing arrays instead of strings) or unexpected behavior in the database layer. Additionally, unlimited JSON body sizes expose the server to memory exhaustion (DoS).
**Learning:** Defensive programming in Express requires validating not just the presence of fields, but also their types. Setting explicit body parser limits is a simple and effective first line of defense against DoS.
**Prevention:** Always use `typeof` checks for sensitive inputs and configure `limit` options for all body parsers (json, urlencoded, etc.).
