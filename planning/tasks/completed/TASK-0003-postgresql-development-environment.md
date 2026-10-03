# TASK-0003 — PostgreSQL Development Environment

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Establish a reproducible local PostgreSQL development environment using Docker Compose, with environment-based configuration, persistent storage, a health check, and documented operating and verification commands.

## Context

NexusCRM requires PostgreSQL as its primary relational database. This task provides the local database infrastructure independently of Spring Boot persistence integration so the database lifecycle and configuration can be understood and verified before application connectivity is introduced.

Docker Engine must be running before implementation verification begins. The Docker client and Docker Compose are already installed, but a stopped or unavailable Docker daemon prevents the runtime acceptance criteria from being verified.

PostgreSQL is pinned to the official Debian-based `postgres:18.6` image. PostgreSQL 18+ official images store database data under `/var/lib/postgresql`, so the named volume must be mounted at that location rather than the older `/var/lib/postgresql/data` path.

## Requirements

1. Create a root `docker-compose.yml` that:
   - Defines one service named `postgres`.
   - Uses the exact image tag `postgres:18.6`.
   - Does not declare the obsolete top-level Compose `version` field.
   - Requires `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` through Compose interpolation with clear missing-value errors.
   - Publishes container port `5432` on host port `${POSTGRES_PORT:-5432}`.
   - Mounts the named volume `postgres_data` at `/var/lib/postgresql`.
   - Declares `postgres_data` as a top-level named volume.
   - Defines a health check that runs `pg_isready` inside the container using the container's `POSTGRES_USER` and `POSTGRES_DB` environment variables.
   - Uses these bounded health-check values:
     - interval: `5s`
     - timeout: `5s`
     - retries: `10`
     - start period: `10s`

2. Create a root `.env.example` with these safe development defaults:

   ```dotenv
   POSTGRES_DB=nexuscrm_dev
   POSTGRES_USER=nexuscrm
   POSTGRES_PASSWORD=
   POSTGRES_PORT=5432
   ```

   The password must remain blank in the committed example. The file must instruct developers to copy it to `.env` and set a non-empty local password before validating or starting Compose.

3. Update the root `.gitignore` narrowly so that:
   - `.env` is ignored.
   - `.env.*` files are ignored.
   - `.env.example` is explicitly retained with `!.env.example`.
   - Existing ignore rules, including `/backend/target/`, are preserved.

4. Document the local workflow for:
   - Creating `.env` from `.env.example`.
   - Starting PostgreSQL and waiting for it to become healthy.
   - Stopping, starting, restarting, and removing the container without removing its data volume.
   - Inspecting service status and logs.
   - Opening an interactive `psql` session.
   - Verifying the PostgreSQL version, health, database name, connectivity, volume mount, and persistence.

5. Keep all database credentials environment-based. Do not commit a populated `.env`, password, connection secret, or other local secret file.

## Constraints

- Do not add Spring Data JPA, Hibernate integration, or any other backend dependency.
- Do not configure a Spring Boot datasource or modify backend application configuration.
- Do not add Flyway, migrations, application tables, indexes, or seed data.
- Do not add Redis, RabbitMQ, or other infrastructure services.
- Do not add controllers, public APIs, business functionality, or domain types.
- Do not modify frontend files.
- Use only the `postgres` service defined by this task.
- An image digest is not required; the exact `postgres:18.6` tag is the approved pin.
- Docker Compose secrets are out of scope. The ignored local `.env` file is the approved development-secret mechanism for this task.
- `docker compose down --volumes` is destructive because it removes the persistent database volume. It must be documented as a reset operation and must not be used for normal shutdown or task verification.

## Expected Result

A developer can copy `.env.example` to an ignored `.env`, supply a local password, and start a healthy PostgreSQL 18.6 container with a `nexuscrm_dev` database owned by `nexuscrm`. Database files survive normal container removal and recreation through the `postgres_data` named volume. No application integration, schema, or business functionality is introduced.

## Acceptance Criteria

