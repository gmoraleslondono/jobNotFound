# jobNotFound

A full-stack demo app for browsing **Swedish job ads** from the public [JobTech Job Search API](https://jobsearch.api.jobtechdev.se) (`jobsearch.api.jobtechdev.se`). Listings are scoped to **Stockholm** and a **developer-oriented default keyword set** (frontend, backend, fullstack, programmer roles, etc.). You can switch simple **role filters** on the home page (all roles vs. frontend / backend / fullstack keyword), open a **job detail** view, **favorite** jobs, and record **application status**. Favorites and applications persist in `backend/db.json` via the API.

## What the app does

| Area                               | Behavior                                                                                                                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home (`/`)**                     | Loads a single batch of jobs (see limits below). Role chips narrow the search keyword; there is **no free-text search** and **no “load more” or page controls**. |
| **Job (`/job/:id`)**               | Fetches one ad by ID, shows employer and dates, favorite + application actions.                                                                                  |
| **Favorites (`/favorites`)**       | Lists saved jobs by re-fetching each ad from the API.                                                                                                            |
| **Applications (`/applications`)** | Lists jobs you marked with an application status.                                                                                                                |

### Listing limits (important)

- The backend `getJobs` procedure accepts `offset` and `limit` (for callers such as tests or future UI).
- The **web UI always requests `offset: 0`** and loads **up to 100** hits per selected filter.
- If the API reports **more matches than that**, the home screen shows text like “Showing **100** of **N** …” — those extra matches are **not** reachable in the UI until pagination or a higher limit is implemented.

## Repository layout

- **`backend/`** — Node + tRPC HTTP server, Zod validation, lowdb JSON store (`db.json`).
- **`frontend/`** — React + Vite SPA, TanStack Query + tRPC client.
- **Root** — shared tooling: Prettier, `concurrently` for `npm run dev`, and a `setup` script to install package deps under `backend/` and `frontend/`.

## Technologies

| Layer            | Stack                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------- |
| **Frontend**     | React, Vite, TypeScript, React Router, [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview), [tRPC client]((https://trpc.io/docs/))                            |
| **Backend**      | Node.js (ES modules), [tRPC standalone adapter](https://trpc.io/docs/), [Zod](https://zod.dev/), [lowdb](https://github.com/typicode/lowdb), CORS                               |
| **External API** | [JobTech Job Search API](https://jobsearch.api.jobtechdev.se) (`jobsearch.api.jobtechdev.se`) |
| **Tooling**      | Prettier (root + packages), ESLint (frontend)                                                 |

## Prerequisites

- **Node.js 22+** — the backend runs TypeScript with `node --experimental-strip-types`.
- **npm** (bundled with Node).

## How to run locally

The frontend calls **http://localhost:3000** for the API.

### One command (recommended)

From the **repository root**:

```bash
npm install
npm run setup
npm run dev
```

- **`npm run setup`** installs dependencies in `backend/` and `frontend/` (run again after cloning or when lockfiles change).
- **`npm run dev`** starts the backend and Vite together (labeled logs: `backend` / `frontend`).

Then open **http://localhost:5173**. The API serves **http://localhost:3000** and uses **`backend/db.json`** for favorites and applications.

### Two terminals (optional)

```bash
cd backend && npm install && npm run dev
```

```bash
cd frontend && npm install && npm run dev
```

### Production build (frontend)

```bash
cd frontend
npm run build
npm run preview
```

For real deployment, serve `frontend/dist` and point the tRPC HTTP URL in `frontend/src/trpc.ts` at your hosted API; adjust CORS in `backend/server.ts` for your frontend origin.

### Formatting (repository root)

```bash
npm install
npm run format
```

## Configuration notes

- **CORS** in `backend/server.ts` allows **`http://localhost:5173`**. Change it if you use another origin or port.
- **API sorting**: jobs are requested with `sort=pubdate-desc` (newest first).
