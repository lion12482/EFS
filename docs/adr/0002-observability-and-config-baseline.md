# ADR 0002: Observability and config baseline for MVP

## Status
Accepted

## Context
The MVP must be production-safe without introducing heavy platforms.

## Decision
- Centralize env parsing through zod (`apps/api/src/config.ts`, `apps/web/lib/config.ts`).
- Persist application errors into `app_errors` and emit structured logs through Fastify.
- Track critical funnel analytics events in `analytics_events`:
  - `auth_guest_created`
  - `fit_created`
  - `fit_forked`
  - `settings_updated`
  - `prices_batch_requested`
- Define request/response contracts in zod (`apps/api/src/contracts.ts`) and include obvious v1 extensions (`profileName`, `preferredHullTypeId`).

## Consequences
- Teams can add external observability providers later without changing endpoint behavior.
- Event and config baselines are explicit and testable in CI.
