# EFS — EVE Fitting Simulator (Monorepo)

MVP scaffold for a pyfa-like fitting simulator with a shared TypeScript core used by:
- Expo React Native mobile app (primary UX)
- Next.js web fit viewer service
- Fastify API for sharing and prices

## Workspaces
- `packages/core`: fit model, serialization, validation, base stats.
- `packages/datapack-seed`: small mock datapack.
- `apps/api`: fit sharing + prices batch API, SQLite.
- `apps/web`: Next.js `/fit/[id]` viewer + OG metadata.
- `apps/mobile`: Expo app shell with tabbed fitting flow.

## Quick start
```bash
pnpm install
pnpm --filter @efs/api dev
pnpm --filter @efs/web dev
pnpm --filter @efs/mobile dev
```

## Tests
```bash
pnpm --filter @efs/core test
```

## Notes
- See `docs/architecture.md` for implementation plan, serialization spec, and API contract.
- See `docs/feature-mapping.md` for requirement-to-module binding/status.
- See `docs/duplication-summary.md` for deduplication changes and rationale.
- See `docs/product/mvp-scope.md` for the MVP brief, success metrics, and signed scope priorities.
- See `docs/product/pilot-operations-plan.md` for pilot rollout, instrumentation, triage, and go/no-go process.
- Dogma effect pipeline is intentionally incremental (MVP legality + base stats first).

## Packaging

- Workspace package manager: `pnpm@9` (declared in root `package.json`).
- Publishable internal packages:
  - `@efs/core`
  - `@efs/datapack-seed`
- Build package artifacts:
  ```bash
  pnpm --filter @efs/core build
  pnpm --filter @efs/datapack-seed build
  ```
- Create tarballs for verification:
  ```bash
  pnpm --filter @efs/core pack
  pnpm --filter @efs/datapack-seed pack
  ```

> Apps (`apps/api`, `apps/web`, `apps/mobile`) are deployment targets and are not intended for npm publishing.

## MVP web flow
- `POST /v1/auth/guest` to create a guest session token.
- Open `/fit/<id>` and use **Fork to edit** as the core action.
- Review fit stats on the fit page and tune telemetry/visibility in `/settings`.

## Environment
- API: `PORT`, `WEB_BASE_URL`, `DATABASE_DIR`
- Web: `API_BASE_URL`
