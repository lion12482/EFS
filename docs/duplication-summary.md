# Duplication summary

## What was duplicated

1. **Web API base URL resolution**
   - duplicated in:
     - `apps/web/lib/api.ts`
     - `apps/web/app/api/fits/[id]/fork/route.ts`

2. **Fit schema version literal (`"efs.fit.v1"`)**
   - duplicated in:
     - `packages/core/src/model/types.ts`
     - `packages/core/src/serialization/fitSchema.ts`
     - `apps/api/src/server.ts`

## Refactors applied

- Introduced a single source for web API base URL:
  - `apps/web/lib/config.ts` exports `API_BASE_URL`.
  - All web callers now import and reuse it.

- Introduced a single source for fit schema constant:
  - `packages/core/src/model/constants.ts` exports `FIT_SCHEMA_V1`.
  - Types/serialization/API validation now reference this constant.

## Remaining intentional duplication

- MVP UI screen scaffolds in mobile are intentionally repetitive placeholders (separate screen files) to keep navigation and feature expansion simple while editor flows are still being built.
