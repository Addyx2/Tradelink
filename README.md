# Tradelink

Tradelink is a production-oriented product foundation for Giants.earth focused on three core workflows:

- telemetric tracking for shipments
- eBDL document orchestration
- EUDR compliance at batch level

## Demo scope

The current MVP includes:

- executive dashboard
- shipment list and shipment detail views
- telemetry timeline and risk summaries
- batch traceability and compliance states
- eBDL document center
- supplier trust and incident overview
- role-aware Tradelink Copilot scaffold

## User roles

Tradelink is being shaped around these production roles, and the demo now supports dynamic role-based views for each booked-in user:

- `Trade Officer (Compliance)` — reviews EUDR evidence, due diligence, and release readiness
- `Trade Officer (Inspection)` — handles batch inspection, quality verification, and incident escalation
- `Trademaster` — oversees operations, shipment execution, approvals, and control-tower visibility
- `Supplier` — contributes batch provenance and supporting evidence
- `Client` — views shipment progress, readiness, and approved documents

In the current demo, role context can be provided through the `role` query parameter, and the app now also includes a server-side auth scaffold with cookie/session resolution and route guards. This is a transition step before integrating a real authentication provider.

## Current architecture

- `app/` for the Next.js application and route handlers
- `app/api/` for backend API endpoints
- `lib/data.ts` for current mock seed data
- `lib/queries.ts` for shared async domain query functions
- `lib/mappers.ts` for Prisma-to-UI mapping
- `prisma/schema.prisma` for the production data model
- `prisma/seed.ts` for demo seed data
- `auth.ts` for Auth.js configuration
- `lib/auth.ts` for server-side session and role resolution
- `lib/access.ts` for route access rules
- `types/next-auth.d.ts` for session typing

## Recommended next steps toward production

1. Add a production identity provider (email magic links, SSO, or enterprise OIDC)
2. Connect PostgreSQL and run Prisma migrations
3. Add organization-aware row-level access controls
4. Add evidence upload, audit logs, and approval workflows
5. Add map visualization and live telemetry ingestion
6. Add alert delivery via email, SMS, or in-app notifications

## Copilot

Tradelink now includes a role-aware Copilot scaffold:

- `Trademaster` copilot for cross-network operational summaries
- `Trade Officer (Compliance)` copilot for EUDR and release-readiness guidance
- `Trade Officer (Inspection)` copilot for anomaly triage and inspection actions
- `Supplier` copilot for submission and evidence completion help
- `Client` copilot for shipment and approved document visibility

Current implementation notes:

- UI route: `app/copilot/page.tsx`
- API route: `app/api/copilot/route.ts`
- current responses are scaffolded and role-safe by design
- future LLM integration should enforce strict role-based data boundaries and audit logging

## Vercel + Railway deployment

Recommended hosting split:

- **Vercel** → Next.js app, dashboards, Auth.js, API routes
- **Railway** → PostgreSQL and later backend workers if needed
- **R2/S3** → future document and evidence storage

See `DEPLOYMENT.md` for the full setup and deployment workflow.

## Environment setup

Copy `.env.template` to `.env` locally and fill in the real values for your environment.

## Run locally

```bash
npm install
cp .env.template .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The app now prefers database-backed reads through Prisma and falls back to mock data if the database is not yet available.

Auth.js is scaffolded with a credentials-based demo sign-in flow that can later be replaced with a real identity provider while preserving Tradelink's role model.

## Planned API endpoints

- `GET /api`
- `GET /api/shipments`
- `GET /api/shipments/:id`
- `GET /api/batches`
- `GET /api/documents`
- `GET /api/suppliers`
- `POST /api/copilot`

## Deployment files

- `vercel.json`
- `.env.template`
- `DEPLOYMENT.md`

## GitHub publishing

To publish this as a new GitHub project after local verification:

```bash
git init
git add .
git commit -m "Initial Tradelink platform scaffold"
```

Then create a new empty GitHub repository and connect it:

```bash
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

If you want me to help perform the git steps from this workspace, I can do that next, but pushing will require your GitHub repo URL and approval for git/network operations.
