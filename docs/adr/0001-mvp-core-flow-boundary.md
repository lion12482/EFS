# ADR 0001: MVP core flow boundary

## Status
Accepted

## Context
v1 needs only the highest value flow operational end-to-end:
1. user authentication,
2. a single core action,
3. result rendering,
4. a minimum settings surface.

## Decision
- Use **guest authentication** via short-lived bearer token backed by `user_sessions`.
- Keep the core action as **fit fork** from an existing fit (`POST /v1/fits/:id/fork`).
- Keep result view as existing fit stats payload (`GET /v1/fits/:id`).
- Add minimal settings (`telemetryEnabled`, `defaultVisibility`) through `/v1/settings`.

## Consequences
- We avoid pre-v1 complexity like full identity providers and profile management.
- API contracts remain compatible with future account upgrades by keeping `user_id` as first-class key.
