# Finora — Frontend

Next.js frontend for the Finora budgeting tool.

## Stack
- Next.js (App Router), TypeScript
- TanStack Query
- Zustand
- Recharts (charts)
- shadcn/ui (forms, modals, general UI)
- Socket.IO client (live updates)

## Setup
1. `git clone https://github.com/shahghalib/finora-frontend.git`
2. `cd finora-frontend`
3. `cp .env.example .env`
4. `npm install`
5. `npm run dev` → http://localhost:3000

Requires the backend running separately (see `finora-backend` repo) — Postgres and Redis must be installed and running locally, no Docker involved.

## Notes
- Charts are built directly with Recharts, not Tremor (Tremor doesn't yet support React 19, which `create-next-app` defaults to).