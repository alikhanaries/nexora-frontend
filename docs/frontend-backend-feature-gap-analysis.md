# Nexora Frontend ↔ Backend Feature Gap Analysis

**Generated:** 2026-09-29  
**Backend reference:** `nexora-backend/docs/API_ROUTE_INVENTORY.md` (147 unique HTTP routes on main server; **99** authenticated `/api/v1/*` business routes reviewed for UI parity)  
**Frontend reference:** `nexora-frontend` on branch `feat/frontend-backend-feature-parity`

## Summary counts (verified)

| Metric | Count |
| ------ | ----: |
| Backend modules with `/api/v1` user-facing operations | 22 |
| `/api/v1` routes in inventory (excl. health/docs/worker) | 99 |
| `/api/v2` + `/api/v2/ce/*` compatibility routes | 48 |
| Frontend gaps **closed in this parity branch** | 6 |
| Frontend gaps **remaining (blocked or out of scope)** | 12 |
| Capabilities **intentionally excluded** (non-UI / M2M) | 8 |

---

## Module matrix ( `/api/v1` — primary UI scope )

| Module | Backend (verified) | Permission(s) | Frontend before parity | Status after parity work |
| ------ | ------------------- | ------------- | ---------------------- | ------------------------ |
| Auth | login, logout, refresh, me | public / bearer | Login, session | **Complete** |
| Products | CRUD, deactivate, archive, content list/upsert | products.* | List, detail, edit, content | **Complete** |
| Inventory | list, by product, adjust, receipt, reserve, release | inventory.* | Inventory page + stock locations in service | **Complete** (stock locations via inventory UI) |
| Pricing | list, create, get, patch | pricing.* | Full CRUD UI | **Complete** |
| Offers | list, create, get, patch, activate | offers.* | Full CRUD + activate | **Complete** |
| Orders | list, create, get, confirm | orders.* | List, detail, create, confirm, cancel | **Complete** |
| Shipments | list, get, ship, deliver, cancel; create from order | shipments.* | Full workflows | **Complete** |
| Returns | list, get, approve, reject, receive, complete, cancel; create from order | returns.* | List, detail, transitions | **Complete** |
| Cancellations | list, create, get; order cancel | cancellations.* | Full UI | **Complete** |
| Marketplaces | list, create, get, patch | marketplaces.read / manage | Service only; **no routes** | **Implemented** (routes, nav, CRUD pages) |
| Channels | CRUD + marketplace connection CRUD/test | channels.* | Full + connection panel | **Complete** |
| API keys | list, create, revoke, rotate | api_keys.* | Built on branch; **not wired on abubakar** | **Implemented** (routes + nav) |
| Webhooks | CRUD, deliveries, rotate-secret | webhooks.* | Built on branch; **not wired** | **Implemented** (routes + nav) |
| Audit | GET list (cursor/offset filters) | audit.read | Page existed; **route → placeholder** | **Fixed** (AuditRoutes mounted, nav enabled) |
| Settings / MFA | totp start/verify/activate, verify, recovery | mfa.manage (enrollment) | Phase 19 code; **not on abubakar** | **Implemented** (Settings route + user menu) |
| Permissions catalog | GET /permissions | (authorized) | Used by API key form | **Complete** |
| Roles | GET/POST /roles | roles.read / manage | None | **Blocked** — no membership admin UX without user list + membershipId |
| Membership roles | GET/POST/DELETE memberships/:id/roles | roles.manage | None | **Blocked** — `GET /auth/me` has no `membershipId` |
| Tenants | create, get, suspend, close, reactivate | tenant admin / public mix | None | **Excluded** — platform onboarding, not tenant app shell |
| Foundation | ping, echo | bearer | None | **Excluded** — ops/diagnostics |
| Inbound marketplace webhooks | POST ingress token | token | None | **Excluded** — marketplace → Nexora ingress, not user UI |
| Overview / dashboard | *none* | — | Placeholder `/` | **Implemented** — module hub (no fake KPIs) |

---

## Gaps closed in `feat/frontend-backend-feature-parity`

1. **Administration wiring** — Mount `audit/*`, `api-keys/*`, `webhooks/*`, `settings/*` in `AppRoutes.jsx`; enable nav (`futureModule: false`).
2. **Audit placeholder bug** — `/audit` no longer maps to `ModulePlaceholderPage`.
3. **API keys & webhooks** — Import phase 13/14 modules; permissions catalog hook for scope selection.
4. **Settings & MFA** — Settings page, MFA hooks/service, user menu link.
5. **Marketplaces** — Full module from phase 12: routes, nav, list/create/detail/edit.
6. **Overview** — Real `OverviewPage` (module launcher from `navigationConfig`, no dashboard API).

---

## Remaining gaps (documented)

| Gap | Reason | Dependency |
| --- | ------ | ---------- |
| Role & permission administration UI | No pages for `/roles`, membership role assignment | `GET /auth/me` should expose `membershipId`; optional `GET /users` for admin picker |
| Full nav/route permission enforcement UX | `isRbacAvailable === false` | `/auth/me` should expose `permissions` and/or `roles` |
| Tenant lifecycle UI | Backend supports tenant admin APIs | Product decision + `tenant.admin` UX scope |
| Sync / Queue / Integrations hub | No `/api/v1` counterparts | Future backend modules |
| ChannelEngine test/live toggle | Not in backend model | Backend environment/tenant design |
| Dashboard KPIs / analytics | No aggregate API | New backend read APIs |
| `/api/v2` Merchant compatibility | 48 routes for StockConnect/CE clients | Separate integration admin or docs-only |
| `/api/v2/ce/*` StockConnect CE | API-key oriented | Not Nexora tenant UI scope |
| Audit export | Only GET list verified | Backend export endpoint if required |
| User profile PATCH / change password | Not in route inventory | Identity HTTP routes |
| Dedicated stock-locations admin section | APIs exist; folded into Inventory | Optional nav split |
| Cancellation PATCH | Only list/create/get in inventory | Verify backend — no PATCH in inventory doc |

---

## RBAC

| Item | Status |
| ---- | ------ |
| Backend RBAC | **Implemented** (`requirePermission` on use cases) |
| `GET /auth/me` permissions | **Not exposed** (id, email, status, tenantId, membershipStatus only) |
| Frontend `usePermissions()` | Ready; `can()` false when RBAC unavailable |
| Route guards | Pass-through when RBAC unavailable; enforce when data present |
| Action buttons | `canShowPermissionAction` — show when RBAC unavailable; API 403 authoritative |
| 401 / 403 | `ErrorState`, `AccessDeniedPage`, form alerts via `getUserFacingMessage` |

---

## Intentionally excluded from frontend parity

- Worker observability routes (`/health/live` on worker listener)
- Public tenant registration flows (unless product adds onboarding wizard)
- Marketplace webhook ingress URL configuration (adapter/token provisioning is ops)
- Compatibility layer REST (`/api/v2/*`) — machine clients, not merchant UI

---

## Verification

- `npm run lint` — pass (parity branch)
- `npm run build` — pass (parity branch)
- Live API — manual against local/staging when credentials available

**Backend changes:** None (frontend-only parity work).
