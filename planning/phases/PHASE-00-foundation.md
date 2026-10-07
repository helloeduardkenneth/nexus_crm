# Phase 00 — Foundation

## Status

Completed

## Objective

Establish the technical foundation of NexusCRM before implementing
business features.

At the end of this phase, the project should have a working backend,
frontend, database, local development environment, migration system,
and testing foundation.

No CRM business functionality should be implemented during this phase.

---

## Goals

By completing this phase, the project should have:

- A structured Git repository
- A Spring Boot backend
- A React + TypeScript frontend
- PostgreSQL running locally
- Database migrations using Flyway
- Docker-based local infrastructure
- Backend testing infrastructure
- Frontend testing infrastructure
- Basic linting and formatting
- Environment configuration
- A repeatable local development workflow

---

## Technology

### Backend

- Java 21
- Spring Boot
- Spring MVC
- PostgreSQL
- Flyway
- Maven
- JUnit using Spring Boot-managed versions
- Mockito
- Testcontainers

Spring Data JPA and Hibernate remain planned backend technologies, deferred
with developer approval to the first later task introducing domain persistence.

### Frontend

- React
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Tailwind CSS
- Oxlint
- Vitest
- React Testing Library
- pnpm

### Infrastructure

- Docker
- Docker Compose
- PostgreSQL
- Git

Redis and RabbitMQ are intentionally excluded from Phase 00.

They will be introduced when the application actually requires them.

---

## Scope

### Repository

Establish the base repository structure.

Expected high-level structure:

nexus-crm/
├── backend/
├── frontend/
├── docs/
├── planning/
├── docker-compose.yml
├── AGENTS.md
├── README.md
└── .gitignore

---

### Backend Foundation

Create the Spring Boot application.

The backend should support:

- application startup
- environment-based configuration
- PostgreSQL connectivity
- Flyway migrations
- testing

With developer approval during TASK-0010 planning, Spring Data JPA/Hibernate
are deferred to the first later domain-persistence task. Backend Bean Validation
is deferred to the first later task introducing a request boundary. No backend
request endpoints exist yet; these deferrals do not relax validation or
authorization requirements when those boundaries are introduced.

No business modules should be implemented yet.

---

### Frontend Foundation

### Frontend Foundation

Create the React + TypeScript application using pnpm.

Configure:

- Vite
- TypeScript strict mode
- React Router
- Zustand
- React Hook Form
- Tailwind CSS
- Oxlint
- Vitest
- React Testing Library

pnpm must be used as the package manager.

Oxlint must be used as the primary frontend linter.

The frontend should initially contain only a minimal application shell.

Do not implement CRM screens yet.

---

### Database Foundation

Configure PostgreSQL for local development.

Requirements:

- PostgreSQL runs through Docker
- backend can connect to PostgreSQL
- credentials come from configuration/environment
- Flyway controls schema migrations

Hibernate must not automatically modify the database schema.

Do not use:

spring.jpa.hibernate.ddl-auto=update

Prefer:

spring.jpa.hibernate.ddl-auto=validate

when JPA/Hibernate are introduced and migrations establish the required schema.

---

### Testing Foundation

Backend:

- JUnit using Spring Boot-managed versions
- Mockito
- Spring Boot Test
- Testcontainers
- PostgreSQL integration testing

Frontend:

- Vitest
- React Testing Library

At least one basic backend test and one basic frontend test should
demonstrate that the testing infrastructure works.

---

### Development Environment

Frontend dependency management must be reproducible using pnpm.

A developer should be able to install frontend dependencies using:

pnpm install

Start frontend development using:

pnpm dev

Run frontend verification using:

pnpm lint
pnpm typecheck
pnpm test
pnpm build

---

## Out of Scope

Do NOT implement the following during Phase 00:

- Authentication
- JWT
- Users
- Roles
- Permissions
- Customers
- Leads
- Opportunities
- Quotes
- Products
- Inventory
- Orders
- Payments
- Support tickets
- Redis
- RabbitMQ
- Notifications
- Reporting

These belong to later phases.

---

## Planned Tasks

### TASK-0001 — Repository Structure - ✅ Completed

Establish and verify the initial repository, documentation, planning,
and context-harness structure.

