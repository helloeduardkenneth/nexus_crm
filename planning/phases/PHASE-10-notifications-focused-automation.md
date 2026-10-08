# PHASE-10 — Notifications & Focused Automation

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Deliver useful business notifications and narrowly selected reminders/automation with observable retry and failure behavior.

## Why This Phase Exists

Assigned work already exists in earlier phases. This phase helps employees notice relevant changes and overdue actions without turning the CRM into a marketing or generic workflow platform.

## Prerequisites

- Implemented relevant workflows from Phases 02–09 and Phase 01 identity/visibility/audit foundations.
- Approved event meanings, recipient rules, channels/preferences and concrete automation policies.
- A justified asynchronous delivery/retry requirement before RabbitMQ infrastructure tasks; basic domain workflows do not depend on this phase.

## In Scope

- Bounded notifications for approved assignment, follow-up, approval, commercial or support events.
- Selected reminders or assignment/escalation rules only when business behavior is explicitly approved.
- Authorized notification views/preferences and delivery/work status.
- RabbitMQ-backed processing when justified, with retries, duplicate handling, dead-letter inspection and controlled recovery.

## Out of Scope

- Generic workflow designer, marketing automation, arbitrary scripting or unapproved email/calendar/provider integrations.
- Replacing authoritative domain transitions with queue consumers that bypass owning modules.
- Microservices, speculative event frameworks or introducing Redis for notification delivery by default.

## Core User Workflows

An owning domain commits an approved action → intended authorized recipients receive a notification through an approved channel → employee opens the relevant record and acts with current permissions.

A permitted reminder becomes due → its rule checks current business state → delivery occurs or records a visible failure → an authorized operator investigates/retries safely without repeating the business action.

## UX and Usability Requirements

- Helpful notification titles with a clear reason and next action, without exposing sensitive record contents.
- Readable preferences and optional grouping under approved policy; avoid overwhelming daily work with repetitive alerts.
- Accessible notification/error/recovery views, preserved return context and responsive layouts.
- Existing assigned-work views remain useful even during delivery failure.

## Backend Responsibilities

- Define concrete event/recipient contracts at domain boundaries and safe handoff after committed changes.
- Enforce current recipient visibility and automation authority; respect owning domain rules during background actions.
- Bounded processing, delivery state, retries and recoverable failures. Choose durable handoff/idempotency mechanisms for actual reliability requirements rather than claiming exactly-once delivery.

## Frontend Responsibilities

- Notification inbox/status/preferences and links to existing workflows.
- Authorized operational delivery/failure inspection where required; understandable progress and retry feedback.
- Preserve application context and avoid duplicate/misleading success messages when delivery is pending.

## Data Model Direction

Notification intent, recipient, relevant authorized record context, delivery attempts/outcomes and selected rule configuration are conceptual directions. Event identity, scheduling and durable handoff representation remain task-level architectural decisions. Business/audit history stays owned by earlier modules, not reconstructed from queue messages.

## Authorization / Security Considerations

- Recheck recipient visibility for notification contents/deep links and after reassignment/revocation.
- Approve background actor authority, replay/retry access and minimum message contents.
- No credentials or unnecessary personal/financial details in messages, logs or dead-letter views; validate all event inputs.

## Auditability

Capture selected rule/configuration changes, meaningful notification/delivery outcomes and authorized replay/recovery actions. Business mutations remain audited by their owning domains. Diagnostic retry traces are not substitutes for business audit records.

## Testing Expectations

- Unit tests for recipient/preference/rule behavior; PostgreSQL integration for approved handoff/state consistency.
- Broker integration/failure tests only once justified RabbitMQ tasks exist: rollback, lost connection, retry exhaustion, duplicate/out-of-order processing and controlled replay as applicable.
- Revoked-access and sensitive-content cases; frontend/browser notification links/preferences/recovery flows.
- Verify earlier business workflows remain correct when delivery is unavailable.

## Performance / Concurrency Considerations

Bound work batches, retry rates and queue growth. Repeated delivery must not duplicate business effects or flood recipients. Approve scheduling/timezone, stale-event and outage guarantees before selecting mechanisms. Keep unreliable network work outside owning domain database transactions unless explicitly justified.

## Acceptance Criteria

- [ ] Notification/automation workflows, recipient rules and channels are explicitly approved and bounded.
- [ ] Employees receive actionable permitted notifications and can navigate to records with current authorization.
- [ ] Delivery failures and permitted retries are visible and recover without duplicate business effects.
- [ ] Earlier domain operations/assigned-work views remain usable during delivery outages.
- [ ] Message contents, preferences and recovery actions obey security/audit policies.
- [ ] RabbitMQ is introduced only for a demonstrated requirement; no generic automation or speculative external integration appears.
- [ ] Required rule, integration, failure-path, permission and UI verification passes.

## Candidate Tasks

1. Approve concrete notifications, channels, recipients and selected automation policies.
2. Define domain event and safe delivery-handoff contracts.
3. Establish bounded notifications/preferences and authorized views.
4. Introduce justified RabbitMQ processing and delivery observability.
5. Implement bounded retries, duplicate handling and dead-letter recovery.
6. Add explicitly approved reminder/assignment rules.
7. Verify outages, revocation, replay behavior and regressions.

## Deferred Decisions / Risks

Established: notification is a core domain; RabbitMQ is planned for actual asynchronous requirements, not earlier CRUD. Domain authorization/audit and modular-monolith boundaries remain intact.

Proposed: useful bounded notifications and a small set of approved rules, not a workflow/marketing platform.

Deferred approval gates: channel/provider selection, recipient privacy, preferences, background actor authority, scheduling/timezone, delivery guarantees, durable handoff strategy, retry/replay policy and rule lifecycle. External providers require separate concrete approval. [Phase 11](PHASE-11-reporting-dashboards.md) consumes available facts; notification infrastructure must not become a prerequisite for basic domain summaries.
