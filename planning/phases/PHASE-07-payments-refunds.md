# PHASE-07 — Payments & Refunds

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Establish reliable payment/refund records and financial status for orders, with an explicit decision about whether bounded billing belongs in the baseline.

## Why This Phase Exists

Finance needs attributable, repeat-safe financial operations and understandable order balances/outcomes. Product goals establish payments/refunds, but do not establish a complete accounting or invoicing system.

## Prerequisites

- [Phase 06](PHASE-06-orders-inventory.md): orders, agreed prices and authorized lifecycle contracts.
- Approved monetary rules from Phase 05.
- Human billing decision before relevant Phase 07 tasks: payment-record management only, or bounded invoices/accounts receivable/credit notes.
- Approve payment source, settlement/failure/refund and payment/fulfillment eligibility policies before affected implementation.

## In Scope

- Payment records linked to orders, approved settlement/status behavior and bounded reconciliation of recorded amounts.
- Failed/pending payment outcomes, permitted repeat/retry handling and idempotency under approved rules.
- Authorized refunds and accurate financial/operational history.
- Finance landing/work views, order financial summaries and clear next actions.
- Invoices, receivable tracking and credit notes only if the billing gate explicitly approves their necessity and bounded scope.

## Out of Scope

- General ledger, double-entry accounting platform, payroll, tax filing, bank reconciliation platform or ERP.
- Speculative payment gateways, bank integrations or card-data processing.
- Physical returns, stock restoration, dispatch or assumptions of mandatory full prepayment.
- Treating a credit note, cash refund, reservation release or returned stock as interchangeable events.

## Core User Workflows

Finance records or confirms payment through the approved source → backend validates association/amount/state → order financial view shows the approved outcome → repeated submission does not duplicate money records.

A failed/pending operation remains understandable and can be resolved under approved rules. An authorized employee requests an eligible refund → finance executes/records it once → history and financial summaries reconcile.

If bounded billing is approved: issue an invoice for approved order terms → track receivable/settlement → issue a permitted credit note without implying cash was refunded.

## UX and Usability Requirements

- Explain pending, failed, settled and refunded meanings; distinguish order, payment and fulfillment states.
- Finance work queues and useful basic summaries before advanced reporting; readable amounts and clear refund/credit-note distinctions.
- Accessible confirmations and field/eligibility/conflict messages, preserved context and clear feedback when outcome is uncertain.
- Do not present speculative provider or invoice screens before their gates are approved.

## Backend Responsibilities

- Authoritative financial validation, permission checks, order associations and repeat-safe payment/refund transitions.
- Transactional financial record/history consistency and explicit failure reconciliation; no unapproved external I/O in broad database transactions.
- Extend Phase 06 contracts without bypassing order/inventory ownership. Implement bounded billing only under the recorded approval.

## Frontend Responsibilities

- Payment/refund record/detail workflows and finance assigned/actionable views using authoritative outcomes.
- Readable order financial status and history; safe duplicate-submission feedback.
- Conditional bounded billing views only when approved; retain consistent keyboard/focus/form conventions.

## Data Model Direction

Order-linked payment attempts/records, status/outcome, approved source reference, refund relationships and repeat-operation identity. Monetary semantics follow approved Phase 05 policy. Invoice, receivable and credit-note concepts remain conditional, not committed entities. Recorded payment success is not proof of shipment or restored stock.

## Authorization / Security Considerations

- Restrict financial recording, reconciliation, refunds and any approved billing issuance to appropriate permissions.
- Enforce order/organization visibility on financial lists, details, histories, summaries and exports.
- Protect sensitive references and never capture/log card details or credentials speculatively; require approved refund authority.

## Auditability

Capture payment attempts/outcomes, reconciliation decisions, idempotent operation identities, refunds and relevant order associations. If approved, capture invoice/credit-note issuance and adjustments separately from cash movement. Preserve actor/reason/time and monetary provenance without secrets.

## Testing Expectations

- Unit tests for approved amount, settlement, failure and refund policies.
- PostgreSQL integration for repeated/concurrent payment/refund submissions, rollback, allowed refund limits and reconciled histories.
- Authorization-negative, forged-reference/client-amount and uncertain/retry outcomes.
- Frontend/browser financial statuses, confirmations/errors and daily work views; conditional billing tests if that gate selects billing.

## Performance / Concurrency Considerations

Repeated requests and races must not record duplicate payments/refunds or violate approved settled/refundable amounts. Separate external outcome uncertainty from local transaction rollback if a source is later approved. Bound financial/history queries; report accurate amounts without floating assumptions or unapproved settlement rules.

## Acceptance Criteria

- [ ] Billing necessity is explicitly decided before relevant tasks; conditional invoices/receivables/credit notes match that approval without an accounting subsystem.
- [ ] Authorized finance users record/resolve payments and see understandable order financial outcomes.
- [ ] Failed/pending operations and permitted retries preserve accurate history without duplicate financial effects.
- [ ] Approved refunds are repeat-safe and preserve financial consistency under concurrency.
- [ ] Financial visibility, authority and audit provenance are enforced by the backend.
- [ ] Accessible daily finance views work without advanced dashboards.
- [ ] Required financial/integration/concurrency/UI verification passes; no full-prepayment or shipment rule is inferred.

## Candidate Tasks

1. Decide billing necessity and approve payment, refund and eligibility policies.
2. Establish financial records and authorized order associations.
3. Implement approved settlement/failure handling and repeat-safe operations.
4. Implement bounded refunds and financial history/reconciliation.
5. Add bounded billing only if explicitly selected by the gate.
6. Deliver finance work views and clear financial status.
7. Verify consistency, failures, concurrency, permissions and regressions.

## Deferred Decisions / Risks

Established: payments/refunds are NexusCRM goals; commercial snapshots and authoritative backend financial rules come from earlier phases.

Proposed: bounded order-linked payment/refund management and finance work views, not a complete accounting system.

Deferred approval gates: invoices/accounts receivable/credit-note necessity, payment source, partial payments, overpayment, refund eligibility/authority, settlement/failure semantics and billing retention. Resolve required payment/fulfillment eligibility before affected Phase 07/08 tasks. [Phase 08](PHASE-08-fulfillment-order-completion.md) owns physical returns and shipment behavior; Phase 07 can complete approved financial workflows without depending on unfinished return processing.
