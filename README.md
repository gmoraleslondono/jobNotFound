# jobNotFound

A full-stack app for browsing **Swedish job ads** from the public Arbetsformedlingen API called [JobTech Job Search API](https://jobsearch.api.jobtechdev.se) (`jobsearch.api.jobtechdev.se`). Listings are scoped to **Stockholm** and a **developer-oriented default keyword set** (frontend, backend, fullstack, programmer roles, etc.). You can switch simple **role filters** on the home page (all roles vs. frontend / backend / fullstack keyword), open a **job detail** view, **favorite** jobs, and record **application status**. Favorites and applications persist in **`backend/data/db.json`** via the API.

## What the app does

| Area                               | Behavior                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Home (`/`)**                     | Loads a single batch of jobs (see limits below). Role chips narrow the search keyword; there is **no free-text search** |
| **Job (`/job/:jobId`)**            | Fetches one job ad by ID, shows employer and dates, favorite + application actions.                                     |
| **Favorites (`/favorites`)**       | Lists saved jobs by re-fetching each ad from the API.                                                                   |
| **Applications (`/applications`)** | Lists jobs marked with an application status.                                                                           |

### Listing limits (important)

- The backend `getJobs` procedure accepts `offset` and `limit` (for callers such as tests or future UI).
- The **web UI always requests `offset: 0`** and loads **up to 100** hits per selected filter.

## Repository layout

- **`backend/`** — Node + tRPC HTTP server, Zod validation, lowdb JSON store (`data/db.json`). In production it also serves the built SPA from `frontend/dist` (same origin as `/trpc`).
- **`frontend/`** — React + Vite SPA, TanStack Query + tRPC client.
- **Root** — shared tooling: Prettier, `concurrently` for `npm run dev`, and a `setup` script to install package deps under `backend/` and `frontend/`.

## Technologies

| Layer            | Stack                                                                                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**      | Node.js (ES modules), [tRPC serve](https://trpc.io/docs/), [Zod](https://zod.dev/), [lowdb](https://github.com/typicode/lowdb), CORS                           |
| **Frontend**     | React, Vite, TypeScript, React Router, [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [tRPC client](https://trpc.io/docs/) |
| **External API** | [JobTech Job Search API](https://jobsearch.api.jobtechdev.se) (`jobsearch.api.jobtechdev.se`)                                                                  |
| **Tooling**      | Prettier (root + packages), ESLint                                                                                                                             |

## Prerequisites

- **Node.js 22+** — the backend runs TypeScript with `node --experimental-strip-types`.
- **npm** (bundled with Node).

## How to run locally

The SPA talks to the API via `frontend/src/trpc.ts`: in **dev**, the client uses **`http://localhost:3000/trpc`** unless you set **`VITE_API_URL`** when starting Vite.

### One command (recommended)

From the **repository root**:

```bash
npm install
npm run setup
npm run dev
```

- **`npm run setup`** installs dependencies in `backend/` and `frontend/` (run again after cloning or when lockfiles change).
- **`npm run dev`** starts the backend and Vite together (labeled logs: `backend` / `frontend`).

Then open **http://localhost:5173**. The API serves **http://localhost:3000** and persists favorites and applications in **`backend/data/db.json`**.

### Two terminals (optional)

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

### Production (single server)

From the repository root, build the frontend and start the backend; the backend serves both the **tRPC API** and the **static SPA** (client falls back to same-origin `/trpc` when `VITE_API_URL` is unset):

```bash
npm install
npm run setup
npm run prod
```

Then open **http://localhost:3000** (or set `PORT` / `HOST` as below).

### Frontend-only preview (optional)

Useful to inspect the production bundle without the API:

```bash
cd frontend
npm run build
npm run preview
```

### Formatting (repository root)

```bash
npm install
npm run format
```

## Configuration notes

| Variable           | Where          | Purpose                                                                                                                                                                    |
| ------------------ | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`PORT`**         | Backend        | HTTP port (default **3000**).                                                                                                                                              |
| **`HOST`**         | Backend        | Bind address (default **0.0.0.0**).                                                                                                                                        |
| **`FRONTEND_URL`** | Backend        | Allowed CORS origin(s). Comma-separated list; default **`http://localhost:5173`**. Set to your deployed frontend origin(s) when the API and SPA are on different hosts.    |
| **`VITE_API_URL`** | Frontend build | Base URL of the API **without** `/trpc` (trailing slashes are stripped). If unset in production builds, the client uses **same-origin** `/trpc` — matching `npm run prod`. |

- **CORS** is configured in `backend/server.ts` via `FRONTEND_URL`.
- **API sorting**: jobs are requested with `sort=pubdate-desc` (newest first).
