# PHASE-11 — Reporting & Dashboards

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Provide trustworthy, role-appropriate consolidated reporting across the implemented sales, financial and operational workflows.

## Why This Phase Exists

Managers and finance need consistent cross-record answers based on actual history, not merely more charts. Consolidation must not replace the daily work views already delivered by earlier phases.

## Prerequisites

- Implemented Phase 02–09 source domains and their captured activity/stage/commercial/financial/operational history.
- Phase 01 visibility and audit contracts; Phase 10 delivery data only for reports that explicitly use it, not as a prerequisite for basic sales reports.
- Approved metric definitions, time boundaries, currency treatment and reporting permissions before affected tasks.

## In Scope

- Bounded sales/pipeline, finance, fulfillment and support reports using approved measures and filters.
- Role-appropriate consolidated dashboards, drill-down and bounded report exports.
- Clear definitions, as-of/freshness context and actionable links to authorized records.
- Selected performance improvements supported by measured query needs.

## Out of Scope

- Rebuilding operational assigned-work/list summaries from earlier phases.
- Data warehouse, unrestricted BI builder, arbitrary SQL reports, AI predictions or ERP accounting reports.
- Inventing lost historical data, treating payments as revenue without approved definitions, or adding Redis/RabbitMQ solely for charts.

## Core User Workflows

Manager opens permitted sales/pipeline report → chooses dates/team/stage filters → sees defined measures → drills into authorized records.

Finance reconciles an approved payment/refund or conditional billing summary against recorded sources; an authorized employee exports a bounded result with the same visibility rules.

Operational users review fulfillment/support summaries without losing access to their earlier daily work screens.

## UX and Usability Requirements

- Small role-specific dashboard defaults, plain metric definitions and progressive disclosure of advanced filters.
- Guided no-data states, readable dates/units, accessible tabular alternatives to charts and responsive layouts.
- Preserve filter/navigation context, communicate freshness and show useful drill-down/next actions.
- Never require advanced reporting to find assigned work or understand basic domain status.

## Backend Responsibilities

- Authorized aggregation/query services, approved metric/time/currency semantics and bounded pagination/export.
- Trace results to owning domain facts and preserve visibility in aggregates/drill-downs.
- Optimize measured queries within the monolith; do not finalize projections/materialization architecture before evidence.

## Frontend Responsibilities

- Role-specific report/dashboard interactions, filters, explanations, accessible charts/tables and authorized drill-down/export.
- Show clear loading/failure/freshness state and avoid overwhelming first-time users.
- Keep reporting server data authoritative; retain existing operational navigation.

## Data Model Direction

Conceptual reporting views/projections aggregate existing domain records and captured history. Reporting does not own or rewrite source financial/stock data. Metrics, grain, time windows and currency policy require approval. Snapshot/materialized-view choices and freshness guarantees remain implementation decisions supported by measurements.

## Authorization / Security Considerations

- Apply team/organization/record visibility to aggregates, filters, drill-down and exports, not just detail screens.
- Prevent hidden data leakage through counts, dimensions or cached responses.
- Restrict sensitive finance/audit reporting and protect exported personal data under approved retention/access rules.

## Auditability

Capture relevant report/export/configuration actions under approved audit policy, including requester and permitted scope without logging sensitive exported contents. Source business events retain earlier provenance; reports must not fabricate history or replace audit capture.

## Testing Expectations

- Unit tests for metric/date/currency definitions and empty/boundary cases.
- PostgreSQL integration comparing reports to known source histories, including cancellations/refunds/returns where relevant.
- Permission-negative aggregation/drill-down/export tests and data-consistency cases during concurrent updates.
- Frontend/browser filters, accessible tables/charts, no-data/failure states and performance measurements on representative bounded data.

## Performance / Concurrency Considerations

Avoid unbounded scans and N+1 drill-downs. Define acceptable freshness and consistency under concurrent source changes; preserve financial reconciliation semantics. Introduce indexes/projections only for measured needs and approved migrations, not a new analytics infrastructure by default.

## Acceptance Criteria

- [ ] Approved metric definitions and source ownership are documented before report tasks.
- [ ] Role-appropriate reports reconcile to recorded source data and handle relevant financial/operational exceptions correctly.
- [ ] Filters, aggregate values, drill-down and exports obey backend visibility rules.
- [ ] Users understand report meaning, time scope and freshness with accessible table/chart alternatives.
- [ ] Earlier assigned-work and basic summary views remain independently useful.
- [ ] Representative performance, accuracy, permission, UI and regression verification passes.
- [ ] No invented history, accounting/BI platform or speculative infrastructure is introduced.

## Candidate Tasks

1. Approve metrics, scope, temporal/currency semantics and reporting permissions.
2. Implement bounded pipeline/sales reporting from source history.
3. Add approved finance and fulfillment/support summaries.
4. Deliver role-appropriate dashboards and accessible drill-down/filter views.
5. Add bounded authorized report exports.
6. Verify accuracy, exception cases, visibility, freshness and measured performance.

## Deferred Decisions / Risks

Established: earlier phases own operational records/history and basic daily summaries; reporting is a separate read-oriented responsibility.

Proposed: bounded consolidated reports with useful explanations, not a universal analytics platform.

Deferred approval gates: exact KPIs, attribution/timezone, cash versus revenue meanings, currency aggregation, conditional billing measures, report visibility, export bounds and freshness/consistency targets. Resolve before affected tasks. Missing required source history must be reported and handled through explicit replanning, not silently reconstructed or used to rewrite completed phases.