- [ ] Root `docker-compose.yml` is valid and defines only the `postgres` service required by this task.
- [ ] The service uses the exact official image tag `postgres:18.6`.
- [ ] The configured database is `nexuscrm_dev` and the configured user is `nexuscrm`.
- [ ] The host port defaults to `5432` and can be overridden with `POSTGRES_PORT`.
- [ ] `POSTGRES_DB`, `POSTGRES_USER`, and `POSTGRES_PASSWORD` are supplied through required Compose interpolation.
- [ ] The committed `.env.example` contains no password or other secret.
- [ ] Local `.env` and `.env.*` files are ignored while `.env.example` remains trackable.
- [ ] PostgreSQL reaches the healthy state using the bounded `pg_isready` health check.
- [ ] PostgreSQL accepts a `psql` connection and `current_database()` returns `nexuscrm_dev`.
- [ ] The `postgres_data` named volume is mounted at `/var/lib/postgresql`.
- [ ] Verification metadata survives `docker compose down` followed by container recreation and is removed afterward.
- [ ] Normal shutdown preserves the named volume.
- [ ] Start, stop, restart, status, logs, interactive access, validation, and verification commands are documented.
- [ ] The destructive effect of `docker compose down --volumes` is clearly documented.
- [ ] Existing backend compilation and tests still pass with Java 21 and the Maven Wrapper.
- [ ] No backend source, backend configuration, frontend, schema, seed data, or business functionality is changed.

## Verification

### Prerequisites and local environment

1. Confirm that Docker Engine is running and inspect the installed tools:

   ```text
   docker version
   docker compose version
   ```

2. From Git Bash, copy the example environment file, then edit `.env` and set a non-empty `POSTGRES_PASSWORD`:

   ```bash
   cp .env.example .env
   ```

### Compose validation and startup

Run from the repository root:

```text
docker compose config --quiet
docker compose pull postgres
docker compose up -d --wait postgres
docker compose ps
docker compose logs postgres
docker compose exec -T postgres postgres --version
```

`docker compose config --quiet` must exit successfully, `docker compose up` must wait successfully, and `docker compose ps` must report `postgres` as healthy. The version command must report PostgreSQL 18.6.

### Health and connectivity

```bash
docker compose exec -T postgres sh -c 'pg_isready --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"'
docker compose exec -T postgres sh -c 'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --tuples-only --no-align --command "SELECT current_database();"'
```

`pg_isready` must report that PostgreSQL is accepting connections. The query output must be exactly `nexuscrm_dev` after whitespace is trimmed.

### Volume placement

Inspect the Compose-managed container mounts:

```text
docker inspect --format "{{range .Mounts}}{{println .Name .Destination}}{{end}}" $(docker compose ps -q postgres)
```

The output must show a named volume whose destination is `/var/lib/postgresql`.

### Container-recreation persistence

Use database-level comment metadata so persistence can be proven without creating an application table or seed data. Connection credentials come from the container environment; the fixed `nexuscrm_dev` SQL identifier is used because PostgreSQL identifiers cannot be supplied as ordinary query parameters without making this verification unnecessarily complex.

```bash
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --set ON_ERROR_STOP=1' <<'SQL'
COMMENT ON DATABASE nexuscrm_dev IS 'TASK-0003 persistence probe';
SQL

POSTGRES_CONTAINER="$(docker compose ps -q postgres)"
test -n "$POSTGRES_CONTAINER"

POSTGRES_VOLUME="$(docker inspect \
  --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql"}}{{.Name}}{{end}}{{end}}' \
  "$POSTGRES_CONTAINER")"
test -n "$POSTGRES_VOLUME"
docker volume inspect "$POSTGRES_VOLUME" >/dev/null

docker compose down
docker volume inspect "$POSTGRES_VOLUME" >/dev/null
docker compose up -d --wait postgres

PERSISTENCE_COMMENT="$(docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --tuples-only --no-align' <<'SQL'
SELECT shobj_description(oid, 'pg_database')
FROM pg_database
WHERE datname = 'nexuscrm_dev';
SQL
)"

test "$PERSISTENCE_COMMENT" = "TASK-0003 persistence probe"
```

The query must return `TASK-0003 persistence probe`. Remove the verification metadata immediately afterward:

```bash
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --set ON_ERROR_STOP=1' <<'SQL'
COMMENT ON DATABASE nexuscrm_dev IS NULL;
SQL
```

### Operating commands

Document and exercise commands as applicable:

```text
docker compose stop postgres
docker compose start postgres
docker compose restart postgres
docker compose ps
docker compose logs -f postgres
docker compose exec postgres psql --username nexuscrm --dbname nexuscrm_dev
docker compose down
```

`docker compose down` is the normal way to remove the container and network while retaining `postgres_data`. `docker compose down --volumes` is a destructive local reset command and is not part of normal shutdown or this task's verification.

