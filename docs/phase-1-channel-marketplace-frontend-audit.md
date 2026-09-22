# Phase 1 — Channel Marketplace Frontend Audit

**Project:** nexora-frontend (StockConnect / Nexora)  
**Backend:** nexora-backend (read-only inspection)  
**Date:** 2026-03-22  
**Branch:** `feat/phase-1-frontend-audit` → merge target `abubakar`

---

## 1. Executive Summary

The **nexora-frontend** repository is a greenfield project (single `README.md`, no `package.json`, no application code). Phase 2 must scaffold a **React 18.3.1 + JavaScript + MUI + Tailwind** SPA that consumes the existing **nexora-backend** native API at `/api/v1`, with optional awareness of `/api/v2` compatibility endpoints for merchant-style flows.

The backend exposes a **broad commerce and channel-management surface**: auth, RBAC (roles/permissions), tenants, products, inventory, pricing, offers, orders, shipments, returns, cancellations, marketplaces, channels, API keys, MFA, and audit logs. **No HTTP routes** were found for webhooks administration, job/queue monitoring, sync orchestration, dashboard aggregates, or user/membership CRUD—documented below as **BACKEND API GAPs**.

OpenAPI is generated at runtime (`/docs`, `/openapi.json` when `DOCS_ENABLED=true`). Frontend should treat route files and Zod schemas in the backend as the contract source of truth, with OpenAPI used for verification during development.

---

## 2. Frontend Current Architecture

| Area | Status |
|------|--------|
| React / build tool | **Not present** |
| package.json | **Not present** |
| TypeScript | **None** (target remains JS only) |
| MUI / Tailwind | **Not configured** |
| Routing, layouts, pages | **None** |
| API client, auth, state | **None** |
| Tests / ESLint / Prettier | **None** |
| Environment variables | **None** |

**Conclusion:** Full greenfield scaffold in Phase 2. No migration from TypeScript required. No reusable UI components exist yet (N/A for KEEP/REFACTOR audit).

---

## 3. Backend API Inventory

**Global conventions**

- **Base URL:** `{API_ORIGIN}/api/v1` (default backend port `3000`).
- **Auth (protected routes):** `Authorization: Bearer <accessToken>` **or** `Authorization: ApiKey <key>` / header `x-api-key`. Not both.
- **Public routes** (no auth): `/health/*`, `/docs`, `/openapi.json`, `/api/v1/foundation/*`, `/api/v1/auth/login|refresh|logout`, `POST /api/v1/tenants`, `GET /api/v1/tenants/:tenantId`.
- **Success envelope:** `{ success: true, data: ... }`.
- **Error envelope:** `{ success: false, error: { code, message, details? }, requestId }`.
- **Mutations (selected):** `Idempotency-Key` header required for `POST /api/v1/orders`, shipment creation, returns, cancellations (see route implementations).
- **Pagination:** Cursor-based (`limit`, `cursor`, `nextCursor`, `hasMore`) on most list endpoints; **audit** uses `limit` + `offset` + `total`.
- **Sorting:** No explicit sort query parameters on native v1 list endpoints inspected—filtering only where noted.
- **Docs:** Scalar UI at `/docs`; OpenAPI 3.1 at `/openapi.json`.

### AUTH

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/auth/login` | Public | Login: `{ tenantSlug, email, password }` → tokens |
| POST | `/api/v1/auth/refresh` | Public | `{ refreshToken }` → new tokens |
| POST | `/api/v1/auth/logout` | Public | Revoke refresh session |
| GET | `/api/v1/auth/me` | Bearer | Current user profile (no permissions in response) |

**Login response:** `{ accessToken, refreshToken, expiresIn }`.  
**Me response:** `{ id, email, status, tenantId, membershipStatus }`.

### PRODUCTS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/products` | Yes | List: `limit`, `cursor`, `status` |
| POST | `/api/v1/products` | Yes | Create product |
| GET | `/api/v1/products/:productId` | Yes | Get by id |
| PATCH | `/api/v1/products/:productId` | Yes | Update |
| POST | `/api/v1/products/:productId/deactivate` | Yes | Deactivate |
| POST | `/api/v1/products/:productId/archive` | Yes | Archive |
| GET | `/api/v1/products/:productId/content` | Yes | List localized content |
| PUT | `/api/v1/products/:productId/content/:locale` | Yes | Upsert content |

