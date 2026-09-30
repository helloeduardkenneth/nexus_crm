# NexusCRM Agent Instructions

## Mission

NexusCRM is a production-oriented enterprise CRM and order-management
platform built as a learning project for enterprise full-stack engineering.

The system manages:

Customer
→ Lead
→ Opportunity
→ Quote
→ Order
→ Payment
→ Fulfillment

It also includes support tickets, reporting, notifications, inventory,
audit logging, and administrative functionality.

---

## Primary Engineering Goal

The purpose of this repository is not merely to produce working software.

It must also help the developer understand:

- Java
- Spring Boot
- Spring MVC
- Spring Security
- JPA / Hibernate
- PostgreSQL
- transaction management
- concurrency
- REST API design
- React
- TypeScript
- enterprise architecture
- automated testing
- production engineering

Do not hide important engineering concepts behind generated code.

---

## Architecture

Use a modular monolith.

Do NOT introduce microservices unless an accepted ADR explicitly changes
this decision.

Primary backend domains:

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

---

## Backend Technology

- Java 21
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- Redis
- RabbitMQ
- JUnit 5
- Mockito
- Testcontainers

---

## Frontend Technology

- React
- TypeScript
- Zustand
- React Router
- React Hook Form
- Tailwind CSS
- Vitest
- React Testing Library
- Oxlint

## Frontend Tooling

- pnpm is the required JavaScript package manager.
- Oxlint is the primary JavaScript/TypeScript linter.

---

## Infrastructure

- Docker
- Docker Compose
- Git

---

## Engineering Rules

- Never expose JPA entities directly from REST controllers.
- Controllers must not contain business logic.
- Authorization must be enforced on the backend.
- Frontend permission checks are UX only, not security.
- Database schema changes require Flyway migrations.
- Do not use Hibernate ddl-auto=update.
- Avoid unnecessary EAGER relationships.
- Avoid N+1 query problems.
- Validate all external input.
- Do not silently introduce dependencies.
- Do not silently change architecture.
- Do not refactor unrelated code while implementing a task.
- Prefer simple implementations over speculative abstractions.

## Package Management Rules

- Use pnpm for all JavaScript/TypeScript package management.
- Do not use npm, Yarn, or Bun.
- Do not create package-lock.json or yarn.lock.
- pnpm-lock.yaml is the canonical frontend lockfile.
- Use `pnpm add` and `pnpm remove` for dependency changes.
- Do not manually edit dependency versions in package.json when pnpm
  should perform the operation.
- Do not install dependencies globally when a project-local dependency
  is appropriate.

## Frontend Linting Rules

- Oxlint is the primary frontend linter.
- Do not introduce ESLint unless an accepted ADR explicitly requires it.
- Do not disable lint rules merely to make checks pass.
- Fix the underlying issue when practical.
- Any lint suppression must be narrow and justified.

---

## AI Workflow

Before implementing a task:

1. Read the applicable AGENTS.md files.
2. Read the active phase document.
3. Read the active task document.
4. Inspect relevant existing code.
5. Read applicable ADRs.
6. Identify dependencies and risks.
7. Produce a short implementation plan.

Do not modify code until the task and existing implementation have been
understood.

During implementation:

1. Stay within task scope.
2. Follow existing project conventions.
3. Implement the smallest correct solution.
4. Add or update tests.
5. Do not fix unrelated problems unless required for the task.

After implementation:

1. Compile affected projects.
2. Run relevant tests.
3. Run lint/typecheck where applicable.
4. Review the diff.
5. Check for security or data-integrity issues.
6. Report files changed.
7. Report tests executed.
8. Report unresolved issues.

---

## Testing Rules

Every business rule should have automated tests.

Important workflows require integration tests.

Persistence-sensitive tests should use PostgreSQL through Testcontainers
when database behavior matters.

Bug fixes should include regression tests when practical.

---

## Learning Contract

This is a learning project.

For significant engineering concepts, explain:

1. What was implemented.
2. Why it is necessary.
3. How it works.
4. Alternatives considered.
5. Common failure modes.
6. How the concept could appear in a technical interview.

Generated code without understanding is not considered sufficient.

---

## Definition of Done

A task is not complete merely because code was generated.

A task is complete when:

- acceptance criteria are satisfied
- code compiles
- relevant tests pass
- architecture rules are respected
- documentation is updated when necessary
- the diff contains no unrelated modifications
- the implementation can be explained by the developer