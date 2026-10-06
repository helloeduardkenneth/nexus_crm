# NexusCRM

An enterprise CRM and order-management learning project, designed as a
modular monolith. The repository currently contains the Phase 00 technical
foundation—not a working CRM product.

## What exists today

- Java 21 / Spring Boot backend with environment-driven PostgreSQL connectivity
  and Flyway migrations. There are no business endpoints or JPA entities yet.
- PostgreSQL 18.6 development service with persistent Docker Compose storage.
- React / strict TypeScript / Vite frontend with routing, a UI preference and
  a local technical form demonstration; no backend API integration.
- Backend unit/smoke and disposable PostgreSQL integration tests; frontend
  Oxlint, Vitest and React Testing Library checks.

Authentication and CRM business functionality belong to later phases.

## Start here

Follow [Development setup](docs/DEVELOPMENT.md) for prerequisites, local
configuration and PostgreSQL/backend/frontend startup. Commands target Git
Bash on Windows; use the committed Maven Wrapper and **pnpm 12.9.1 only**.
Do not commit local credentials or reset persistent development data.

See [Testing and quality checks](docs/TESTING.md) for fast checks, full
Docker-backed verification and failure reports. A frontend build is not proof
of browser rendering, and a backend smoke test is not database evidence.

## Repository guide

| Path | Responsibility |
|---|---|
| `backend/` | Spring Boot application, Flyway migration and backend tests |
| `frontend/` | React application and frontend quality tooling |
| `docker-compose.yml` | Local PostgreSQL service only |
| `.env.example` | Safe environment template; password intentionally empty |
| `docs/` | Project, development and testing documentation |
| `planning/` | Phases, task specifications and completion evidence |

[Project goals](docs/PROJECT.md) describe the intended product, not implemented
features. [Roadmap](planning/ROADMAP.md) and
[Phase 00](planning/phases/PHASE-00-foundation.md) track incremental delivery.
Overall Phase 00 completion remains a separate final verification task.