### Secret handling

With a local `.env` present, run:

```text
git check-ignore -v .env
git ls-files --error-unmatch .env
git status --short --untracked-files=all
```

`git check-ignore` must identify the applicable ignore rule. `git ls-files --error-unmatch .env` must fail because `.env` is not tracked, and Git status must not list `.env`.

### Existing backend regression verification

Confirm `java -version` reports Java 21, then run the Maven Wrapper from Git Bash:

```bash
cd backend
./mvnw clean verify
cd ..
```

The backend must compile, its tests must pass, and its executable JAR must still be packaged without relying on PostgreSQL.

### Final review

```text
git diff --check
git status --short --untracked-files=all
git diff
```

Review the complete diff and confirm it contains only the approved Compose configuration, safe environment example, narrowly scoped ignore rules, and required documentation. Confirm no backend, frontend, database schema, seed data, or application code changed.

## Learning Objectives

- Understand how Docker Compose defines and operates a stateful local service.
- Understand the difference between image pinning, container lifecycle, and named-volume lifecycle.
- Understand how the official PostgreSQL image initializes a database from environment variables.
- Understand why readiness health checks are different from merely having a running container process.
- Understand how Compose interpolation, local environment files, and Git ignore rules keep development secrets out of version control.
- Understand how to prove database connectivity and persistence without prematurely introducing application schema.
- Be able to explain common failure modes: a stopped Docker daemon, occupied host port, missing or empty environment values, incorrect volume paths, failed health checks, and accidental volume deletion.

## Definition of Done

- All acceptance criteria are satisfied.
- All verification commands have been executed successfully, with expected failure only for the intentional `git ls-files --error-unmatch .env` assertion.
- PostgreSQL starts, becomes healthy, accepts connections, and retains the verification comment across normal container removal and recreation.
- The temporary database comment has been removed after verification.
- Existing backend verification passes with Java 21.
- No local secret is tracked by Git.
- The final diff contains no out-of-scope backend, frontend, schema, seed-data, messaging, or business changes.
- The implementation and its operational commands can be explained by the developer.
- The task document's Completion section is updated with the final implementation summary and verification evidence.
- The task document is moved from `planning/tasks/active/` to `planning/tasks/completed/` only after every requirement above is met.

## Completion

Status: Completed

Implemented:

- Added a root Docker Compose service pinned to PostgreSQL 18.6.
- Configured the PostgreSQL 18+ storage layout with the `postgres_data`
  named volume mounted at `/var/lib/postgresql`.
- Added environment-driven database, user, password, and host-port
  configuration.
- Added a safe `.env.example` and Git ignore rules protecting local
  environment files while retaining the example.
- Added a bounded `pg_isready` health check using container-side
  environment variables.
- Documented Git Bash commands for PostgreSQL lifecycle, inspection,
  connectivity, persistence, and secret verification.

Verification:

- Docker Engine 29.6.2 and Docker Compose 5.3.1 verified.
- `docker compose config --quiet` passed.
- The official `postgres:18.6` image was pulled successfully.
- PostgreSQL 18.6 started and reached healthy status.
- `pg_isready` reported that PostgreSQL accepts connections.
- `current_database()` returned `nexuscrm_dev`.
- The named volume was verified at `/var/lib/postgresql`.
- The temporary database comment survived `docker compose down` and
  container recreation, proving named-volume persistence.
- The temporary database comment was removed and verified absent.
- Normal final shutdown preserved the named volume.
- Maven Wrapper 3.9.16 ran with Java 21.0.12.1.
- `./mvnw clean verify` passed with 1 test and no failures, errors, or
  skipped tests.
- The executable backend JAR was packaged successfully.
- `.env` and `.env.*` were verified ignored and untracked, while
  `.env.example` remained available for tracking.
- `git diff --check` passed.
- No backend, frontend, application configuration, dependency, schema,
  migration, seed-data, messaging, or business changes were introduced.

Notes:

- Verification used Git Bash as the primary development shell.
- The generated local `.env` remains ignored and untracked.
- The PostgreSQL container and Compose network were removed after
  verification; the `nexus-crm_postgres_data` volume remains for normal
  development persistence.
- `docker compose down --volumes` was not executed.
- The existing non-blocking Mockito dynamic-agent warning remains
  unchanged from TASK-0002.

