# PHASE-02 — Customers, Contacts & Activities

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Establish a usable customer relationship workspace with contacts, addresses, notes, interactions and assigned follow-ups.

## Why This Phase Exists

A customer list alone does not help employees maintain relationships. Users need reliable identity, understandable context and a clear next action.

## Prerequisites

- [Phase 01](PHASE-01-authentication-users-access-control.md): identity, visibility, permission and audit foundations.
- Customer/account semantics, activity ownership/reuse, duplicate-resolution and retention approval before affected tasks.

## In Scope

- Customers/accounts under approved semantics, related contacts and bounded address management.
- Activity, note and follow-up foundations: manually logged calls/meetings/interactions, assigned tasks and completion history.
- Search, filtering, paging, ownership, basic relationship summaries and assigned-work views.
- Bounded customer/contact CSV import/export after manual workflows, validation, duplicate handling and authorization are established.

## Out of Scope

- Lead/opportunity conversion, pricing, orders or support lifecycle.
- Automated calling, calendar/email synchronization, marketing campaigns, universal import engines or a generic activity-reference framework.
- Automatic merging/destructive cleanup without approved duplicate and retention policies.

## Core User Workflows

Employee searches before creating → records a customer and contacts → records a conversation/note → assigns a follow-up → completes it → reviews the relationship timeline.

Authorized employee imports a bounded CSV → reviews validation/duplicate outcomes → imports approved records → inspects results; exports only permitted customer/contact data.

## UX and Usability Requirements

- Clear customer-versus-contact terminology, modest default fields and progressive disclosure of secondary details.
- A practical landing page with assigned/due work, obvious next actions, contextual counts and guided empty states.
- Discoverable filters, preserved list context and consistent accessible forms with understandable field/duplicate/import errors.
- Responsive navigation, visible focus and clear save/completion confirmations; show authorship/time and meaningful activity statuses.

## Backend Responsibilities

- Validated customer/contact/activity DTO workflows, authorized search/paging and transactional relationship updates.
- Establish concrete activity ownership/reuse contracts for later leads/opportunities without silently adding a new domain or polymorphic framework.
- Enforce approved duplicate behavior and bounded import/export validation, access and result handling through domain rules.

## Frontend Responsibilities

- Customer/contact lists and detail views, relationship timeline, notes and follow-up creation/completion.
- Assigned-work and basic summary views, accessible search/filter/forms and bounded CSV review/results.
- Reuse the current shell/state conventions; do not duplicate authoritative server records in Zustand by default.

## Data Model Direction

Customer/account, contact and address relationships; activity/note authorship, ownership, target association, due/completion context and retained history. Account-versus-person modeling, cardinality and activity reference strategy are unresolved. Import metadata may identify a bounded operation and row outcomes, not a universal ingestion subsystem.

## Authorization / Security Considerations

- Apply approved record visibility to customer details, contact associations, activities, searches, timelines and CSV data.
- Recheck permissions for mutations and exports; protect personal data and audit who performs bulk operations.
- Approve file size/type/row limits and CSV formula-injection protections before file-handling tasks; avoid logging uploaded sensitive contents.

## Auditability

Capture customer/contact and ownership changes, material association changes, note/activity changes, follow-up completion and import/export actions. Keep user-facing interaction history separate from restricted audit history. Deletion/anonymization and retention need explicit policy before destructive operations.

## Testing Expectations

- Unit tests for validation, duplicates and follow-up rules; PostgreSQL integration for relationships, approved uniqueness and transactional row outcomes.
- Unauthorized/cross-owner detail, search, timeline, association and export cases.
- Frontend/browser empty-state, filtering/context, keyboard, form error and follow-up workflows; bounded CSV malformed/duplicate/partial-result cases.

## Performance / Concurrency Considerations

Use bounded paging for records and timelines. Concurrent edits or repeated completion/import requests must not cause silent lost updates or duplicate actions under the approved contract. Do not choose merge rules, universal uniqueness or massive bulk processing speculatively.

## Acceptance Criteria

- [ ] Employees can find/create customers and associate contacts/addresses under approved semantics.
- [ ] Users record notes/interactions, assign follow-ups and see accurate completion history.
- [ ] Assigned work, basic summaries and obvious next actions are useful before reporting exists.
- [ ] Approved duplicate behavior prevents or clearly surfaces unintended duplication without silent data loss.
- [ ] Customer/contact CSV operations provide understandable outcomes and preserve validation/visibility boundaries.
- [ ] Lists, timelines and exports reveal only authorized data, with appropriate audit records.
- [ ] Accessible responsive workflows and required automated/browser/regression verification pass.

## Candidate Tasks

1. Resolve customer semantics, visibility refinements, activity reuse and duplicate/retention gates.
2. Establish customer/contact/address workflows and validated persistence.
3. Deliver authorized search, details and practical landing views.
4. Establish notes, logged interactions and assigned follow-ups.
5. Verify manual relationship/activity and duplicate workflows.
6. Add bounded customer/contact CSV import/export with preview/results and security controls.
7. Complete permission, concurrency, browser and regression verification.

## Deferred Decisions / Risks

Established: existing architecture, backend authorization, audit foundation and frontend state separation; [Phase 01](PHASE-01-authentication-users-access-control.md) owns access policy.

Proposed: customer/contact CSV and a concrete shared activity capability, not external integration or a new generic platform.

Deferred approval gates: account/person semantics, activity module ownership/reference direction, contact relationships, duplicate resolution, archival/deletion/retention and CSV limits/conflict/row-outcome policy. Resolve before affected task authoring. Future lead/opportunity links extend this foundation without making Phase 02 depend on those implementations.
