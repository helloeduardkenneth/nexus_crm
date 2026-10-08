# PHASE-03 — Lead Capture & Qualification

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Enable sales employees to capture, own, follow up and qualify prospective business before opportunity conversion exists.

## Why This Phase Exists

Leads need an accountable owner and visible qualification progress so prospects do not become an unstructured contact list or get lost between employees.

## Prerequisites

- [Phase 02](PHASE-02-customers-contacts-activities.md): customer/contact and activity foundations; inherited Phase 01 access/audit.
- Approval of lead identity, qualification, assignment and visibility rules before affected tasks.

## In Scope

- Manual lead capture, source/context, search/filtering and ownership/reassignment.
- Qualification/disqualification with understandable statuses and reasons under approved rules.
- Extend Phase 02 notes, interactions and follow-ups to leads without duplicating their lifecycle.
- Assigned work, due follow-ups and basic lead summaries.

## Out of Scope

- Completed opportunity conversion or speculative opportunity tables/API placeholders.
- Public web-form capture, external lead providers, marketing campaigns, AI scoring or automated routing rules without a concrete approved task.
- Universal lead imports; only Phase 02's bounded customer/contact CSV is presently planned.

## Core User Workflows

Sales employee captures a lead → checks possible duplicates → accepts/receives ownership → logs an interaction → schedules/completes follow-up → qualifies or disqualifies with a reason.

Manager reviews assigned/unassigned leads → performs an authorized reassignment → employee sees updated work and retained history. A qualified lead is ready for later Phase 04 conversion, not already converted.

## UX and Usability Requirements

- Explain lead and qualification terminology, statuses and ownership in plain language.
- Provide assigned/unassigned work, due follow-ups, modest summaries and an obvious next action rather than advanced dashboards.
- Preserve search/filter context; accessible forms, duplicate messages, reason prompts and clear save/reassignment feedback.
- Do not offer a working conversion action until Phase 04 supplies the complete workflow.

## Backend Responsibilities

- Validated capture/qualification/assignment rules with record-level authorization and transactional transitions.
- Reuse approved activity contracts and retain authorship/ownership history.
- Surface approved duplicate behavior; do not infer that a lead must already be a customer or create an opportunity prematurely.

## Frontend Responsibilities

- Lead list/detail, authorized assignment and qualification interactions, linked notes/history and follow-up work views.
- Present any customer/contact associations clearly and preserve navigation context.
- Accessible empty, loading, denied and error states; keep business state authoritative on the backend.

## Data Model Direction

Lead identity/prospect context, source, owner, qualification state/reason and relationships to existing customer/contact records when valid. Activities use the Phase 02 association approach. Converted-state/target associations arrive in Phase 04, not as unfinished Phase 03 infrastructure.

## Authorization / Security Considerations

- Restrict viewing, editing, qualification and reassignment according to approved role/team/owner rules.
- Searches, activity/history links and basic summaries must obey the same visibility policy.
- Capture source data safely and prevent unauthorized owner changes or forged historical authorship.

## Auditability

Capture lead creation/material edits, owner changes, qualification/disqualification and follow-up outcomes. Preserve why and by whom decisions were made without treating editable notes as a security audit substitute.

## Testing Expectations

- Unit tests for approved status/assignment/qualification rules and invalid transitions.
- PostgreSQL integration for duplicates, associations and concurrent ownership/state changes.
- Negative authorization and unauthorized activity-link cases; frontend/browser assigned-work, validation, filtering and history workflows.
- Existing backend/frontend regression gates remain required.

## Performance / Concurrency Considerations

Concurrent reassignment or qualification must surface conflicts rather than overwrite decisions silently. Bound lead/follow-up queries and preserve accurate basic counts. Duplicate capture behavior needs explicit invariants before selecting constraints or locking.

## Acceptance Criteria

- [ ] Authorized sales users capture, find, own and follow up leads.
- [ ] Qualification/disqualification uses approved statuses and retains decision reasons/history.
- [ ] Reassignment changes assigned work without losing interactions or associations.
- [ ] Shared notes/activities work for leads without a duplicate activity subsystem.
- [ ] Lead landing views show understandable status, assigned work and next actions.
- [ ] Unauthorized records/actions remain inaccessible, including lists and history.
- [ ] Phase 03 works without Phase 04 conversion; required rule, integration and UI verification passes.

## Candidate Tasks

1. Resolve capture, identity/duplicate, assignment and qualification policies.
2. Implement validated lead capture and authorized search.
3. Implement ownership/reassignment and qualification workflows.
4. Extend shared activities, notes and follow-ups to leads.
5. Deliver lead work views and contextual summaries.
6. Verify authorization, history, concurrency and regression behavior.

## Deferred Decisions / Risks

Established: Phase 02 activity foundations, existing authorization/audit architecture and incremental domain ownership.

Proposed: bounded manual capture and qualification; operational lead views rather than marketing automation.

Deferred approval gates: qualification/status meanings, lead source fields, assignment authority, duplicate handling, owner-transfer behavior and lead retention. Automatic assignment is a possible later Phase 10 workflow, not an implicit Phase 03 feature. Conversion preservation and repeat-safe conversion are owned by [Phase 04](PHASE-04-opportunity-pipeline-lead-conversion.md).
