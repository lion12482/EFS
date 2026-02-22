# EFS v1 Roadmap (Post-MVP)

## Document purpose
Define the first production (v1) scope after MVP pilot by combining:
- MVP quantitative targets and pilot instrumentation definitions.
- Pilot operational feedback loops and triage framework.
- Observed product constraints from the current MVP implementation.

---

## 1) MVP analytics + feedback review: highest-impact gaps

### Baseline targets (from MVP)
- Activation target: **>=45%** (`fit_saved_valid` in first session).
- W1 retention target: **>=25%** of activated users.
- Median time-to-valid-fit target: **<=8 minutes**.
- Share conversion target: **>=30%**.
- Validation reliability target: **>=99%**.

### Structured feedback channels considered
- Funnel events and KPI formulas defined in pilot operations.
- Weekly qualitative themes from interviews/support triage.
- Known MVP “Should” items not guaranteed in current release.

### Highest-impact gaps identified
1. **Saved fit discovery friction (browser/filter UX) slows repeat sessions**
   - Directly affects return behavior and repeat usage when users cannot quickly resume prior fits.
2. **Share-to-edit handoff is incomplete without robust fork flow**
   - Limits collaborative iteration and reduces the practical value of share links.
3. **Onboarding clarity gaps for less experienced users**
   - Causes early drop-off before first valid save; impacts activation and time-to-value.
4. **Validation mismatch/edge-case transparency**
   - Even rare inconsistencies erode trust in fit correctness and reduce retention.
5. **Rough cost awareness is missing/weak for decision-making loops**
   - Users leave to external tools before completing and saving alternatives.

---

## 2) Candidate feature scoring matrix

Scoring scale:
- **User impact / Revenue impact / Effort / Risk** scored 1–5.
- Higher is better for user/revenue; lower is better for effort/risk.
- **Priority score = (2 x User) + Revenue - Effort - Risk**.

| Candidate feature | User impact | Revenue impact | Effort | Risk | Priority score | Notes |
|---|---:|---:|---:|---:|---:|---|
| Saved fit browser + filters + recent/open-last | 5 | 4 | 2 | 2 | 10 | Primary retention lever for repeat fitting sessions. |
| Share-to-fork one-tap workflow (mobile + web parity) | 5 | 4 | 2 | 2 | 10 | Converts passive viewing into active creation/return sessions. |
| Guided onboarding + first-valid-fit checklist | 4 | 4 | 3 | 2 | 7 | Targets activation for moderate/new users. |
| Validation explainability + mismatch telemetry hardening | 4 | 3 | 3 | 3 | 5 | Trust/reliability foundation; protects existing users. |
| Price snapshot integration (baseline hull/module total) | 3 | 4 | 3 | 3 | 4 | Supports value perception but not as core as workflow friction fixes. |
| Segment dashboards + retention cohort reporting | 3 | 3 | 2 | 2 | 5 | Enables tighter product iteration; indirect user value. |

---

## 3) Selected v1 feature set

### Top user segments to support in v1
1. **Experienced fit builders** (power users optimizing many variants).
2. **Moderately experienced players** (need confidence + speed).
3. **Newer users** (need guided first-success path).

### v1 scope (frozen)
#### A. Retention + repeat usage drivers
1. **Saved fit browser overhaul**
   - Search, ship/hull filters, updated sorting, “continue last fit” shortcut.
2. **Share-to-fork optimization**
   - Clear CTA on share view, one-tap fork, immediate edit context.
3. **Session continuity improvements**
   - Persist recent fits and restore unsent local edits safely.

#### B. Top MVP friction removals
4. **Guided first valid fit flow**
   - Lightweight onboarding checklist and contextual hints for invalid states.
5. **Validation UX + reliability hardening**
   - Clear error categories, deterministic client/server parity checks, telemetry for mismatch diagnosis.

#### C. Segment support additions
6. **Basic cost snapshot in fit summary**
   - Optional “rough ISK estimate” surfaced with timestamp freshness note.

### Explicitly out of v1 scope
- Advanced simulation parity with mature fitting tools.
- Real-time collaboration/comments/roles.
- Corp governance and approval workflows.
- Deep historical market analytics.

---

## 4) v1 release criteria (scope freeze gates)

v1 is releasable only when all criteria below are met for two consecutive weekly windows.

### Performance
- P50 time from editor open to first validation response: **<=1.5s**.
- P95 fit save API latency: **<=800ms** under pilot-like load.
- P95 share page load (web): **<=2.0s**.

### Reliability
- Validation parity success (client/server on same payload): **>=99.5%**.
- API error rate on core endpoints (`save`, `fork`, `share-view`): **<1.0%** daily.
- No unresolved critical blocker older than **7 days**.

### Usability / adoption
- Activation: **>=50%** (raise from MVP baseline due to onboarding improvements).
- W1 retention: **>=30%**.
- Median time-to-first-valid-fit: **<=6 minutes**.
- Share-to-fork conversion (shared views producing fork): **>=20%**.
- Task success in usability checks (create, validate, save, share/fork): **>=85% unaided** across top 3 segments.

### Operational readiness
- Weekly dashboard live with segment cuts (experienced/moderate/new).
- Triage SLA met for critical issues in final two weeks pre-release.
- Runbook published for rollback + incident owner rotation.

---

## 5) v1 roadmap and milestone dates

## Timeline assumptions
- Start immediately after MVP pilot go/conditional-go decision.
- Calendar below uses a 12-week delivery arc.

| Milestone | Date | Outcome |
|---|---|---|
| M0: v1 planning freeze | **2026-02-24** | Feature scores validated; v1 scope frozen; owners assigned. |
| M1: Retention foundations complete | **2026-03-20** | Saved fit browser/filter improvements + session continuity shipped to pilot. |
| M2: Share/fork + onboarding uplift | **2026-04-10** | Share-to-fork one-tap flow and guided first-valid-fit UX in pilot. |
| M3: Reliability + cost snapshot | **2026-04-24** | Validation parity hardening and basic price snapshot available. |
| M4: Release candidate (RC) | **2026-05-08** | All release criteria trending green for first weekly window. |
| M5: v1 General Availability decision | **2026-05-15** | Criteria met for second weekly window; launch/no-launch review. |

### Milestone exit checks
- Each milestone requires: demo, metric snapshot, risk review, and explicit go-forward sign-off.
- Any new feature request after M0 enters **v1.1 backlog** unless tied to release criteria failure.

---

## Governance
- **Product owner:** Maintains scope and KPI thresholds.
- **Engineering owner:** Maintains feasibility, risk status, and rollout plan.
- **Weekly decision log:** Required; includes accepted scope changes (if any) and rationale.

Version history
- **v1.0 (2026-02-22):** Initial v1 roadmap, feature scoring, frozen scope, release criteria, and milestone plan.
