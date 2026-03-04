# Housekeeping Onboarding System

Interactive Housekeeping Onboarding System — a full‑stack app for training and onboarding housekeeping staff using modules, gamification, and dashboards.

## Tech Stack

- **Frontend:** React 18 (Create React App), Material UI, React Router
- **Backend:** Node.js + Express, JWT auth, Socket.IO
- **Database:** MongoDB (optional for local dev)

## Project Structure

- `frontend/` — React web app
- `backend/` — Express API
- `database/` — database scripts/assets
- `docs/` — documentation

## Getting Started

### Prerequisites

- Node.js **18+**
- npm
- MongoDB (only required for `npm run dev` / persistence)

### Install dependencies

```bash
npm run install-all
```

### Configure environment

```bash
cp .env.example .env
# then edit .env (MONGODB_URI, JWT_SECRET, etc.)
```

## Run the app

### Option A — Local dev (no MongoDB)

Runs the backend in **mock/in‑memory** mode.

```bash
npm run dev:local
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health check: http://localhost:5000/api/health

Demo credentials (local mode):

- Email: `demo@example.com`
- Password: `password123`

### Option B — Full dev (MongoDB required)

```bash
npm run dev
```

## Useful Scripts

From the repo root:

- `npm run install-all` — install root + frontend + backend dependencies
- `npm run dev` — run backend + frontend (MongoDB required)
- `npm run dev:local` — run backend (mock data) + frontend (no MongoDB)
- `npm run build` — build the frontend
- `npm test` — run backend + frontend tests
- `npm run lint` — run ESLint
- `npm run format` — run Prettier

## Documentation

- `SETUP.md` — setup and quick start
- `LOCAL_DEV_GUIDE.md` — run without MongoDB
- `MONGODB_FIX_GUIDE.md` — troubleshooting MongoDB connection issues

## License

MIT