### INVENTORY

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/stock-locations` | Yes | List locations (full array) |
| POST | `/api/v1/stock-locations` | Yes | Create location |
| GET | `/api/v1/stock-locations/:stockLocationId` | Yes | Get location |
| GET | `/api/v1/inventory` | Yes | List balances; filter `stockLocationId` |
| GET | `/api/v1/inventory/:productId` | Yes | Balances for product |
| POST | `/api/v1/inventory/adjustments` | Yes | Adjust qty |
| POST | `/api/v1/inventory/receipts` | Yes | Receive stock |
| POST | `/api/v1/inventory/reservations` | Yes | Reserve |
| POST | `/api/v1/inventory/releases` | Yes | Release reservation |

### PRICING

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/prices` | Yes | List: `limit`, `cursor`, `productId`, `channelId`, `currency`, `status` |
| POST | `/api/v1/prices` | Yes | Create price |
| GET | `/api/v1/prices/:priceId` | Yes | Get price |
| PATCH | `/api/v1/prices/:priceId` | Yes | Update or deactivate via `status` |

### OFFERS (channel listings)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/offers` | Yes | List: cursor + filters |
| POST | `/api/v1/offers` | Yes | Create offer |
| GET | `/api/v1/offers/:offerId` | Yes | Get |
| PATCH | `/api/v1/offers/:offerId` | Yes | Update / lifecycle |
| POST | `/api/v1/offers/:offerId/activate` | Yes | Activate |

### ORDERS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/orders` | Yes | Create (requires `Idempotency-Key`) |
| GET | `/api/v1/orders` | Yes | List: cursor, `status`, `channelId`, `externalOrderReference`, `orderNumber`, date range |
| GET | `/api/v1/orders/:orderId` | Yes | Detail |
| POST | `/api/v1/orders/:orderId/confirm` | Yes | Confirm |

### SHIPMENTS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/orders/:orderId/shipments` | Yes | Create (idempotent) |
| GET | `/api/v1/shipments` | Yes | List: cursor, filters |
| GET | `/api/v1/shipments/:shipmentId` | Yes | Detail |
| POST | `/api/v1/shipments/:shipmentId/ship` | Yes | Mark shipped |
| POST | `/api/v1/shipments/:shipmentId/deliver` | Yes | Mark delivered |
| POST | `/api/v1/shipments/:shipmentId/cancel` | Yes | Cancel |

### CANCELLATIONS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/cancellations` | Yes | List |
| POST | `/api/v1/cancellations` | Yes | Create |
| GET | `/api/v1/cancellations/:cancellationId` | Yes | Get |
| POST | `/api/v1/orders/:orderId/cancel` | Yes | Cancel order |

### RETURNS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/orders/:orderId/returns` | Yes | Create return |
| GET | `/api/v1/returns` | Yes | List |
| GET | `/api/v1/returns/:returnId` | Yes | Detail |
| POST | `/api/v1/returns/:returnId/approve\|receive\|complete\|reject\|cancel` | Yes | Workflow |

### CHANNELS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/channels` | Yes | List; `status`, `marketplaceId` |
| POST | `/api/v1/channels` | Yes | Create |
| GET | `/api/v1/channels/:channelId` | Yes | Get |
| PATCH | `/api/v1/channels/:channelId` | Yes | Update name/refs/status |

### MARKETPLACES (INTEGRATIONS catalog)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/marketplaces` | Yes | List |
| POST | `/api/v1/marketplaces` | Yes | Create |
| GET | `/api/v1/marketplaces/:id` | Yes | Get |
| PATCH | `/api/v1/marketplaces/:id` | Yes | Update |

### AUTHORIZATION / SETTINGS (RBAC)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/permissions` | Yes | Global permission catalog |
| GET | `/api/v1/roles` | Yes | Tenant roles |
| POST | `/api/v1/roles` | Yes | Create custom role |
| GET | `/api/v1/memberships/:membershipId/roles` | Yes | Effective permissions for membership |
| POST | `/api/v1/memberships/:membershipId/roles` | Yes | Assign role |
| DELETE | `/api/v1/memberships/:membershipId/roles/:roleId` | Yes | Remove role |

### API KEYS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/api-keys` | Yes | List keys (no secret) |
| POST | `/api/v1/api-keys` | Yes | Create (secret once) |
| POST | `/api/v1/api-keys/:apiKeyId/rotate` | Yes | Rotate (session/step-up) |
| POST | `/api/v1/api-keys/:apiKeyId/revoke` | Yes | Revoke |