### TASK-0002 — Spring Boot Bootstrap - ✅ Completed

Initialize the Java 21 Spring Boot backend using Maven and establish
the base backend application structure.

### TASK-0003 — PostgreSQL Development Environment — ✅ Completed

Configure PostgreSQL for local development using Docker Compose and
environment-based configuration.

### TASK-0004 — Flyway Database Migrations — ✅ Completed

Configure Flyway and verify database migrations against PostgreSQL.
Ensure Hibernate does not automatically manage the database schema.

### TASK-0005 — React + TypeScript Bootstrap — ✅ Completed

Initialize the frontend using pnpm, React, TypeScript, and Vite.

Configure TypeScript strict mode and establish the basic frontend
application structure.

### TASK-0006 — Frontend Architecture Foundation — ✅ Completed

Configure the foundational frontend libraries and application
structure:

- React Router
- Zustand
- React Hook Form
- Tailwind CSS

Do not implement CRM business features or screens.

### TASK-0007 — Frontend Quality & Testing Tooling — ✅ Completed

Configure and verify:

- Oxlint
- Vitest
- React Testing Library
- TypeScript type checking
- Production build verification

Establish standard pnpm commands for frontend verification.

### TASK-0008 — Backend Testing Foundation — ✅ Completed

Configure and verify:

- JUnit using Spring Boot-managed versions
- Mockito
- Spring Boot Test
- Testcontainers
- PostgreSQL integration testing

Establish the distinction between unit and integration tests.

### TASK-0009 — Development Documentation — ✅ Completed

Document:

- prerequisites
- local environment setup
- environment variables
- PostgreSQL startup
- backend startup
- frontend startup
- pnpm commands
- Maven commands
- testing commands
- linting
- type checking
- build commands

Ensure a new developer can reproduce the local development
environment from the documentation.

### TASK-0010 — Phase 00 Verification — ✅ Completed

Perform the final Phase 00 verification.

Verify:

- repository structure
- Spring Boot startup
- React startup
- PostgreSQL connectivity
- Flyway migrations
- backend unit tests
- backend integration tests
- frontend tests
- Oxlint
- TypeScript type checking
- frontend production build
- Docker Compose environment
- development documentation

Confirm that no CRM business functionality has been implemented.

Complete the Phase 00 completion review before proceeding to Phase 01.

---

## Acceptance Criteria

## Acceptance Criteria

Phase 00 is complete when:

- [x] Repository structure is established
- [x] Spring Boot application starts successfully
- [x] Java 21 is configured
- [x] React application starts successfully
- [x] pnpm is configured as the frontend package manager
- [x] pnpm-lock.yaml exists and is committed
- [x] No npm/Yarn/Bun lockfile exists
- [x] TypeScript strict mode is enabled
- [x] Oxlint is configured
- [x] Frontend linting with Oxlint succeeds
- [x] PostgreSQL runs through Docker
- [x] Spring Boot connects to PostgreSQL
- [x] Flyway migrations execute successfully
- [x] Hibernate does not automatically modify the schema
- [x] Backend unit tests execute successfully
- [x] PostgreSQL integration tests execute using Testcontainers
- [x] Frontend tests execute successfully
- [x] Frontend type checking succeeds
- [x] Frontend production build succeeds
- [x] Local development instructions are documented
- [x] No CRM business functionality has been introduced

---

## Learning Objectives

By the end of this phase, the developer should understand:

### Java / Spring

- How a Spring Boot application is structured
- How Spring Boot configuration works
- How environment-specific configuration works
- How dependency injection works at a basic level
- How the JDBC datasource connects to PostgreSQL and Flyway runs at startup
- Why JPA/Hibernate and backend request validation are deferred until their
  first corresponding domain-persistence and request-boundary tasks

### Database

- Why database migrations are necessary
- The difference between Hibernate schema generation and Flyway
- How PostgreSQL is configured for an application
- How Docker provides local infrastructure

### Testing

- Difference between unit and integration tests
- When Mockito should be used
- Why database integration tests use Testcontainers
- Why PostgreSQL tests are preferable when PostgreSQL-specific
  behavior matters

### Frontend

- How Vite bootstraps React
- TypeScript strict mode
- Basic React application architecture
- Frontend routing
- Global state management
- Component testing

