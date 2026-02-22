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
