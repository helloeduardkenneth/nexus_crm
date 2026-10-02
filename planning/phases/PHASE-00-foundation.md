# Phase 00 — Foundation

## Status

Not Started

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
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- Maven
- JUnit 5
- Mockito
- Testcontainers

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
- Spring Data JPA
- validation
- testing

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

once migrations establish the required schema.

---

### Testing Foundation

Backend:

- JUnit 5
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

### TASK-0001 — Repository Structure - Completed

Establish and verify the initial repository, documentation, planning,
and context-harness structure.

### TASK-0002 — Spring Boot Bootstrap - Completed

Initialize the Java 21 Spring Boot backend using Maven and establish
the base backend application structure.

### TASK-0003 — PostgreSQL Development Environment

Configure PostgreSQL for local development using Docker Compose and
environment-based configuration.

### TASK-0004 — Flyway Database Migrations

Configure Flyway and verify database migrations against PostgreSQL.
Ensure Hibernate does not automatically manage the database schema.

### TASK-0005 — React + TypeScript Bootstrap

Initialize the frontend using pnpm, React, TypeScript, and Vite.

Configure TypeScript strict mode and establish the basic frontend
application structure.

### TASK-0006 — Frontend Architecture Foundation

Configure the foundational frontend libraries and application
structure:

- React Router
- Zustand
- React Hook Form
- Tailwind CSS

Do not implement CRM business features or screens.

### TASK-0007 — Frontend Quality & Testing Tooling

Configure and verify:

- Oxlint
- Vitest
- React Testing Library
- TypeScript type checking
- Production build verification

Establish standard pnpm commands for frontend verification.

### TASK-0008 — Backend Testing Foundation

Configure and verify:

- JUnit 5
- Mockito
- Spring Boot Test
- Testcontainers
- PostgreSQL integration testing

Establish the distinction between unit and integration tests.

### TASK-0009 — Development Documentation

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

### TASK-0010 — Phase 00 Verification

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

- [ ] Repository structure is established
- [ ] Spring Boot application starts successfully
- [ ] Java 21 is configured
- [ ] React application starts successfully
- [ ] pnpm is configured as the frontend package manager
- [ ] pnpm-lock.yaml exists and is committed
- [ ] No npm/Yarn/Bun lockfile exists
- [ ] TypeScript strict mode is enabled
- [ ] Oxlint is configured
- [ ] Frontend linting with Oxlint succeeds
- [ ] PostgreSQL runs through Docker
- [ ] Spring Boot connects to PostgreSQL
- [ ] Flyway migrations execute successfully
- [ ] Hibernate does not automatically modify the schema
- [ ] Backend unit tests execute successfully
- [ ] PostgreSQL integration tests execute using Testcontainers
- [ ] Frontend tests execute successfully
- [ ] Frontend type checking succeeds
- [ ] Frontend production build succeeds
- [ ] Local development instructions are documented
- [ ] No CRM business functionality has been introduced

---

## Learning Objectives

By the end of this phase, the developer should understand:

### Java / Spring

- How a Spring Boot application is structured
- How Spring Boot configuration works
- How environment-specific configuration works
- How dependency injection works at a basic level
- How Spring Data JPA connects to PostgreSQL

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

Status: Not Started

Completed Tasks:

None

Notes:

None