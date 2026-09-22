# nexora-frontend

ChannelEngine-style marketplace integration console for the **Nexora** backend (StockConnect). This repository is **frontend only** — the API lives in [nexora-backend](https://github.com/alikhanaries/nexora-backend) and must not be modified from frontend work.

## Tech stack

- React **18.3.1** (JavaScript — no TypeScript)
- Vite
- MUI (Material UI) + Emotion
- Tailwind CSS (layout utilities; `preflight` disabled to avoid conflicting with MUI)
- React Router v6
- TanStack Query
- Axios (central API client)
- SweetAlert2 (critical confirmations)
- MUI Snackbar (routine notifications)

## Requirements

- **Node.js** 20+ (LTS recommended; see `engines` in `package.json`)
- **npm** (default package manager for this repo)

## Installation

```bash
npm install
```

## Environment

Copy the example file and set the backend native API root (include `/api/v1`):

```bash
cp .env.example .env
```

| Variable | Description |
| -------- | ----------- |
| `VITE_API_BASE_URL` | Backend API base URL, e.g. your deployment URL ending in `/api/v1` |

Do not commit `.env` or secrets. See `.env.example` for placeholders only.

## Scripts

| Command | Purpose |
| ------- | ------- |
| `npm run dev` | Start Vite dev server (default port 5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier (write) |

## Folder structure

```
src/
  assets/           Static assets
  components/
    common/         Error boundary, notifications
    ui/             Loading, empty, error states
  config/           Env + QueryClient factory
  constants/        Shared constants (e.g. auth storage keys)
  hooks/            Shared hooks (e.g. useAuth)
  layouts/          Auth and app shells
  pages/            Route pages (auth foundation first)
  providers/        App-level providers
  routes/           Route definitions + guards
  services/
    api/            Axios client, error normalization
    auth/           Session + auth API (login/refresh/logout/me)
  styles/           Global CSS + Tailwind entry
  theme/            MUI theme tokens
  utils/            Formatters, confirm dialog helper
```

## Backend API

The UI consumes the existing **`/api/v1`** JSON envelope:

- Success: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": { "code", "message", ... }, "requestId" }`

OpenAPI (when enabled on the backend): `/docs` and `/openapi.json`.

Known backend gaps are documented in [docs/phase-1-channel-marketplace-frontend-audit.md](./docs/phase-1-channel-marketplace-frontend-audit.md) (permissions on `/auth/me`, users admin, webhooks HTTP, queue monitoring, dashboard aggregates, product search, channel sync).

## MUI + Tailwind

- **MUI:** forms, buttons, dialogs, typography, alerts, snackbars, theme tokens.
- **Tailwind:** page layout, flex/grid, spacing, responsive wrappers on layout components.

See [docs/styling.md](./docs/styling.md) for conventions.

## Inventory module (Phase 5)

| Route | Purpose |
| ----- | ------- |
| `/inventory` | Stock locations list, balances table, mutations |

**Quantity semantics (from API):** each balance row exposes `onHand`, `reserved`, and `available` as separate integers — display as returned; do not recompute.

**Filters:** optional `stockLocationId` query param on list API (URL: `?stockLocationId=`). No SKU/text search; no cursor pagination on balances.

**Operations:** adjust (delta), receive (quantity), reserve/release (with reference type/id). Optional `idempotencyKey` in request body when supported.

## Products module (Phase 4)

Routes:

| Route | Purpose |
| ----- | ------- |
| `/products` | Cursor-paginated list (`status`, `cursor` query params) |
| `/products/new` | Create product |
| `/products/:productId` | Product detail + read-only localized content |
| `/products/:productId/edit` | Update external reference and product type |

API: `/api/v1/products` (list, create, get, patch, deactivate, archive, content list).

**Backend limitations:** no list text/SKU search (GAP-6); no re-activate endpoint; localized content upsert not in UI yet (`PUT .../content/:locale`).

## Authentication (Phase 3)

- Sign in at `/login` with tenant slug, email, and password (`POST /auth/login`).
- Session tokens are stored in **sessionStorage**; bootstrap uses `GET /auth/me`.
- Access token refresh uses single-flight `POST /auth/refresh` on `401` responses.
- Navigation is **not** permission-filtered yet — `GET /auth/me` does not expose permissions (GAP-1).

## Git workflow

Feature work branches from **`abubakar`**. Open pull requests into **`abubakar`**.

**Note:** If an earlier phase PR is still open, merge it before later phases or expect stacked commits until `abubakar` is up to date.