### MFA

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/mfa/totp/start` | Yes | Start enrollment |
| POST | `/api/v1/mfa/totp/verify` | Yes | Verify enrollment |
| POST | `/api/v1/mfa/totp/activate` | Yes | Activate |
| POST | `/api/v1/mfa/verify` | Yes | Step-up verify |
| POST | `/api/v1/mfa/recovery-code/use` | Yes | Use recovery code |

### TENANTS

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/tenants` | Public | Provision tenant |
| GET | `/api/v1/tenants/:tenantId` | Public | Get tenant |
| POST | `/api/v1/tenants/:tenantId/suspend\|reactivate\|close` | Yes | Lifecycle |

### LOGS (AUDIT)

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/audit` | Yes | Security audit events: `eventType`, `limit`, `offset` |

### OTHER

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/v1/foundation/ping` | Public | Health |
| POST | `/api/v1/foundation/echo` | Public | Pipeline test |
| GET | `/health/live`, `/health/ready` | Public | Ops |
| GET | `/internal/metrics` | Public* | Prometheus (*not for browser UI) |

### COMPATIBILITY `/api/v2` (optional UI module)

Merchant-style order/shipment/cancellation/return flows with **page-based** query params (`Page`, `ItemsPerPage`, etc.) and separate error shape on the v2 error handler. Same auth as v1. **Admin UI should prefer v1**; v2 relevant for parity/testing or embedded merchant tooling only.

---

## 4. Frontend-to-API Mapping

| Frontend module | Primary APIs | Readiness |
|-----------------|--------------|-----------|
| Login / session | Auth login, refresh, logout, me | **Ready** (permissions gap—see §21) |
| Dashboard | — | **Missing aggregates** |
| Products | `/products`, content sub-resource | **Ready** |
| Inventory | Stock locations + inventory mutations | **Ready** |
| Pricing | `/prices` | **Ready** |
| Offers | `/offers` | **Ready** |
| Orders | `/orders` | **Ready** |
| Shipments | `/shipments`, order nested create | **Ready** |
| Cancellations | `/cancellations` | **Ready** |
| Returns | `/returns` | **Ready** |
| Channels | `/channels` | **Ready** |
| Marketplaces | `/marketplaces` | **Ready** |
| Integrations (API keys) | `/api-keys` | **Ready** |
| Roles & permissions | `/permissions`, `/roles`, membership roles | **Partial** (no user list) |
| Security / MFA | `/mfa/*` | **Ready** |
| Audit / logs | `/audit` | **Ready** |
| Tenant admin | `/tenants` | **Partial** (platform vs tenant UX) |
| Sync / queue / webhooks UI | — | **Not exposed via HTTP** |
| Users / memberships admin | — | **Missing list/invite APIs** |

---

## 5. Existing Reusable Components

**None in frontend repository.** Phase 2 will introduce shared UI from scratch; no KEEP/REFACTOR/REPLACE inventory applies yet.

---

## 6. Code Duplication Findings

**N/A in frontend.** Recommendations for Phase 2+:

- Single **API client** (base URL, auth, idempotency helper, error normalization).
- Shared **cursor pagination** hook for v1 lists; separate **offset pagination** hook for audit.
- Central **status → color/label** maps per domain (order, shipment, offer, channel, product).
- One **money formatter** (`amountMinor` + ISO currency).
- One **date/time formatter** (ISO strings from API).
- **SweetAlert2** wrapper for destructive/sync confirmations only; toast/snackbar for routine feedback.
- Avoid duplicating MUI table column definitions—extract column factories per module.

---

## 7. Recommended Folder Structure

Greenfield-adapted layout (create only what Phase 2 needs):

```
src/
  main.jsx                 # Entry
  App.jsx
  assets/
  config/                  # env, feature flags
  constants/               # permission keys, route paths, status enums (mirror backend)
  routes/                  # route config + lazy imports
  layouts/                 # AppShell, AuthLayout
  pages/                   # One folder per domain module (auth, products, …)
  components/
    ui/                    # Thin wrappers: Button, DataTable shell, PageHeader
    common/                # EmptyState, ErrorState, LoadingBlock, ConfirmDialog bridge
    layout/                # Sidebar, TopBar, NavItem
    forms/                 # Shared field patterns
  hooks/                   # useAuth, useCursorQuery, usePermissions
  services/
    api/                   # apiClient.js + authService.js, productService.js, …
  theme/                   # MUI theme + design tokens
  utils/                   # formatters, error parsing
  validations/             # client-side form rules (mirror backend where needed)
  styles/                  # global.css + Tailwind directives
```

