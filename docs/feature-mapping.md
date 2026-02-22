# Feature-to-Implementation Mapping (MVP coherence)

This document binds product requirements to concrete modules so each feature has a clear owner.

## Core fitting simulator

| Requirement | Module(s) | Status |
|---|---|---|
| Hull + module + rig + drone + charge fit model | `packages/core/src/model/types.ts` | ✅ implemented |
| Stable fit serialization/versioning | `packages/core/src/serialization/fitSchema.ts` | ✅ implemented (`efs.fit.v1`) |
| Legality checks: slot count, CPU, PG, calibration | `packages/core/src/engine/validation.ts` | ✅ implemented |
| Compatibility checks: slot mismatch, charge validity/size | `packages/core/src/engine/validation.ts` | ✅ implemented |
| Basic outputs: HP/resists/EHP/cap/mobility/ISK | `packages/core/src/engine/stats.ts` | ✅ implemented (baseline) |

## Mobile-first app

| Requirement | Module(s) | Status |
|---|---|---|
| Tabbed nav shell | `apps/mobile/src/App.tsx` | ✅ implemented |
| Fit editor baseline | `apps/mobile/src/screens/EditorScreen.tsx`, `apps/mobile/src/store/useFitStore.ts` | 🟡 scaffold |
| Stats summary panel | `apps/mobile/src/screens/StatsScreen.tsx` | ✅ implemented |
| Local fit + price persistence schema | `apps/mobile/src/db/schema.sql` | ✅ schema implemented |

## Web viewer + URL sharing

| Requirement | Module(s) | Status |
|---|---|---|
| Share URL viewer (`/fit/:id`) | `apps/web/app/fit/[id]/page.tsx` | ✅ implemented |
| OG metadata | `apps/web/app/fit/[id]/page.tsx` | ✅ implemented |
| Fork creates new fit id/version | `apps/web/app/api/fits/[id]/fork/route.ts`, `apps/api/src/server.ts` | ✅ implemented |
| Deep-link hint to mobile | `apps/web/app/fit/[id]/page.tsx` | ✅ implemented |

## API + server data

| Requirement | Module(s) | Status |
|---|---|---|
| Create fit share entry | `apps/api/src/server.ts` (`POST /v1/fits`) | ✅ implemented |
| Get fit by id | `apps/api/src/server.ts` (`GET /v1/fits/:id`) | ✅ implemented |
| Fork fit | `apps/api/src/server.ts` (`POST /v1/fits/:id/fork`) | ✅ implemented |
| Batch price lookup + 6h TTL | `apps/api/src/server.ts` (`POST /v1/prices/batch`) | ✅ implemented |
| Server persistence | `apps/api/migrations/001_init.sql` | ✅ implemented |

## Data pack updates and ESI/skills (v1)

| Requirement | Module(s) | Status |
|---|---|---|
| Datapack update download/check | Planned in `apps/mobile` Settings + API updater endpoint | ⏳ planned |
| ESI SSO PKCE import/push fittings | Planned in mobile + API auth layer | ⏳ planned |
| Skill modes and delta stats | `skillMode` already in fit schema; math pipeline expansion pending | 🟡 partial |

## Notes
- Current MVP intentionally prioritizes legality correctness and shared output determinism over full dogma parity.
- All share mutations are append-only: forking creates a new fit id and never edits existing shared blobs.
