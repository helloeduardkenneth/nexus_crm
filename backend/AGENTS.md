# Backend Agent Instructions

## Scope

These instructions apply to all files under `backend/`.

Follow the repository root `AGENTS.md` in addition to these
backend-specific instructions.

If these instructions conflict with repository-wide architectural
decisions, stop and report the conflict before implementation.

## Technology

Use:

- Java 21
- Spring Boot
- Spring MVC
- Maven
- Spring Data JPA when persistence is introduced
- Hibernate when persistence is introduced
- PostgreSQL when database infrastructure is introduced
- Flyway for database migrations
- JUnit using Spring Boot-managed versions
- Mockito
- Testcontainers for database integration testing

Do not introduce alternative frameworks or infrastructure without an
approved architectural decision.

## Java

Use Java 21 language features where they improve clarity.

Prefer:

- constructor injection
- immutable data where practical
- records for immutable DTOs where appropriate
- small focused classes
- explicit and descriptive names
- package-private visibility when public visibility is unnecessary

Avoid:

- field injection
- unnecessary inheritance
- unnecessary abstractions
- mutable shared state
- utility classes that become unrelated collections of behavior
- suppressing compiler warnings without justification

Do not introduce Lombok merely to reduce boilerplate.

## Spring

Keep responsibilities separated.

### Controllers

Controllers are responsible for:

- HTTP request handling
- request validation
- response mapping
- HTTP status codes

Controllers must not contain business logic.

### Services

Services are responsible for:

- application workflows
- business operations
- transaction boundaries where appropriate

Do not place HTTP-specific concerns in services.

### Repositories

Repositories are responsible for persistence access.

Do not place business logic in repositories.

## Dependency Injection

Use constructor injection.

Do not use field injection such as:

`@Autowired` on fields.

Prefer dependencies that are explicit through constructors.

## Persistence

These rules apply once persistence is introduced.

Do not expose JPA entities directly through REST APIs.

Use dedicated request/response DTOs at API boundaries.

Prefer lazy-loading relationships where appropriate.

Avoid:

- unnecessary `FetchType.EAGER`
- N+1 queries
- unnecessary bidirectional relationships
- relying on Open Session in View
- `Optional` fields inside JPA entities

Do not add persistence abstractions before persistence is required by
the active task.

## Database Schema

All database schema changes must be managed through Flyway once
Flyway is introduced.

Never use:

`spring.jpa.hibernate.ddl-auto=update`

For production-like configurations, prefer schema validation once the
migration system is established.

Do not manually introduce schema changes outside the approved
migration workflow.

## Transactions

Transaction boundaries should reflect application use cases rather
than individual repository calls.

Use `@Transactional` deliberately.

Do not add transactions merely as a precaution.

When implementing transactional behavior, consider:

- atomicity
- rollback behavior
- isolation
- concurrent access
- database constraints
- idempotency where relevant

## Validation

Validate external input at application boundaries.

Do not rely solely on frontend validation.

Business invariants must also be enforced by the backend.

## Error Handling

Do not expose internal exceptions or stack traces through API
responses.

When API error handling is introduced, use a consistent error response
model.

Do not create speculative global error-handling infrastructure before
it is required by the active task.

## Testing

Use:

- JUnit using Spring Boot-managed versions for backend tests
- Mockito for isolated unit tests
- Spring Boot Test when Spring application context behavior matters
- Testcontainers when real PostgreSQL behavior matters

Do not mock behavior that should be verified against PostgreSQL.

Business rules should have automated tests.

Bug fixes should include regression tests when practical.

Keep unit tests fast and isolated.

Use integration tests for behavior involving:

- persistence
- transactions
- database constraints
- concurrency
- Spring configuration

## Security

Authorization must ultimately be enforced by the backend.

Never rely on frontend permission checks for security.

Do not:

- commit secrets
- hardcode credentials
- log passwords or authentication tokens
- expose sensitive internal information in errors

Authentication and authorization must not be introduced before their
planned task or phase.

## Architecture

NexusCRM is a modular monolith.

Do not introduce:

- microservices
- distributed service boundaries
- speculative shared frameworks
- unnecessary abstraction layers

without an accepted architectural decision.

New domain modules should be introduced only when required by the
active phase and task.

Do not pre-create empty packages for future domains.

## Scope Discipline

Implement only the active task.

Do not begin work belonging to future tasks because it appears
convenient.

In particular, do not introduce dependencies, infrastructure,
configuration, or abstractions for future features unless the active
task explicitly requires them.

If completing the task appears to require work outside its documented
scope, stop and report it instead of silently expanding the task.

## Verification

For backend changes, run the verification required by the active task.

When applicable, use the Maven Wrapper rather than relying on a
globally installed Maven version.

Typical verification commands are:

On Windows:

`mvnw.cmd test`

`mvnw.cmd package`

On macOS/Linux:

`./mvnw test`

`./mvnw package`

Do not report a backend task as complete if required verification
fails.

If a required command cannot be executed, report:

- which command could not be executed
- why
- whether the failure prevents task completion

Do not hide or ignore failures.
