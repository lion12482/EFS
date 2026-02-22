# EFS (EVE Fitting Simulator) Architecture

## 1) Implementation plan

### MVP (Phase 1)
- **Shared core package (`@efs/core`)**
  - Versioned fit model + serializer.
  - Data pack adapter (seed now, SDE later).
  - Validation engine: slot counts, CPU, PG, calibration, charge/module compatibility.
  - Basic stats: raw HP/resists/EHP, capacitor baseline, velocity baseline, total ISK.
- **API service (`apps/api`)**
  - REST endpoints: create/get/fork shared fit; batch prices.
  - SQLite persistence for fit versions and cached prices.
  - Stub upstream price adapter with swappable provider interface.
- **Web (`apps/web`, Next.js App Router)**
  - Viewer-first route `/fit/[id]`.
  - Display fit + key stat cards from shared core outputs.
  - Fork button (POST to API, redirect to new fit URL).
  - OG metadata per fit.
- **Mobile (`apps/mobile`, Expo RN)**
  - Tabbed shell: Fits, Editor, Stats, Browser, Settings.
  - Local fit library (SQLite), basic editor with add/remove modules.
  - Validation warnings and summary stats.
  - Share action calling API to publish fit URL.
- **Data pack**
  - Ship/module seed data in `packages/datapack-seed`.
  - Data pack versioning and TODO hooks for remote update checks.
- **Testing**
  - Unit tests in core: validation legality + serialization stability.

### v1 (Phase 2)
- Skill modes (All V / My Character / Custom) and differential stat display.
- Expanded dogma effect pipeline (stacking, module effects, range/application).
- ESI SSO PKCE integration for import/push fittings.
- Web editor and richer diff/fork history.
- Data pack updater endpoint + fit invalidation/changelog report.

## 2) Monorepo structure proposal

```txt
apps/
  api/                # Fastify REST API + SQLite
  web/                # Next.js viewer (App Router)
  mobile/             # Expo React Native app
packages/
  core/               # Shared fit model/engine/serialization
  datapack-seed/      # Seed data pack (SDE-derived shape)
docs/
  architecture.md     # Plan/spec/API contract
```

## 3) Fit serialization spec (stable, versioned)

```json
{
  "schemaVersion": "efs.fit.v1",
  "fitId": "uuid",
  "createdAt": "2026-02-20T12:00:00.000Z",
  "updatedAt": "2026-02-20T12:00:00.000Z",
  "visibility": "public | unlisted",
  "name": "Kestrel - Rocket Brawl",
  "hullTypeId": 603,
  "skillMode": {
    "mode": "all_v | character | custom",
    "characterId": 123456,
    "profile": { "3300": 4 }
  },
  "slots": {
    "high": [
      { "typeId": 10631, "chargeTypeId": 2512, "state": "online" }
    ],
    "mid": [
      { "typeId": 3841, "state": "online" }
    ],
    "low": [
      { "typeId": 2048, "state": "online" }
    ],
    "rig": [
      { "typeId": 31790, "state": "online" }
    ]
  },
  "drones": [
    { "typeId": 23707, "quantity": 2 }
  ],
  "metadata": {
    "tags": ["pvp", "frigate"],
    "favorite": false,
    "notes": "Optional webifier swap"
  }
}
```

Rules:
- `schemaVersion` required for migrations.
- Arrays preserve user slot order.
- Share never mutates existing fit blob; fork creates new `fitId`.
- Unknown fields tolerated and round-tripped where feasible.

## 4) API contract (MVP)

Base path: `/v1`

### `POST /v1/fits`
Create shared fit version.

Request:
```json
{
  "fit": { "schemaVersion": "efs.fit.v1", "name": "Kestrel", "hullTypeId": 603, "slots": {"high":[],"mid":[],"low":[],"rig":[]}, "drones":[] },
  "visibility": "unlisted"
}
```

Response `201`:
```json
{
  "id": "fit_2Yk...",
  "version": 1,
  "url": "https://example.com/fit/fit_2Yk..."
}
```

### `GET /v1/fits/:id`
Fetch shared fit.

Response `200`:
```json
{
  "id": "fit_2Yk...",
  "version": 1,
  "visibility": "unlisted",
  "fit": { "schemaVersion": "efs.fit.v1", "name": "Kestrel", "hullTypeId": 603, "slots": {"high":[],"mid":[],"low":[],"rig":[]}, "drones":[] },
  "stats": {
    "cpuUsed": 12,
    "cpuMax": 150,
    "powergridUsed": 8,
    "powergridMax": 38,
    "ehp": 1234
  }
}
```

### `POST /v1/fits/:id/fork`
Create new fit/version from an existing fit.

Request:
```json
{ "name": "Kestrel fork" }
```

Response `201`:
```json
{
  "id": "fit_9ab...",
  "parentId": "fit_2Yk...",
  "version": 1,
  "url": "https://example.com/fit/fit_9ab..."
}
```

### `POST /v1/prices/batch`
Batch price lookup + cache refresh-on-demand.

Request:
```json
{ "typeIds": [603, 10631, 2512] }
```

Response `200`:
```json
{
  "asOf": "2026-02-20T12:00:00.000Z",
  "items": [
    { "typeId": 603, "price": 420000, "currency": "ISK", "source": "stub-hub", "stale": false }
  ]
}
```

Notes:
- API uses lightweight guest auth for fit creation/fork/settings; fit viewing remains shareable by fit id.
- Price cache TTL target: 6h; refresh only requested `typeIds`.


## 6) Deduplication decisions (current state)

- **Web API base URL is centralized** in `apps/web/lib/config.ts` and reused by server routes/loaders so API target logic is not duplicated.
- **Fit schema version remains centralized** as `FIT_SCHEMA_V1` in `packages/core/src/model/constants.ts`; API/runtime checks import this constant directly.
- **Intentional duplication:** Mobile screen placeholders are still split by feature (`Fits`, `Editor`, `Stats`, `Browser`, `Settings`) to keep MVP iteration isolated while create/edit/save UX is unfinished.