**Rationale:** Feature pages stay thin; services mirror backend modules; `components/ui` prevents one-off MUI styling sprawl; `theme/` owns tokens; Tailwind handles layout/spacing only.

---

## 8. API Layer Architecture

**Target flow:** Page → domain hook → service module → `apiClient` → backend.

**Centralize in `apiClient.js`:**

- `VITE_API_BASE_URL` (or equivalent) with `/api/v1` prefix helper.
- Attach `Authorization` from secure session storage.
- Optional `Idempotency-Key` generator for mutation helpers.
- Response interceptor: parse envelope; throw normalized `ApiError` with `code`, `message`, `status`, `requestId`.
- **401:** attempt refresh once, then logout redirect.
- **403:** show forbidden state; never assume UI hide equals authorization.
- **404 / 422 / 429 / 500:** mapped messages; 429 read `Retry-After` when present (v2 compatibility).
- **Network errors:** distinct user messaging vs validation.
- **AbortSignal** support for search/unmount cancellation.
- No retry on mutations by default; optional GET retry for transient 503.

Generate TypeScript-free JSDoc on `ApiError` and service methods only where signatures are non-obvious.

---

## 9. Design System Recommendation

**Direction:** Enterprise operational console (ChannelEngine-like density), not marketing SaaS.

**Tokens (centralize in MUI theme + CSS variables):**

- Font: system UI stack or **Inter** / **IBM Plex Sans** (single family).
- Base 14px body, 12px table/meta, clear hierarchy (600 for headings, 400 body).
- Neutral gray palette + one primary blue; semantic colors for success/warning/error/info.
- Border radius 4–6px (not pill cards); subtle borders over heavy shadows.
- 4px spacing grid; compact table row height (~40–44px).
- Status chips: muted backgrounds, consistent across modules.

Avoid gradients, glassmorphism, oversized hero cards, and animation-heavy transitions.

---

## 10. MUI + Tailwind Strategy

| MUI | Tailwind |
|-----|----------|
| Theme, Typography, Button, TextField, Select, Autocomplete, Dialog, Drawer, AppBar, Tabs, Tooltip, Alert, Snackbar, Table/DataGrid (pick one table strategy Phase 2), Pagination | Page layout, flex/grid, gap, responsive breakpoints, max-width containers, utility spacing |
| Form control states, a11y labels | Hide/show responsive nav |
| IconButton, Menu | `className` on layout wrappers only |

**Conflict avoidance:** Use MUI `sx` for component internals; Tailwind on layout `<div>` wrappers. Do not Tailwind-overwrite MUI input internals. Configure Tailwind `important` selector or prefix if needed.

---

## 11. Authentication Strategy

- Login form: `tenantSlug`, `email`, `password` → store `accessToken`, `refreshToken`, `expiresAt` (computed).
- Prefer **memory + sessionStorage** or **sessionStorage-only** for tokens (document threat model); never localStorage for long-lived secrets if avoidable.
- Proactive refresh before `expiresIn`; serialize refresh to avoid stampedes.
- `GET /auth/me` on app boot when token present.
- Protected routes wrapper; redirect to login with return URL.
- Logout calls backend revoke then clears client session.
- MFA flows as separate settings wizard using `/mfa/*` endpoints.
- API key management UI is separate auth path (human session only).

**Permissions:** Resolved server-side on each request; frontend needs permission list for UX—see API gap §21.

---

## 12. Error Handling Strategy

- Map backend `error.code` to user-safe messages; show `requestId` in support/details panel.
- Form errors: inline field errors for 422/validation `details`.
- Global error boundary for render failures.
- Route-level error boundaries for data loaders optional in Phase 3+.
- Log to console in dev only; no token/body logging in production.

---

## 13. Loading / Empty / Error State Strategy

- **Skeleton** rows for tables; **linear progress** for page transitions.
- **Empty:** contextual CTA (e.g. “Create channel”) when `items.length === 0` and not loading.
- **Error:** retry button + message; distinguish forbidden vs not found.
- List queries: `isLoading`, `isFetching`, `isError`, `error` from hooks (TanStack Query recommended in Phase 2—minimal dep, fits caching).

---

## 14. Data Table Strategy

- Server-driven **cursor pagination** for v1 lists; “Load more” or next/prev cursor buttons.
- **Audit log:** offset pagination with page size selector.
- Filters: only expose filters backed by query params (product status, order status, channelId, etc.).
- **No server sort** on most v1 endpoints—defer column sort UI or sort client-side within current page only (document limitation).
- Row actions: navigate to detail routes; bulk actions only where APIs exist (generally none yet).
- Reusable `DataTable` props: `columns`, `rows`, `loading`, `emptyMessage`, `paginationMode`, `onLoadMore`.

