# PHASE-04 — Opportunity Pipeline & Lead Conversion

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Enable accountable deal progression and complete qualified-lead conversion with preserved customer/contact associations and interaction history.

## Why This Phase Exists

Sales teams need a visible commercial pipeline rather than qualification alone, while managers need reliable stage history and ownership without reconstructing events later.

## Prerequisites

- [Phase 03](PHASE-03-lead-capture-qualification.md): qualified leads and ownership; Phase 02 relationship/activity foundations.
- Approved pipeline/stage definitions, conversion eligibility, target resolution and visibility rules before affected tasks.

## In Scope

- Opportunities, approved stages, ownership, customer/contact links and expected close/value context under approved policies.
- Atomic, repeat-safe lead conversion with explicit source/target relationships and duplicate resolution.
- Extend shared notes/interactions/follow-ups; preserve relevant associations/history through conversion.
- Authorized pipeline/list views, stage history, assigned deals, next actions and basic summaries.

## Out of Scope

- Products/quotes, order creation and financial settlement.
- Forecast engines, AI scoring, multiple arbitrary pipeline builders or a universal workflow engine.
- Silent customer/contact merging or loss/duplication of activity history during conversion.

## Core User Workflows

Employee selects a qualified lead → reviews existing/new customer/contact target choices under approved semantics → converts once → sees the resulting opportunity and retained interactions.

Owner follows up → advances an eligible stage → records approved close outcome/reason → manager reviews current pipeline and attributable stage history.

## UX and Usability Requirements

- Explain opportunities and stage meanings; provide an obvious next action, assigned-deal view and guided empty pipeline.
- Conversion review makes target records, potential duplicates and preserved history understandable before confirmation.
- Accessible list alternatives for any board/drag interaction; keyboard stage changes, helpful transition errors and responsive layouts.
- Preserve filters/navigation and give clear conversion/conflict/success feedback.

## Backend Responsibilities

- Opportunity rules, stage transitions, authorized queries and approved customer/contact association handling.
- One application transaction for conversion's required state changes; repeat-safe behavior and conflict handling protect against double conversion.
- Reuse Phase 02 activity contracts; preserve historical identity and relevant links without blanket copying or deleting history.

## Frontend Responsibilities

- Pipeline/list and deal-detail interactions, conversion review/result, stage changes and shared activity/follow-up views.
- Contextual summaries and assigned next actions, not advanced forecasting dashboards.
- Render backend-authoritative transition/permission results and preserve list context.

## Data Model Direction

Opportunity links to customer/contact context, owner, stage and commercial context; conversion relates source lead to resulting records. Stage/outcome history is recorded when changes occur. Activity association preservation follows an explicitly approved mapping; detailed schemas, stage taxonomy and opportunity value policy remain deferred.

## Authorization / Security Considerations

- Backend checks cover conversion source and every selected target, opportunity ownership/stages, lists, history and summaries.
- Prevent conversion into inaccessible records or unauthorized reassignment; a UI-hidden conversion action is not protection.
- Approved team/organization boundaries from Phase 01 apply to linked records.

## Auditability

Capture conversion source/target identities, actor/outcome, ownership changes, stage transitions and close decisions. Keep customer-facing interaction continuity distinct from restricted audit metadata. Preserve existing authorship/timestamps under the approved conversion policy.

## Testing Expectations

- Unit tests for stage rules, eligibility and duplicate/target decisions.
- PostgreSQL integration for atomic conversion rollback, relationship/history preservation and actual repeat/concurrent conversion.
- Cross-owner/target authorization failures and invalid stage changes.
- Frontend/browser conversion, accessible pipeline changes, error feedback and retained context; existing regression gates.

## Performance / Concurrency Considerations

Repeated or simultaneous conversion must not create duplicate opportunities or lose associations. Concurrent stage edits require explicit conflict behavior. Bound pipeline/history queries and avoid N+1 relationship loading; no premature analytics cache.

## Acceptance Criteria

- [ ] Qualified leads convert through an approved complete workflow with customer/contact associations and relevant history preserved.
- [ ] Repeat/concurrent conversion and failure paths do not leave duplicate or partially converted records.
- [ ] Authorized users progress opportunities through understandable approved stages and inspect accurate history.
- [ ] Shared activities/follow-ups work for opportunities without duplicated lifecycle infrastructure.
- [ ] Assigned deals, next actions and usable basic pipeline summaries exist before advanced reporting.
- [ ] Backend authorization protects sources, targets, stage changes, searches and history.
- [ ] Rule, transactional, concurrency, accessibility and regression verification passes.

## Candidate Tasks

1. Approve pipeline/stage, conversion/target and visibility policies.
2. Establish opportunities and authorized relationship queries.
3. Implement complete repeat-safe lead conversion and history preservation.
4. Implement pipeline transitions, ownership and outcome history.
5. Extend activities/follow-ups and deliver accessible pipeline/work views.
6. Verify conversion rollback/idempotence/concurrency and full UI/security behavior.

## Deferred Decisions / Risks

Established: Phase 03 qualification is independently complete; Phase 04 owns conversion. Phase 02 owns activity foundations; the backend owns transactions and authorization.

Proposed: a bounded understandable pipeline with basic operational summaries, not configurable sales-process software.

Deferred approval gates: stage meanings, close outcomes, conversion eligibility/target creation, duplicate resolution, preservation mapping, conflict behavior and value/close-date semantics. Quote linkage arrives in [Phase 05](PHASE-05-products-pricing-quotes.md); do not make opportunity completion depend on unimplemented quotes.
