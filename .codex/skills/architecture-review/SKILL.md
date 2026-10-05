---
name: architecture-review
description: Review proposed NexusCRM architecture, module boundaries, API contracts, database designs, transactions, concurrency, security boundaries, infrastructure changes, and significant dependencies before implementation.
---

# Architecture Review

Use this skill for architectural analysis, not routine code review or
implementation.

This skill is read-only and advisory.

Do not modify project files.

Do not implement code.

Do not create migrations.

Do not add dependencies.

Do not commit or push changes.

## Objective

Determine the smallest maintainable design that satisfies the active task
while preserving NexusCRM architecture, domain ownership, security,
data integrity, transaction correctness, and learning value.

Architecture should serve the current requirement.

Do not design speculative infrastructure or abstractions for hypothetical
future requirements.

## Procedure

1. Read the root and applicable nested `AGENTS.md` files.

2. Read the active task and corresponding phase document.

3. Read applicable accepted ADRs.

4. Read relevant architecture, database, and API documentation when those
   documents exist.

5. Inspect the actual affected code, tests, dependency configuration,
   database migrations, and current Git state.

6. Establish the task boundaries and distinguish:
   - existing architecture
   - accepted decisions
   - task requirements
   - implementation proposals
   - unresolved decisions

7. Preserve the modular-monolith architecture and existing domain ownership
   unless an accepted ADR explicitly changes them.

8. Trace relevant:
   - module dependencies
   - domain ownership
   - API contracts
   - data ownership
   - persistence boundaries
   - authorization boundaries
   - transaction boundaries
   - concurrency risks
   - infrastructure dependencies

9. Compare the smallest viable design with meaningful alternatives.

10. Identify:
    - migration implications
    - backward compatibility
    - operational costs
    - security implications
    - required verification
    - decisions requiring human approval

Do not invent missing business behavior.

Do not treat proposed ADRs as accepted decisions.

## Domain and Module Boundaries

NexusCRM uses a modular monolith.

Primary backend domains include:

- auth
- user
- customer
- lead
- opportunity
- quote
- product
- inventory
- order
- payment
- support
- notification
- reporting
- audit

Check that:

- business ownership is clear
- responsibilities remain in the appropriate module
- dependency direction is intentional
- modules do not access another module's internals unnecessarily
- shared abstractions are genuinely shared
- convenience does not create inappropriate coupling

Do not introduce microservices unless an accepted ADR explicitly changes
the modular-monolith decision.

## API Architecture

When API behavior is affected, evaluate:

- resource boundaries
- request DTOs
- response DTOs
- validation
- HTTP status behavior
- error representation
- pagination
- filtering
- idempotency
- compatibility
- authorization boundaries

Never recommend exposing JPA entities directly through REST controllers.

Controllers should handle HTTP concerns and orchestration, not business rules.

## Persistence Architecture

When persistence is affected, evaluate:

- aggregate or domain ownership
- table relationships
- foreign keys
- uniqueness constraints
- nullability
- indexes
- lifecycle behavior
- deletion behavior
- audit/history requirements
- migration compatibility

Database schema changes require Flyway migrations.

Do not rely on Hibernate `ddl-auto=update`.

Prefer database-level enforcement for invariants that must remain true
regardless of application code.

## Transaction Design

For operations containing multiple related state changes, determine:

- where the transaction starts
- where the transaction ends
- which changes must be atomic
- which work should occur after commit
- rollback expectations
- external side-effect handling

Avoid unnecessarily broad transactions.

Do not place slow or unreliable external operations inside database
transactions without a clear reason.

## Concurrency

Explicitly evaluate concurrency when the task affects areas such as:

- payments
- inventory
- order state transitions
- fulfillment
- duplicate submissions
- retries
- background processing
- counters
- reservation behavior

Consider only mechanisms justified by the actual invariant, including:

- database uniqueness constraints
- idempotency
- optimistic locking
- pessimistic locking
- atomic database operations
- compare-and-set behavior
- serialized queue processing

Do not introduce locking merely because concurrent access is theoretically
possible.

Recommend the simplest mechanism that protects the actual invariant.

## Security Architecture

Evaluate:

- authentication boundaries
- authorization ownership
- object-level authorization
- privilege escalation risk
- sensitive data handling
- validation boundaries
- trust boundaries
- secret handling

Backend authorization is authoritative.

Frontend permission checks are UX only and must never be treated as a
security boundary.

## Dependency Review

Before recommending a dependency:

1. Determine whether existing project capabilities already solve the need.
2. Determine whether Java, Spring, PostgreSQL, browser APIs, or existing
   libraries already provide sufficient functionality.
3. Identify maintenance and operational cost.
4. Identify security and architecture impact.
5. Confirm that the dependency solves a concrete requirement.

Do not add infrastructure merely because it is commonly used in enterprise
applications.

## Alternatives

Consider alternatives only when they are realistic.

Do not generate alternatives merely to populate the review.

Compare meaningful alternatives using:

- correctness
- complexity
- maintainability
- operational cost
- reversibility
- security
- learning value
- justified extensibility

## ADR Decision

Recommend an ADR only when the decision is:

- architecturally significant
- cross-cutting
- long-lived
- difficult to reverse
- likely to require future explanation

Routine implementation choices do not need ADRs.

Do not create an ADR during architecture review unless explicitly requested.

## Human Approval Gate

Return `NEEDS_HUMAN_DECISION` when the task requires a decision involving:

- major architecture changes
- new service boundaries
- microservices
- destructive data architecture
- replacement of authentication architecture
- irreversible infrastructure changes
- materially ambiguous business requirements
- multiple valid approaches with significant long-term consequences

Do not silently choose such decisions.

## Verification

Use read-only inspection where useful, including:

```bash
git status --short --untracked-files=all
git diff --stat
git diff
rg "<relevant-pattern>"