---

## 15. Form Strategy

- MUI form components + controlled state; optional **React Hook Form** if forms grow (evaluate Phase 2—avoid deps until needed).
- Mirror backend validation limits (string max lengths, UUID formats).
- Idempotency: auto-generate UUID for order/shipment/return creates.
- Unsaved changes: `beforeunload` + route blocker on dirty forms.
- Money inputs: edit major units, submit `amountMinor` integers.

---

## 16. Routing Strategy

- **React Router v6** with lazy `React.lazy` per major module.
- `/login` public; `/*` authenticated under `AppLayout`.
- Nested routes: e.g. `/orders`, `/orders/:orderId`, `/products/:productId/content`.
- 404 page inside app shell.

---

## 17. State Management Strategy

- **Server state:** TanStack Query (cache, invalidation on mutations).
- **Client state:** React context for auth session + optional permission snapshot; avoid global store until necessary.
- No Redux unless cross-cutting workflows demand it (unlikely early phases).

---

## 18. Performance Strategy

- Lazy routes by module.
- Debounced search (300ms) only when API supports text search (orders: `orderNumber`, `externalOrderReference`; products: no text search on list—gap/limitation).
- Cursor pagination—not client fetch-all.
- Query `staleTime` tuned per resource (catalogs longer, orders shorter).
- Cancel in-flight requests on filter change via `AbortSignal`.
- No optimistic updates on financial/inventory mutations unless idempotent responses are handled.

---

## 19. Security Findings

| Item | Status |
|------|--------|
| Secrets in repo | None yet; use `.env.example` only |
| CORS | Backend `SERVER_CORS_ORIGINS` must include frontend origin |
| XSS | Avoid `dangerouslySetInnerHTML` on product content; sanitize if rich text added later |
| CSRF | Bearer tokens in SPA—standard CORS + no cookie auth reduces CSRF |
| Route protection | Must implement in Phase 2 |
| Permission UI | Must not replace backend checks |
| API keys | Show secret once modal; never re-fetch secret |

---

## 20. Accessibility Findings

Greenfield: adopt MUI defaults (labels, focus rings). Requirements for Phase 2:

- Keyboard navigable sidebar and tables.
- Dialog focus trap (MUI Dialog).
- Live regions for toast announcements.
- Color contrast for status chips (WCAG AA).
- Form error text associated via `aria-describedby`.

---

## 21. Backend API Gaps

### GAP-1: Current user effective permissions

1. **Feature:** Hide nav/actions by permission; roles admin UX.  
2. **Available:** `GET /auth/me` (no permissions); `GET /memberships/:membershipId/roles` (requires membershipId).  
3. **Insufficient:** Frontend cannot derive permission set after login without membershipId.  
4. **Needs:** `string[]` permission keys for current session.  
5. **Ideal:** Extend `GET /auth/me` with `{ membershipId, permissions: string[] }` or add `GET /auth/me/permissions`.

### GAP-2: User & membership administration

1. **Feature:** Users list, invite, suspend membership.  
2. **Available:** Identity use cases exist internally; **no** `/api/v1/users` or membership list routes.  
3. **Insufficient:** No CRUD/list HTTP surface.  
4. **Needs:** Paginated users/memberships for tenant.  
5. **Ideal:** `GET/POST /api/v1/users`, `GET /api/v1/memberships`, lifecycle endpoints.

### GAP-3: Webhook subscription management UI

1. **Feature:** Configure webhook URLs and event types.  
2. **Available:** `webhooks` module in backend code; **not registered** in `create-server.js`.  
3. **Insufficient:** No HTTP API for frontend.  
4. **Needs:** CRUD for subscriptions, delivery history.  
5. **Ideal:** Register webhook routes documented in module.

### GAP-4: Queue / job monitoring

1. **Feature:** Sync job queue dashboard (ChannelEngine-style).  
2. **Available:** Queue config in backend env; worker process; **no** admin HTTP API found.  
3. **Insufficient:** No job status/list endpoint.  
4. **Needs:** Job counts, failures, retry visibility.  
5. **Ideal:** Read-only `/api/v1/jobs` or operations dashboard API.

### GAP-5: Dashboard aggregates