### Engineering

- Separation between infrastructure and business functionality
- Reproducible development environments
- Incremental development
- Task-based AI-assisted development

---

## Phase Completion Review

Before marking this phase complete:

1. Run all backend tests.
2. Run all frontend tests.
3. Run frontend type checking.
4. Run frontend linting.
5. Start PostgreSQL using Docker Compose.
6. Start the Spring Boot application.
7. Start the React application.
8. Verify Flyway migrations.
9. Review Git status and diff.
10. Confirm no Phase 01 functionality was implemented.

The phase should not be marked complete if any required verification
fails.

---

## Completion

Status: Completed — verified locally on 2026-10-08

Completed Tasks:

TASK-0001 through TASK-0010.

Notes:

Fresh closeout evidence is recorded in
[TASK-0010](../tasks/completed/TASK-0010-phase-00-verification.md).
Local completion does not imply PR approval or merge; Phase 01 is not started.

Acceptance evidence (in checklist order):

1. Repository layout and tracked prerequisite records inspected.
2. Normal packaged Spring Boot startup with real datasource/Flyway succeeded
   within 60 seconds; owned process/port cleanup verified.
3. Java 21.0.12.1 and Maven Wrapper 3.9.16 verified; Java 21 compilation passed.
4. Controlled Vite startup returned HTTP 200; separate native browser inspection
   verified React rendering and interactions with no console runtime errors.
5. Exact pnpm 12.9.1, packageManager and pnpm scripts verified.
6. Canonical pnpm-lock.yaml is tracked; frozen installation preserved its hash.
7. Alternative npm/Yarn/Bun lockfile inspection found none.
8. Both referenced TypeScript projects retain strict/composite/noEmit settings;
   `pnpm typecheck` passed.
9. Oxlint configuration and the zero-warning lint script inspected.
10. `pnpm lint` passed.
11. Compose validation, healthy PostgreSQL 18.6 startup and readiness passed;
    discovered persistent volume survived normal shutdown.
12. Real packaged backend established a PostgreSQL connection; read-only SQL
    verified the configured development database and existing schema.
13. Two real PostgreSQL Testcontainers integration tests verified fresh V1
    migration and idempotence; development history has exactly one successful
    V1 SQL entry and an unchanged full-history fingerprint across startup.
14. Hibernate/JPA are absent and generic SQL initialization is disabled;
    Flyway remains the only schema-management mechanism.
15. Credential-unset Maven unit/smoke suite passed all three tests.
16. Full `./mvnw clean verify` passed three Surefire and two actual PostgreSQL
    18.6 Failsafe tests with zero failures/errors/skips and packaged the JAR.
17. `pnpm test` passed all ten component tests.
18. `pnpm typecheck` passed.
19. `pnpm build` produced the production frontend artifacts successfully.
20. README/development/testing commands matched actual scripts/defaults;
    ten local links resolved and fifteen Bash fences passed syntax checking.
21. Actual source/dependency/schema inspection confirmed no CRM functionality,
    authentication or Phase 01 feature; application schema has zero tables.

Completion-review items 1–10 were satisfied respectively by backend tests,
frontend tests, strict type checking, Oxlint, healthy Compose startup, normal
packaged backend startup, Vite plus native browser checks, migration/history
verification, final Git diff/protected-file audit and absence of Phase 01 code.
Independent code review returned APPROVE with no findings; independent QA
returned PASS. All 77 protected tracked-file hashes were unchanged; final
whitespace, secret, generated-artifact and scope checks passed.

Developer-approved sequencing: JPA/Hibernate are deferred to the first later
domain-persistence task and backend Bean Validation to the first later
request-boundary task. Long-term architecture, validation/authorization and
the prohibition on Hibernate schema mutation remain unchanged. Formatting
verification used existing conventions/whitespace, not a new formatter.

Warnings: initial Docker unavailability was resolved before verification.
The first developer Vitest worker startup timed out before running tests;
an unchanged retry and independent QA both passed all tests. No gates were
weakened and the transient cause is unconfirmed. No substantive repairs were
needed. Only owned runtime resources were cleaned up; persistent data and
unrelated Docker resources were preserved.
