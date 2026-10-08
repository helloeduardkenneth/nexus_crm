# PHASE-05 — Products, Pricing & Quotes

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Provide a bounded product catalog and reliable quotation/approval/acceptance workflow with preserved commercial terms.

## Why This Phase Exists

Sales must offer identifiable products at agreed prices; approved or accepted quotes cannot silently change when the catalog changes.

## Prerequisites

- [Phase 04](PHASE-04-opportunity-pipeline-lead-conversion.md): opportunities and customer/contact context; inherited access/audit foundations.
- Currency, amount precision/rounding, discount, tax, approval and quote acceptance policies approved before affected tasks.
- Catalog/pricing candidate tasks precede quotation tasks within this phase.

## In Scope

- Administrator-managed bounded product catalog, availability/activation and approved pricing behavior.
- Quote drafts/items, totals, versions or revisions, approval and acceptance under approved rules.
- Commercial pricing snapshots and acceptance tied to the correct quote revision.
- Catalog search, quote work queues, approval next actions and basic summaries; a stable handoff for later order creation.

## Out of Scope

- Orders, stock reservations, invoicing, payments or fulfillment execution.
- Complex price-book engines, subscriptions, procurement, accounting, e-commerce checkout or external signature integrations.
- Assuming a currency, tax jurisdiction, discount authority or legally binding acceptance mechanism from planning alone.

## Core User Workflows

Administrator maintains catalog → sales selects products for an opportunity quote → reviews prices/totals → requests required approval → authorized approver approves/rejects → employee records acceptance of the approved revision.

A later catalog edit leaves the accepted quote's agreed terms intact; material quote changes follow the approved revision/reapproval policy.

## UX and Usability Requirements

- Make products, quantities, prices, discounts and totals understandable with progressive disclosure.
- Clear draft/approval/acceptance status meanings, a readable price breakdown and explicit confirmation of the revision being accepted.
- Accessible item forms and field errors; preserve edits/context, warn clearly about stale revisions and show the approver's next action.
- Practical product/quote landing views and modest summaries rather than an advanced pricing dashboard.

## Backend Responsibilities

- Validated product and quote DTO workflows, authoritative calculation rules and role/owner checks.
- Preserve commercial snapshots and protect approved/accepted quote integrity; enforce eligible revision transitions transactionally.
- Expose an order-handoff contract after acceptance without creating orders in this phase.

## Frontend Responsibilities

- Catalog administration/search, quote drafting/detail, review/approval and acceptance interactions.
- Show authoritative totals, revision/status context, accessible errors and confirmation feedback.
- Avoid silent background replacement of agreed prices with mutable catalog values.

## Data Model Direction

Product identity/current catalog data, quotes and items linked to opportunity/customer context, commercial snapshots, revisions and approval/acceptance history. Quotes retain the relevant agreed descriptions/amounts even after catalog changes. Exact currency/tax/discount representation and accepted-term immutability rules need approval; no detailed schema is fixed here.

## Authorization / Security Considerations

- Distinguish catalog administration, quotation authorship, price/discount overrides, approval and acceptance permissions.
- Enforce owner/team visibility across quote lists and linked products/customer context.
- Audit sensitive overrides and approvals; do not trust client-supplied totals or claim a legally compliant billing/signature system.

## Auditability

Capture catalog/pricing changes, material quote revisions, overrides, submitted approvals, approval decisions and acceptance actor/revision/time. Preserve the agreed historical terms and their provenance for later orders/reporting; audit is not regenerated from current prices.

## Testing Expectations

- Unit tests for approved monetary calculation, totals and revision/approval rules.
- PostgreSQL integration for snapshots, catalog edits after acceptance, invalid transitions and concurrent acceptance/revision.
- Unauthorized override/approval/acceptance and client-total tampering cases.
- Frontend/browser item editing, breakdowns, stale-revision feedback and accessible approval work queues; regression gates.

## Performance / Concurrency Considerations

Catalog changes and simultaneous approval/acceptance must not rewrite accepted terms or accept the wrong revision. Choose concurrency controls for the defined invariant. Bound product/quote searches and monetary operations; external side effects must not be hidden inside broad database transactions.

## Acceptance Criteria

- [ ] Authorized administrators manage a bounded catalog and sales users prepare understandable quotes.
- [ ] Approved monetary policies produce authoritative, testable prices and totals.
- [ ] Quote approval/acceptance applies to the intended revision and preserves agreed terms.
- [ ] Catalog updates do not change historical accepted quote prices/descriptions.
- [ ] Invalid or unauthorized transitions/overrides are rejected and relevant history is attributable.
- [ ] Quote/product work views provide next actions and clear accessible statuses/errors.
- [ ] Snapshot, financial calculation, concurrency, security and UI verification passes without creating orders or billing.

## Candidate Tasks

1. Resolve monetary, pricing, approval and acceptance gates.
2. Implement bounded product catalog and pricing administration.
3. Establish quote draft/items and commercial snapshot rules.
4. Implement revision, approval and acceptance integrity.
5. Deliver catalog/quote/approval work views and later order handoff.
6. Verify historical pricing, conflicts, permissions and regression behavior.

## Deferred Decisions / Risks

Established: product, quote and opportunity responsibilities stay in the modular monolith; backend validation/calculation, Flyway and audit remain authoritative.

Proposed: a modest catalog plus quotation workflow in one phase; split only through later approved replanning if scope grows.

Deferred approval gates: currency, precision/rounding, taxes, discount thresholds, catalog activation, quote validity, revision/reapproval, acceptance evidence and amendment rules. [Phase 06](PHASE-06-orders-inventory.md) preserves accepted terms in orders; catalog data is not historical financial truth.