1. **Feature:** KPI dashboard (orders today, sync errors, stock alerts).  
2. **Available:** Domain list endpoints only.  
3. **Insufficient:** Would require many parallel list calls; no counts/metrics for tenant UI.  
4. **Needs:** Summary stats endpoint or documented aggregation strategy.  
5. **Ideal:** `GET /api/v1/dashboard/summary`.

### GAP-6: Product list text search

1. **Feature:** Search by SKU/title in catalog.  
2. **Available:** `GET /products` filters `status` + cursor only.  
3. **Insufficient:** No `q` or `merchantSku` query param.  
4. **Needs:** Server-side search/filter.  
5. **Ideal:** Query params on list products.

### GAP-7: Synchronization / channel sync orchestration

1. **Feature:** Trigger/list product or offer sync per channel.  
2. **Available:** Channels CRUD; offers/products separate; **no** sync run API found.  
3. **Insufficient:** No sync job trigger or status tied to channel.  
4. **Needs:** Sync run history and triggers.  
5. **Ideal:** Channel sync endpoints (if product requirement).

---

## 22. Production Risks

- Frontend repo has **no CI/CD, tests, or build** yet.
- Backend CORS must be configured before deployment.
- Token refresh race conditions if not serialized.
- Cursor pagination UX mistakes (losing filters between pages).
- Idempotency key omission on order/shipment flows → duplicate operations.
- Relying on `/api/v2` accidentally → inconsistent pagination/error handling.
- OpenAPI docs may lag route files—treat code as source of truth.
- Default branch on GitHub may still be `main`; PRs should target **`abubakar`** per team workflow.

---

## 23. Recommended Implementation Sequence

1. **Phase 2a — Scaffold:** Vite + React 18.3.1, JS, MUI, Tailwind, ESLint, env, path aliases, App shell (no feature data).  
2. **Phase 2b — Platform:** API client, auth flow, protected routes, session refresh, layout navigation.  
3. **Phase 2c — Design system baseline:** Theme tokens, typography, tables, forms, notifications, SweetAlert2 bridge.  
4. **Phase 3 — Catalog:** Products (+ content), inventory, pricing, offers.  
5. **Phase 4 — Commerce ops:** Orders, shipments, cancellations, returns.  
6. **Phase 5 — Channel config:** Marketplaces, channels, API keys.  
7. **Phase 6 — Admin:** Roles/permissions (within API limits), audit log, MFA settings.  
8. **Phase 7 — Dashboard & gaps:** Lightweight dashboard from list APIs or after backend GAP-5; defer sync/queue until APIs exist.

---

## 24. Files Planned for Phase 2

| File / area | Purpose |
|-------------|---------|
| `package.json` | React 18.3.1, MUI, Tailwind, Vite, React Router, TanStack Query |
| `vite.config.js` | Dev server, proxy optional |
| `tailwind.config.js`, `postcss.config.js` | Tailwind |
| `index.html`, `src/main.jsx`, `src/App.jsx` | Entry |
| `.env.example` | `VITE_API_BASE_URL` |
| `src/config/env.js` | Validated env |
| `src/services/api/apiClient.js` | HTTP + auth + errors |
| `src/services/api/authService.js` | Login/refresh/me |
| `src/hooks/useAuth.js` | Session hook |
| `src/routes/AppRoutes.jsx` | Lazy routes |
| `src/layouts/AppLayout.jsx`, `AuthLayout.jsx` | Shell |
| `src/theme/index.js` | MUI theme |
| `src/styles/global.css` | Tailwind imports |
| `eslint.config.js` | Lint |
| `src/pages/auth/LoginPage.jsx` | First vertical slice |

---

## 25. Git Branch Created

- **Base:** `abubakar` (tracking `origin/abubakar`, clean working tree at audit start).  
- **Feature branch:** `feat/phase-1-frontend-audit` (follows backend `feat/phase-*` convention).

---

## 26. Commit / PR Status

- Documentation added in this file; commit and PR to **`abubakar`** per team workflow (see git log after push).

---

## 27. Phase 2 Prerequisites

- [ ] Confirm API base URL and CORS origins for local/dev/prod.  
- [ ] Confirm test tenant slug + user credentials for integration testing.  
- [ ] Decide default PR target branch (`abubakar`) on GitHub.  
- [ ] Product owner prioritization on **API gaps** (permissions on `/me` is highest for RBAC UI).  
- [ ] Node.js LTS version aligned with Vite/MUI.  
- [ ] Optional: export OpenAPI JSON from running backend for client codegen reference (manual, not TypeScript codegen required).

---

*Backend inspection: read-only. No backend files modified.*
