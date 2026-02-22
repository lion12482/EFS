# MVP Pilot Operations Plan

## Objective
Run a controlled MVP pilot with a small cohort, collect reliable funnel and feedback signals, and make a go/no-go recommendation for broader launch after 2–4 weeks.

## 1) Pilot release to a small cohort (10–50 users/accounts)

### Cohort size and phases
- **Week 0 (soft launch):** 10 users/accounts.
- **Week 1–2 (expansion):** Increase to 25 users if no critical blockers remain open for >48h.
- **Week 2–4 (full pilot):** Expand to 50 users if activation and support load stay within thresholds.

### Cohort composition
- 40% experienced fit builders.
- 40% moderately experienced users.
- 20% newer users (to pressure-test onboarding clarity).

### Entry criteria
- Invite-only access list (email/account allowlist).
- Baseline support channel enabled (in-app link to issue form + shared inbox).
- Release notes shared with known constraints and MVP non-goals.

### Exit criteria for pilot completion
- Minimum 2 full weekly data cycles captured.
- At least 20 activated accounts observed.
- At least 8 qualitative interviews completed.

## 2) Instrument onboarding and core usage funnel events

### Event instrumentation principles
- Use a single `user_id`/`account_id` across mobile/web/API events.
- Include `timestamp`, `platform`, `app_version`, and `session_id` on every event.
- Capture success/failure and error reason for key actions.

### Required funnel events

| Funnel stage | Event name | Trigger | Core properties |
|---|---|---|---|
| Onboarding start | `onboarding_started` | User opens onboarding first step | `entry_point`, `platform` |
| Onboarding complete | `onboarding_completed` | User finishes onboarding flow | `duration_sec`, `steps_completed` |
| First fit created | `fit_created` | New fit object persisted | `ship_hull`, `source` |
| Fit validated | `fit_validation_run` | Validation executed | `is_valid`, `error_count`, `error_types` |
| First valid fit saved (activation) | `fit_saved_valid` | Save action with valid fit | `time_from_signup_sec`, `slot_counts` |
| Share initiated | `fit_share_link_created` | Share link generated | `fit_id`, `channel` |
| Share viewed | `fit_share_viewed` | `/fit/[id]` viewed | `fit_id`, `viewer_type` |
| Return session | `session_started` | Any session start after day 0 | `days_since_signup`, `platform` |
| Conversion signal | `pilot_upgrade_intent` | User expresses paid/continued intent | `intent_source`, `plan_hint` |

### KPI formulas
- **Activation:** users with `fit_saved_valid` in first session / new pilot users.
- **W1 retention:** activated users with `session_started` between day 7–13 / activated users.
- **Share conversion:** users with `fit_share_viewed` / users with `fit_saved_valid`.

## 3) Weekly review cadence

### Cadence
- **Frequency:** Weekly, fixed 45-minute review.
- **Attendees:** Product, engineering, support/research owner.
- **Inputs due:** 24h before meeting.

### Quantitative review packet
- New users invited/active.
- Activation, retention (D1/W1), conversion to share usage.
- Median time-to-first-valid-fit.
- Top error codes and failure rates by platform/app version.

### Qualitative review packet
- Interview highlights (what worked, what blocked completion).
- Support ticket themes and volumes.
- Usability friction clips/examples.
- “Most requested” improvements count.

### Weekly outputs
- Updated issue triage labels and priorities.
- Decision log with owner + due date for each high-priority action.
- Explicit recommendation: continue as-is / continue with constraints / pause expansion.

## 4) Issue triage framework

### A) Critical blockers (fix immediately)
Criteria:
- Prevents onboarding completion, fit save, or validation for multiple users.
- Data loss/corruption or severe reliability/security issue.

SLA:
- Triage within same business day.
- Hotfix target within 24–48 hours.

### B) Usability improvements (batch)
Criteria:
- Users can complete workflow but with notable confusion/friction.
- Repeated support volume or interview pain point without total task failure.

SLA:
- Aggregate weekly.
- Batch into next pilot patch window.

### C) v1 candidates (defer)
Criteria:
- Valuable but outside MVP scope or not materially affecting pilot success metrics.
- Requires larger architectural/design work best handled after launch decision.

SLA:
- Tag as `v1-candidate`.
- Re-rank after go/no-go outcome.

## 5) Go/No-Go recommendation document (after 2–4 weeks)

### Decision timing
- Earliest at end of week 2 (only if signal quality is high and blockers are resolved).
- Default at end of week 4.

### Required sections
1. **Executive summary** (recommended decision + confidence).
2. **Pilot scope and cohort** (size, composition, timeline).
3. **Metric outcomes vs targets** (activation, retention, conversion).
4. **Qualitative insights** (top themes, representative quotes).
5. **Risk register** (open blockers, mitigation, owner).
6. **Recommendation**:
   - **Go:** expand rollout + launch checklist.
   - **Conditional Go:** launch with explicit constraints and follow-up dates.
   - **No-Go:** pause launch, define remediation milestones.
7. **Next 30-day plan** (delivery commitments and checkpoints).

### Decision rule of thumb
- **Go** when all are true:
  - No unresolved critical blocker older than 7 days.
  - Activation and share conversion are within 10% of MVP targets.
  - Qualitative feedback indicates users can complete core workflow without facilitator help.
- **Conditional Go** when one metric misses target but trend is positive and mitigation is committed.
- **No-Go** when critical workflow reliability is unstable or multiple core metrics materially miss target.

---

## Operating checklist
- [ ] Cohort allowlist configured and invites sent.
- [ ] Event schema implemented and validated in staging.
- [ ] Weekly dashboard and review doc template created.
- [ ] Triage labels configured (`critical-blocker`, `usability`, `v1-candidate`).
- [ ] Interview script and support tagging taxonomy finalized.
- [ ] Go/no-go doc owner assigned and timeline calendarized.
