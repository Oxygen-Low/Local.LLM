## 2026-02-08 - Session Management Hardening
**Vulnerability:** Default session configuration in Express/connect can lead to technology fingerprinting (via `connect.sid` cookie name), lingering sessions in the database if not explicitly destroyed on unset, and session cookie failures when deployed behind a reverse proxy without the `proxy` flag.
**Learning:** Hardening `express-session` involves multiple layers: custom naming, explicit unset behavior, and proxy awareness. Additionally, applying rate limits to the logout endpoint is a simple but effective defense against session-related DoS or abuse.
**Prevention:** Always use a custom cookie name, set `unset: 'destroy'`, and ensure `proxy: true` when `trust proxy` is enabled in the Express app.
