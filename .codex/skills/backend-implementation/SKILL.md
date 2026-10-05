
### `.codex/skills/backend-implementation/SKILL.md`

```md
---
name: backend-implementation
description: Implement an approved NexusCRM backend task involving Java, Spring Boot, APIs, persistence, transactions, security, concurrency, messaging, integrations, or Flyway migrations under backend/.
---

# Backend Implementation

Use this skill only when backend implementation is authorized.

A planning, investigation, diagnosis, architecture-review, or code-review
request does not authorize code changes.

The active task defines implementation scope.

The root and backend `AGENTS.md` files define engineering policy.

Accepted ADRs define architecture decisions.

## Objective

Implement the smallest correct backend change that satisfies the active task
while preserving:

- modular-monolith boundaries
- domain ownership
- data integrity
- transaction correctness
- security
- maintainability
- testability
- learning value

Do not refactor unrelated backend code.

Do not introduce speculative abstractions.

## Procedure

1. Read:
   - root `AGENTS.md`
   - `backend/AGENTS.md`
   - active task
   - corresponding phase
   - applicable accepted ADRs
   - relevant architecture/API/database documentation when present

2. Inspect:
   - affected production source
   - related tests
   - Maven configuration
   - Flyway migrations when relevant
   - dependency configuration
   - current Git worktree

3. Check the Git baseline before editing.

   Preserve developer-authored uncommitted changes.

   Do not overwrite or discard unrelated work.

4. Extract:
   - required behavior
   - acceptance criteria
   - domain ownership
   - API impact
   - persistence impact
   - security requirements
   - transaction requirements
   - concurrency requirements
   - expected tests
   - required verification

5. Produce a scoped implementation plan identifying:
   - files likely to change
   - contract changes
   - dependencies
   - migrations
   - tests
   - verification
   - risks

6. Honor architecture, approval, and prerequisite gates before implementation.

7. Implement the smallest correct change inside the existing modular monolith.

8. Add or update behavioral tests alongside the implementation.

9. Run required verification.

10. Perform a self-review before handing the implementation back to the
    orchestrator.

## Domain Logic

Keep business logic in appropriate backend services or domain components.

Avoid:

- business logic in controllers
- application workflows inside repositories
- duplicating business rules across endpoints
- exposing persistence implementation as API design

Make important invariants explicit.

## REST APIs

For REST changes:

- use request/response DTOs
- validate external input
- use appropriate HTTP status codes
- preserve consistent error handling
- maintain explicit API contracts
- preserve compatibility unless intentionally changed
- enforce authorization on the backend

Never expose JPA entities directly from REST controllers.

## Persistence

Use Spring Data JPA and Hibernate intentionally.

Avoid:

- unnecessary EAGER relationships
- accidental N+1 queries
- uncontrolled cascading
- oversized persistence graphs
- bidirectional mappings without clear value

Use database constraints when an invariant must remain true independently
of application code.

## Flyway

Every database schema change requires a Flyway migration.

Migrations must be:

- deterministic
- ordered correctly
- reproducible
- PostgreSQL-compatible
- safe for existing data when required by the task

Preserve already-applied migration history.

Do not modify an applied migration merely to rewrite history.

Create a new migration instead unless repository policy explicitly permits
otherwise.

Never use Hibernate `ddl-auto=update` as a replacement for Flyway.

## Transactions

Use transactions when the business operation requires atomicity.

Explicitly consider:

- transaction start
- transaction end
- rollback behavior
- partial state risk
- external side effects
- event publication
- retry behavior

Do not add `@Transactional` mechanically.

Understand and document why the transaction exists.

Avoid transactions broader than necessary.

## Concurrency

For concurrency-sensitive behavior, identify the invariant first.

Consider when relevant:

- duplicate requests
- payment processing
- inventory updates
- order transitions
- fulfillment
- retries
- scheduled/background work

Potential mechanisms include:

- unique constraints
- optimistic locking
- pessimistic locking
- idempotency keys
- atomic database operations
- retry logic

Choose the simplest solution that protects the actual invariant.

Do not introduce locking without a concrete race condition or invariant.

## Security

Backend security is authoritative.

Check:

- authentication
- role/permission enforcement
- object ownership
- object-level authorization
- privilege escalation
- sensitive data exposure
- request validation
- unsafe input

Never rely on frontend visibility or disabled UI controls as authorization.

Never expose or log secrets, credentials, tokens, or sensitive environment
values.

## Error Handling

Failures should:

- preserve data integrity
- return predictable API behavior
- avoid sensitive information leakage
- remain diagnosable
- use appropriate application exceptions

Do not catch exceptions merely to suppress them.

## Dependencies

Do not silently introduce dependencies.

Before adding one:

1. Check whether existing capabilities already solve the problem.
2. Confirm the dependency is required by the task.
3. Evaluate architectural and operational impact.
4. Apply the root approval gate.
5. Modify dependencies using the project build tooling.

Report all dependency changes.

## Testing

Use:

- JUnit 5
- Mockito where isolation is appropriate
- Spring integration testing where framework behavior matters
- PostgreSQL/Testcontainers when actual PostgreSQL behavior matters

Tests should cover relevant:

- business rules
- happy paths
- invalid input
- failure behavior
- regression scenarios
- persistence behavior
- authorization behavior
- transaction behavior
- concurrency behavior

Do not add Testcontainers, deferred infrastructure, or new testing libraries
merely because this skill mentions them.

The active task and existing project state determine what is appropriate.

## Verification

Run task-specific verification.

Use Git Bash and the repository Maven Wrapper.

Typical verification:

```bash
cd backend
./mvnw --version
./mvnw clean verify
cd ..
git diff --check
git status --short --untracked-files=all
git diff