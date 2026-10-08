# PHASE-06 — Orders & Inventory

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Create operational orders from accepted commercial terms and protect bounded inventory availability/reservation and cancellation invariants.

## Why This Phase Exists

An accepted sale must become an actionable order without overselling stock, changing agreed prices or losing track of reserved inventory.

## Prerequisites

- [Phase 05](PHASE-05-products-pricing-quotes.md): accepted quotes, products and historical pricing contracts.
- Approved order lifecycle, stock/reservation, cancellation and future fulfillment/restoration handoff policies before affected tasks.

## In Scope

- Authorized accepted-quote order creation and preserved order agreement snapshots.
- Bounded stock records/adjustments, availability and reservations under approved rules.
- Order lifecycle, cancellation, reservation release and attributable operational history.
- Order/inventory lists, assigned actions, shortages and basic operational summaries.
- Define stock consumption/restoration and later payment/fulfillment extension contracts without implementing those phases.

## Out of Scope

- Payment/refund execution, dispatch/return processing, invoices and complete accounting.
- Warehouse management, procurement, suppliers, replenishment optimization, serial/lot tracking or speculative multi-location logistics.
- Assuming backorders, reservation expiry, partial quantities or automatic restocking policies.

## Core User Workflows

Employee selects an eligible accepted quote → creates an order once under approved rules → sees preserved prices → reserves available stock → reviews actionable order status.

Authorized operator adjusts stock with a reason; employee cancels an eligible unfulfilled order → required reservations are released atomically → history and availability reflect the result.

## UX and Usability Requirements

- Explain on-hand, available and reserved stock without exposing confusing technical counters.
- Clear order statuses, price agreement, shortage/conflict messages and allowed next actions.
- Order/inventory work views and basic counts; accessible responsive forms, preserved list context and explicit cancellation/adjustment confirmations.
- Do not pretend payment or fulfillment actions exist before their owning phases.

## Backend Responsibilities

- Transactional order creation/reservation/cancellation and approved stock invariants with database enforcement.
- Copy/preserve agreed commercial terms rather than dynamically recalculating orders from catalog changes.
- Define directional contracts for Phase 07/08 integration; later workflows call inventory/order capabilities rather than directly editing their internals.

## Frontend Responsibilities

- Order review/details, authorized stock/availability views and bounded adjustment/reservation/cancellation interactions.
- Show agreement snapshots, understandable status/history and clear failure/success feedback.
- Backend results govern availability and transitions; no client-only stock protection.

## Data Model Direction

Order and items reference the accepted quote/product context while retaining agreed prices/descriptions. Stock, reservation and stock-change history are distinct concepts. Exact stock location, quantity rules, reservation representation and order amendment policy are deferred. Financial status and fulfillment records are later extensions, not prerequisite placeholders.

## Authorization / Security Considerations

- Separate order creation/management from stock adjustments and cancellation authority.
- Apply record visibility to quotes, orders, stock views, searches and history; validate referenced source/target access.
- Record reasons for material adjustments and prevent forged stock/price values.

## Auditability

Capture quote-to-order source, agreed revision/terms, order state/ownership changes, reservations/releases, cancellations and stock adjustments with actor/reason. Later stock consumption/restoration extends this history; refund records alone must never imply returned stock.

## Testing Expectations

- Unit tests for accepted-quote eligibility, approved order/stock/cancellation rules and snapshot preservation.
- Real PostgreSQL transactional rollback, simultaneous reservations/adjustments/cancellations, repeated creation and prevention of forbidden stock states.
- Catalog-edit regression proving agreed order prices stay unchanged.
- Unauthorized source/stock/action cases and frontend/browser shortage/conflict/confirmation workflows.

## Performance / Concurrency Considerations

Concurrent orders must not violate approved availability invariants or reserve/release stock twice. Cancellation races require consistent final state and history. Select optimistic/pessimistic/atomic controls from concrete invariants, not speculation. Bound queries and avoid coupling financial network operations to inventory transactions.

## Acceptance Criteria

- [ ] Eligible accepted quotes create actionable orders under approved duplicate/repeat rules.
- [ ] Orders preserve agreed commercial prices despite later catalog changes.
- [ ] Stock reservations and permitted adjustments maintain approved availability invariants under concurrency.
- [ ] Eligible cancellation releases the correct reservations once and retains attributable history.
- [ ] Users understand order/stock statuses, shortages and available next actions without advanced reporting.
- [ ] Authorization and validated references protect order and stock mutations.
- [ ] Transactional/concurrency/snapshot/UI verification passes without payment or fulfillment implementation.

## Candidate Tasks

1. Approve order, reservation, cancellation and stock-handoff contracts.
2. Create orders from accepted quotes with agreement snapshots.
3. Implement bounded stock administration and reservations.
4. Implement cancellation, release and operational history.
5. Deliver order/inventory work views and clear exception feedback.
6. Verify transactions, concurrency, prices, permissions and regressions.

## Deferred Decisions / Risks

Established: order/inventory ownership, PostgreSQL transactions, Flyway migrations, backend authorization and approved Phase 05 financial rules.

Proposed: bounded stock and reservation capability; not warehouse management.

Deferred approval gates: stock scope/locations, permitted quantities, shortages/backorders, reservation duration, cancellation eligibility, amendments and consumption/restoration rules. Earlier phase completion must not require [Phase 07](PHASE-07-payments-refunds.md) payments or [Phase 08](PHASE-08-fulfillment-order-completion.md) fulfillment. Those phases extend approved contracts; payment refunds and physical stock restoration remain separate.
