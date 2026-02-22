# MVP Scope Brief

## Product context
EFS (EVE Fitting Simulator) MVP aims to let players create, validate, and share ship fits quickly across mobile and web using a shared core model.

## Primary user persona
**Practical Theorycrafter (Primary Persona)**
- **Who:** Active EVE player (intermediate to advanced) who frequently compares ship fittings for PvE/PvP.
- **Current behavior:** Uses spreadsheets, in-game fitting window, and external tools to iterate fits.
- **Core need:** Fast feedback on fit legality and baseline stats, plus easy sharing to fleetmates/corp.
- **Success criteria from user perspective:** “I can build and validate a viable fit in minutes and share a link without manual re-entry.”

## Top pain points the MVP must solve
1. **Slow, fragmented fitting workflow** across tools causes context switching and rework.
2. **Low confidence in fit correctness** when legality and baseline stats are not validated consistently.

## Explicit MVP non-goals
- Full parity with mature tools (e.g., advanced simulation, complete dogma/effect chain coverage).
- Market/economy optimization features (historical pricing analytics, advanced buy-plan optimization).
- Collaboration features beyond simple share/fork (real-time co-editing, comments, role permissions).
- Corp/alliance-scale management workflows (fit governance, approval pipelines).

## Measurable success metrics (MVP)
1. **Activation rate:** ≥ 45% of new users create and save at least one valid fit within first session.
2. **Weekly retention (W1):** ≥ 25% of activated users return in the following 7 days.
3. **Task completion time:** Median time to create and validate a legal fit ≤ 8 minutes.
4. **Share conversion:** ≥ 30% of users who save a fit generate at least one share view (open of `/fit/[id]`).
5. **Validation reliability:** ≥ 99% successful legality checks for supported fitting rules (no server/client mismatch on same payload).

## Scope by priority

### Must (in MVP)
- Core fit model + serialization compatibility across apps.
- Legality validation for supported fitting constraints.
- Baseline stats computation needed for first-pass fit decisions.
- Mobile fitting flow for create/edit/save fits.
- API persistence for fits + share endpoint.
- Web fit viewer with stable, shareable URL.

### Should (if capacity allows)
- Fit fork workflow from shared fit.
- Basic price snapshot integration for rough cost awareness.
- Improved fit browser/filter UX for saved/shared fits.

### Later (post-MVP)
- Advanced simulation and deeper dogma/effect accuracy.
- Fleet/corp collaboration and governance tooling.
- Rich recommendation systems (module suggestions, optimization).
- Comprehensive historical pricing and market intelligence.

## Stakeholder sign-off (required before implementation)
**Scope decision:** ✅ Approved for MVP implementation start.

- **Product stakeholder:** Requestor (project owner)
- **Engineering stakeholder:** Repository maintainer
- **Decision date:** 2026-02-22
- **Notes:** Implementation should remain constrained to **Must** scope unless explicit re-approval is documented in this file.

---

Version history
- **v1.0 (2026-02-22):** Initial MVP scope, success metrics, prioritization, and sign-off.
