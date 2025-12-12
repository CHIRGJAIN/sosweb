## SOS Admin Frontend (Core / Ops / Partner)

Next.js 14 + TypeScript frontend-only dashboards for the SOS Command Center. All data, auth, and workflows are mocked with TanStack Query + Zustand so the UI can be wired to real endpoints later.

### Quickstart
- Install deps: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`

### Hardcoded Logins (mocked, frontend only)
- Core Admin: `core.admin@sos.local` / `core-ops-123` → `/core/command-center`
- Sub Admin (Ops): `ops.lead@sos.local` / `ops-ops-123` → `/ops/overview`
- Authority/Partner: `authority.partner@sos.local` / `authority-123` → `/partner/cases`
- NGO preview: `ngo.partner@sos.local` / `ngo-123`
- Business preview: `business.partner@sos.local` / `business-123`

Use the topbar role switcher after login to preview RBAC states for CORE_ADMIN, SUB_ADMIN, AUTHORITY, NGO, and BUSINESS.

### Route Map (App Router)
- Auth: `/login`
- Core Admin: `/core/command-center`, `/core/cases`, `/core/cases/[id]`, `/core/verification`, `/core/finance/ledger`, `/core/finance/disbursements`, `/core/finance/reservoir`, `/core/businesses`, `/core/campaigns`, `/core/vault`, `/core/publishing`, `/core/users`, `/core/roles`, `/core/audit`
- Sub Admin (Ops): `/ops/overview`, `/ops/cases`, `/ops/cases/[id]`, `/ops/finance`, `/ops/publishing`, `/ops/escalations`
- Partner / Authority / NGO / Business: `/partner/cases`, `/partner/cases/[id]`, `/partner/resolution`, `/partner/ngo/reports`, `/partner/business/campaigns`
- Marketing site (existing): `/(site)/*` stays intact under the site layout.

### Architecture Notes
- Mock data + API: `src/lib/mock/data.ts`, `src/lib/mock/api.ts` (Promises with latency, optimistic updates, audit log appends).
- Session & RBAC: `src/lib/mock/session.ts` (localStorage), `src/lib/rbac/*` (permission matrix).
- Shared types: `src/types/index.ts`.
- Reusable UI: `components/app-shell`, `components/common/DataTable`, `components/cases/*`, `components/evidence/*`, `components/finance/*`, `components/publishing/*`, `components/vault/*`, `components/users/*`, `components/audit/*`.
- State/query: TanStack Query provider lives in `src/components/providers.tsx`; light global state via Zustand.

### Plugging Real APIs Later
- Swap functions in `src/lib/mock/api.ts` with real fetchers; keep query keys stable to avoid rerenders.
- Replace `useSessionStore` login flow with real auth and inject tokens into the query client.
- CSV export is client-side today (`LedgerTabs`); point it to server exports if needed.

### Known Warnings
- `npm run lint` surfaces warnings from legacy `mobile/*` mock files and a React compiler notice for TanStack Table; no blocking errors after the dashboard rebuild.
