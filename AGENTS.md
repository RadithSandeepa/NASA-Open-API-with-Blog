# Repository Guidelines

## Project Structure & Module Organization
This monorepo stays split into `frontend/` (Vite + React SPA) and `backend/` (Express + Mongoose API). Frontend route views live in `src/components/pages`, layout chrome in `components/layout`, and reusable UI in `components/miniComponents`; shared config sits in `src/utils/constants.js`, and OAuth redirects are handled by `components/pages/OAuthCallback.jsx`. Backend follows feature folders: `routes/` wires HTTP entry points (`authRouter.js` now brokers social sign-in), `controllers/` contain business logic, `models/` house Mongoose schemas, `middlewares/` exposes auth helpers (`passportConfig.js`, `catchAsyncErrors`), `utils/` stores cross-cutting helpers (`jwtToken.js`), and `database/` bootstraps the Mongo connection.

## Build, Test, and Development Commands
Install per package with `npm install`. Frontend: `npm run dev` (Vite dev server on 5173), `npm run build`, `npm run preview`, `npm run lint`, and `npm run test`. Backend: `npm run dev` currently expects `server.js`; until that stub exists run `node index.js`, and `npm start` serves production. Always export env vars before starting (see below). Run lint/test locally—eslint will flag legacy warnings; document any blockers in PRs.

## OAuth & Configuration
Passport drives Google and GitHub OAuth. Required backend config keys: `CLIENT_URL` (comma-separated origins allowed by CORS), `SERVER_URL` (public API base), `JWT_SECRET_KEY`, `JWT_EXPIRES`, `COOKIE_EXPIRE`, Mongo/Cloudinary secrets, plus provider credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_CALLBACK_URL`). Frontend expects `VITE_API_BASE_URL` (defaults to the hosted API) and optional `VITE_CLIENT_URL`. Register OAuth apps with matching callback URLs and HTTPS in production.

## Coding Style & Naming Conventions
Stick to 2-space indentation. Use PascalCase filenames for React components, camelCase for functions/variables, and dash-case CSS classes. Keep async Express handlers returning `res.status(...).json(...)` and surface shared token logic via `utils/jwtToken.js`. Group provider metadata under `user.providers` and avoid storing plaintext secrets in source control.

## Testing Guidelines
Vitest + React Testing Library drive frontend tests—mirror components with `ComponentName.test.jsx` and stub external API calls. Add Jest + Supertest coverage for new auth routes under `backend/tests/` when possible. Target at least smoke coverage for the Google/GitHub flows (success + failure) before shipping.

## Commit & Pull Request Guidelines
Write imperative commit subjects with context (e.g., `Add Google OAuth callback`). Reference issue IDs where available. PRs should describe scope, list verification steps (`npm run lint`, `npm run test`, manual OAuth walkthrough), and include screenshots or HAR snippets when UI/auth flows change. Request reviewers for both frontend and backend when contracts touch shared auth data.
