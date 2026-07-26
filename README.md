# Sourci Sales Dashboard

A self-hosted sales tracking dashboard built for Sourci. Janelle submits weekly
performance numbers; Gio tracks her against locked 12-month targets.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI components
- SQLite via `better-sqlite3` (single-file DB at `data/sourci.db`)
- Recharts for charts, date-fns for date math
- Password gate via `DASHBOARD_PASSWORD` env var stored as a 30-day cookie

## Local setup

```bash
# 1. Install dependencies
npm install

# 2. Configure password
cp .env.example .env.local
# then edit .env.local and set DASHBOARD_PASSWORD

# 3. Run the dev server
npm run dev
```

The app runs at <http://localhost:3000>. Log in with the password you set.

The SQLite DB and Tier A placeholder list seed themselves on first boot.

## Pages
- `/login` - password gate
- `/` - dashboard (KPI cards, weekly activity chart, cumulative chart, funnel)
- `/submit` - Janelle's weekly entry form (auto-detects ISO week, pre-fills if entry exists)
- `/history` - table of all weekly entries with CSV export
- `/targets` - read-only locked targets reference
- `/tier-a` - inline-editable Tier A target list

## Configuration

`data/config.json` is created on first run:
- `startMonth` (YYYY-MM) - anchor for quarter boundaries
- `salesCycleStart` (YYYY-MM-DD) - anchor for the 35-day M1 → M2 → M3 → Steady phase rollovers

Edit and restart to change.

## Data persistence

The SQLite DB lives at `data/sourci.db`. Both the DB and `data/config.json` are
gitignored. To reset, delete the file and restart the app (schema + Tier A
placeholders are re-seeded on first connection).

## Deploying to Railway

Recommended for production. Railway gives you a persistent volume for SQLite,
custom domain, and git-based deploys.

1. **Push this repo to GitHub** (see "Pushing to GitHub" below).
2. Go to <https://railway.app>, sign up, and click **New Project → Deploy from GitHub repo**.
   Pick your repo. Railway detects the `Dockerfile` and builds it.
3. Once the first deploy is running, open the service → **Variables** → add:
   - `DASHBOARD_PASSWORD` = the password you'll share with Janelle
4. Service → **Settings → Volumes** → **Add Volume**:
   - Mount path: `/app/data`
   - Size: 1 GB is plenty
   This is what makes the SQLite DB survive redeploys.
5. Service → **Settings → Networking** → **Generate Domain**. Copy the URL.
6. Redeploy once after adding the variable + volume so they take effect.
7. Share the URL + password with Janelle.

Railway charges roughly $5/month for a hobby project this size.

### Pushing to GitHub

This repo is git-initialized but has no remote. To push:

```bash
# Create an empty repo on github.com first (no README, no .gitignore - we have those)
git remote add origin git@github.com:YOUR_USER/sourci-dashboard.git
git branch -M main
git push -u origin main
```

## Other deploy options

- **Fly.io** - same SQLite-on-a-volume pattern as Railway, but CLI-driven.
  `fly launch` from this directory will detect the Dockerfile and prompt you
  through a volume + secrets.
- **Render** - connect the GitHub repo; add a Disk for `/app/data`. Free tier
  spins down after 15 min idle, so paid tier ($7/mo) is recommended.
- **Vercel + Postgres** - `better-sqlite3` won't work on Vercel's serverless
  runtime. You'd need to swap `lib/db.ts` to use `@vercel/postgres` and
  translate the schema (`INTEGER PRIMARY KEY AUTOINCREMENT` → `SERIAL PRIMARY KEY`,
  `REAL` → `NUMERIC`).
