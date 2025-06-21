# TransactEasy - Error & Solution Log

This document tracks significant errors encountered during development and the solutions that were implemented to resolve them. It serves as a historical record to prevent repeating mistakes and to aid in future debugging efforts.

---

### Session: 2024-08-01-04
**Error**: `Firebase: Error (auth/invalid-api-key)` or explicit "Firebase configuration is incomplete" error.
**Description**: The application was crashing on startup because the Firebase SDK was not initialized with valid credentials from the `.env` file. The placeholders had not been replaced with the user's actual project keys.
**Solution**:
- Implemented a more robust check in `src/lib/firebase.ts` to validate credentials.
- Temporarily switched the `useAuth` hook (`src/hooks/use-auth.tsx`) to a mock implementation that doesn't require live Firebase credentials, allowing development to proceed without forcing the user to provide keys immediately. This keeps the auth code in place for future use while preventing the startup crash.

---

### Session: 2024-08-01-03
**Error**: `Error: listen EADDRINUSE: address already in use 0.0.0.0:9002`
**Description**: The Next.js development server failed to start because the default port `9002` was already in use by another process.
**Solution**:
- Modified the `dev` script in `package.json` to use a different port (`9003`) to avoid the conflict.
- Changed `"dev": "next dev --turbopack -p 9002"` to `"dev": "next dev --turbopack -p 9003"`.
