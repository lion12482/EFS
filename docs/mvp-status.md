# MVP Status

Source of truth for scope: `docs/product/mvp-scope.md`.

## Must

- [x] **DONE** Core fit model + serialization compatibility across apps  
  Implemented in: `packages/core/src/model/types.ts`, `packages/core/src/model/constants.ts`, `packages/core/src/serialization/fitSchema.ts`, `apps/api/src/server.ts`, `apps/mobile/src/store/useFitStore.ts`, `apps/web/lib/api.ts`

- [x] **DONE** Legality validation for supported fitting constraints  
  Implemented in: `packages/core/src/engine/validation.ts`

- [x] **DONE** Baseline stats computation for first-pass fit decisions  
  Implemented in: `packages/core/src/engine/stats.ts`, consumed by `apps/api/src/server.ts` and `apps/mobile/src/screens/StatsScreen.tsx`

- [ ] **PARTIAL** Mobile fitting flow for create/edit/save fits  
  Current state: app shell and in-memory current fit exist, but no persisted create/edit/save workflow yet.  
  Relevant files: `apps/mobile/src/App.tsx`, `apps/mobile/src/store/useFitStore.ts`, `apps/mobile/src/screens/EditorScreen.tsx`, `apps/mobile/src/screens/FitsScreen.tsx`, `apps/mobile/src/db/schema.sql`

- [x] **DONE** API persistence for fits + share endpoint  
  Implemented in: `apps/api/src/server.ts`, `apps/api/src/db.ts`, `apps/api/migrations/001_init.sql`, `apps/api/migrations/002_auth_settings_observability.sql`

- [x] **DONE** Web fit viewer with stable, shareable URL  
  Implemented in: `apps/web/app/fit/[id]/page.tsx`, `apps/web/lib/api.ts`

## Should

- [x] Fit fork workflow from shared fit (`apps/api/src/server.ts`, `apps/web/app/api/fits/[id]/fork/route.ts`, `apps/web/app/components/ForkButton.tsx`)
- [x] Basic price snapshot integration (`apps/api/src/server.ts` `/v1/prices/batch`, `packages/datapack-seed/src/index.ts`)
- [ ] Improved fit browser/filter UX for saved/shared fits (not implemented in web/mobile UI)

## Later

- [ ] Advanced simulation and deeper dogma/effect accuracy
- [ ] Fleet/corp collaboration and governance tooling
- [ ] Rich recommendation systems
- [ ] Comprehensive historical pricing/market intelligence

## Mobile scope: minimum next steps

1. Add local SQLite-backed fit repository wiring `apps/mobile/src/db/schema.sql` to store/load fits.
2. Implement create + rename + save actions in `EditorScreen` with store mutations.
3. Implement fit list/read/open in `FitsScreen` (replace placeholder text).
4. Add explicit dirty-state + save feedback to prevent silent loss of edits.
5. Add API share/fork handoff entry in mobile browser flow for shared URLs.
