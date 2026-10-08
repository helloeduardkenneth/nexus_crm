# NexusCRM Development Roadmap

## Phase 00 — Foundation

Repository setup, development environment, backend/frontend bootstrap,
Docker, PostgreSQL, quality tooling.

Phases 01–12 below are approved planning boundaries, not completed capabilities
or immutable implementation contracts. Their documents distinguish Established,
Proposed and Deferred decisions. Future discoveries may change scope or sequencing
through explicit review; individual task specifications are authored incrementally.

## Phase 01 — Authentication, Users & Access Control

[Detailed plan](phases/PHASE-01-authentication-users-access-control.md).

Prerequisite: completed Phase 00. Establish employee authentication, JWT/refresh
session lifecycle, bounded users/teams/RBAC and audit foundations. Resolve
single-organization versus multi-tenant operation before persistence/authorization;
neither is assumed. Introduce JPA/Hibernate and backend validation only at the
first required domain/request boundary, honoring the approved Phase 00 deferrals.

## Phase 02 — Customers, Contacts & Activities

[Detailed plan](phases/PHASE-02-customers-contacts-activities.md).

Prerequisite: Phase 01 access/audit. Establish customer/contact/address workflows,
duplicate handling, shared notes/interactions/follow-ups, authorized search and
daily assigned work. Bounded customer/contact CSV follows verified manual workflows
and approved validation, duplicate, file-security and visibility policies.

## Phase 03 — Lead Capture & Qualification

[Detailed plan](phases/PHASE-03-lead-capture-qualification.md).

Prerequisite: Phase 02 relationship/activity foundations. Capture leads, manage
ownership, qualify/disqualify, and extend shared activities/follow-ups. Provide
assigned work and basic summaries. Opportunity conversion is Phase 04 work;
Phase 03 must operate independently without pretending conversion is implemented.

## Phase 04 — Opportunity Pipeline & Lead Conversion

[Detailed plan](phases/PHASE-04-opportunity-pipeline-lead-conversion.md).

Prerequisite: Phase 03 qualification and Phase 02 relationship/activity contracts.
Establish opportunities, approved pipeline stages, stage history and complete
atomic/repeat-safe conversion. Preserve relevant associations and interaction
history; provide understandable pipeline views and next actions.

## Phase 05 — Products, Pricing & Quotes

[Detailed plan](phases/PHASE-05-products-pricing-quotes.md).

Prerequisite: Phase 04 opportunity/customer context. Introduce a bounded catalog
and pricing before quotation tasks. Establish quote drafts, commercial snapshots,
revisions, approvals and version-specific acceptance integrity. Currency,
precision/rounding, tax, discount and acceptance policies require approval before
affected tasks. Catalog edits must not rewrite accepted commercial terms.

## Phase 06 — Orders & Inventory

[Detailed plan](phases/PHASE-06-orders-inventory.md).

Prerequisite: Phase 05 accepted quotes/products and approved financial rules.
Create orders with preserved agreed prices; establish bounded stock management,
reservations, cancellation and reservation release with transactional/concurrency
verification. Define later consumption/restoration handoffs without making this
phase depend on unfinished payments or fulfillment.

## Phase 07 — Payments & Refunds

[Detailed plan](phases/PHASE-07-payments-refunds.md).

Prerequisite: Phase 06 orders and Phase 05 monetary rules. Establish payment
records, failed/pending outcomes, permitted settlement/retry behavior, refunds,
idempotency and useful finance work views. Before relevant tasks, explicitly
decide whether invoices, accounts receivable and credit notes are needed in the
baseline: payment-record management and bounded billing are distinct choices.
Neither choice authorizes a complete accounting system or speculative gateway.

## Phase 08 — Fulfillment & Order Completion

[Detailed plan](phases/PHASE-08-fulfillment-order-completion.md).

Prerequisites: Phase 06 order/inventory and Phase 07 financial contracts. Complete
bounded fulfillment, operational order completion, failure recovery and physical
returns, coordinating stock disposition and eligible refunds through their owners.
Approve payment/fulfillment eligibility and partial-payment/shipment policies;
the phase order does not mandate full prepayment.

## Phase 09 — Customer Support

[Detailed plan](phases/PHASE-09-customer-support.md).

Prerequisites: Phase 02 customer/activity foundations; implemented Phase 06–08
capabilities for commercial issue context. Establish tickets, comments, assignment,
resolution and support work queues. Link commercial exception workflows without
duplicating order, inventory, payment or fulfillment rules.

## Phase 10 — Notifications & Focused Automation

[Detailed plan](phases/PHASE-10-notifications-focused-automation.md).

Prerequisites: implemented relevant Phase 02–09 workflows and Phase 01 visibility.
Deliver approved notifications/reminders and narrowly selected automation.
Introduce RabbitMQ only for concrete asynchronous delivery/retry requirements;
verify duplicates, failure recovery and dead-letter handling when applicable.
Channels, providers and guarantees remain explicit gates, not assumed integrations.

## Phase 11 — Reporting & Dashboards

[Detailed plan](phases/PHASE-11-reporting-dashboards.md).

Prerequisites: implemented Phase 02–09 source records/history; Phase 10 data only
for reports that use it. Provide approved consolidated sales/pipeline, financial,
fulfillment and support measures, role-appropriate dashboards and bounded exports.
Preserve visibility in aggregates/drill-down and define metric/freshness semantics.
Earlier phases already own daily landing views, assigned work and basic summaries.

## Phase 12 — Production Hardening & Deployment Readiness

[Detailed plan](phases/PHASE-12-production-hardening-deployment-readiness.md).

Prerequisite: applicable Phase 01–11 capabilities and approved readiness targets.
Measure security/performance, strengthen observability/runbooks and rehearse safe
isolated deployment/recovery. Redis is conditional on a measured need, with
approved invalidation/visibility rules. Production changes require separate
authority; this phase does not postpone earlier correctness/security obligations.

## Cross-Phase Ownership and Exceptions

The commercial narrative is Lead → Opportunity → Quote → Order → Payment →
Fulfillment. Customer/contact context and history accompany the workflow;
the narrative is not a fixed settlement or shipping policy.

| Capability / exception | Owner and handoff |
| --- | --- |
| Identity, permissions, teams, audit foundation | Phase 01; extend checks/capture with each domain |
| Shared notes, activities and follow-ups | Phase 02; Phases 03/04 extend associations and preserve conversion history |
| Qualified lead conversion | Phase 04; source qualification belongs to Phase 03 |
| Commercial price snapshots and quote acceptance | Phase 05; Phase 06 preserves agreed order terms |
| Order cancellation and reservation release | Phase 06; later refund/fulfillment coordination extends its contracts |
| Failed payments, settlement and refunds | Phase 07; financial state never proves physical return/restocking |
| Invoices, receivables and credit notes | Conditional Phase 07 ownership only after explicit baseline/scope approval |
| Fulfillment failures and physical returns | Phase 08; invoke Phase 06 stock disposition and Phase 07 eligible refund capabilities |
| Physical stock restoration | Inventory responsibility from Phase 06, coordinated by approved Phase 08 return outcomes |
| Customer exception/support case tracking | Phase 09; link owning workflows without directly rewriting stock or finances |
| Notifications and selected automation | Phase 10; earlier domain correctness/work views do not depend on delivery |
| Advanced consolidated metrics/dashboard/export | Phase 11; source facts must already be captured in earlier phases |
| Administrative configuration | Introduced with the domain being configured, not a late universal platform |

Reservation release, physical return receipt, stock restoration, a credit note
and a monetary refund are distinct actions. One must not silently imply another.
Earlier phases establish complete local capabilities/contracts; later phases
extend them without circular implementation prerequisites.

## Planning Rules and Implementation Gates

Established: modular monolith, existing Spring Boot/PostgreSQL/Flyway and
React/TypeScript stack, pnpm, Zustand for appropriate client state, DTO boundaries,
backend-enforced authorization and explicit testing/review/QA. See
[AGENTS.md](../AGENTS.md) and [PROJECT.md](../docs/PROJECT.md).

Proposed: bounded workflows in the detailed future plans. Empty architecture/domain
documents and absent ADRs do not establish additional business/architecture choices.
No ERP, procurement, warehouse-management, marketing or external-integration
platform is part of this baseline. New ADRs require an approved decision.

Deferred gates must be resolved before the affected implementation tasks:

- Phase 01: organizational scope, provisioning, token/session handling and visibility.
- Phase 02: customer/account semantics, activity ownership, duplicates/retention and bounded CSV handling.
- Phases 03/04: qualification/stages, assignment, conversion targets and history preservation.
- Phase 05: currency, precision/rounding, discount/tax, approvals and acceptance integrity.
- Phase 06: order lifecycle, stock/reservations, cancellation and later stock-handoff rules.
- Phase 07: billing necessity/scope, payment source, settlement/failure/refund and partial-payment policy.
- Phases 07/08: payment/fulfillment eligibility, partial shipments, return/restocking and recovery policies.
- Phase 09: comment visibility, ticket lifecycle/retention and any service-level commitments.
- Phase 10: channels, recipients, selected rules, safe handoff and delivery/retry guarantees.
- Phase 11: metric/time/currency definitions, reporting visibility and freshness.
- Phase 12: deployment authority, recovery/security/performance targets and justified caching.

## Cross-Phase Acceptance and Review

- Each business phase delivers practical daily landing/assigned-work views,
  understandable statuses, next actions and basic summaries. Advanced reporting
  is not needed to understand daily work.
- Accessible forms/navigation, responsive layouts, guided empty states, clear
  validation/confirmation and retained filter/context are observable phase outcomes.
- Capture audit and operational facts when owning mutations occur, including
  the first administrative changes; Phase 11 cannot manufacture missing history.
- Backend checks cover references, records, lists, search, timelines, exports,
  background actions and reporting aggregates. Frontend checks are UX only.
- Unit, real PostgreSQL integration, permission-negative, frontend/browser and
  applicable concurrency/idempotency verification grow with each workflow.
- Review the complete commercial and exception paths for missing ownership,
  circular prerequisites, overlap, premature infrastructure and scope creep.
  Revisiting an approved future plan is allowed; silently rewriting completed
  implementation/history is not.
- Phase 00 and completed tasks remain historical facts. No future task is
  started or completed merely because its phase document has been authored.
