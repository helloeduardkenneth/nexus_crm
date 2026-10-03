# TASK-0004 — Flyway Database Migrations

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Introduce Flyway as the authoritative database schema migration mechanism
for the NexusCRM backend and prove that versioned migrations execute
successfully against the PostgreSQL 18.6 development environment established
in TASK-0003.

## Context

TASK-0002 established a Java 21 Spring Boot backend, and TASK-0003 established
a persistent PostgreSQL development service. The backend does not yet have a
JDBC connection, datasource configuration, or schema migration mechanism.

This task connects those foundations through Spring Boot's Flyway
auto-configuration. It establishes a minimal application schema namespace and
a repeatable migration workflow before any CRM domain tables or persistence
models are introduced.

Flyway must be the only component permitted to initialize or change the
database schema. Spring Data JPA and Hibernate are intentionally excluded from
this task, so they cannot create, update, or validate schema objects yet.

## Requirements

1. Update `backend/pom.xml` with only the dependencies required for Flyway
   migrations against PostgreSQL:
   - `org.springframework.boot:spring-boot-starter-flyway`
   - `org.flywaydb:flyway-database-postgresql`
   - `org.postgresql:postgresql` with runtime scope
2. Use Spring Boot 4.1.1 dependency management. Do not declare explicit
   Flyway or PostgreSQL JDBC driver versions.
3. Do not add a separate `spring-boot-starter-jdbc` dependency because
   `spring-boot-starter-flyway` already provides the required JDBC support.
4. Do not add the Flyway Maven plugin. Migrations must run through Spring
   Boot's Flyway auto-configuration during application startup.
5. Configure the primary datasource in
   `backend/src/main/resources/application.yml` with:
   - URL:
     `jdbc:postgresql://${POSTGRES_HOST:localhost}:${POSTGRES_PORT:5432}/${POSTGRES_DB:nexuscrm_dev}`
   - username: `${POSTGRES_USER:nexuscrm}`
   - password: `${POSTGRES_PASSWORD}` with no default value
6. Treat `POSTGRES_HOST` as an optional backend connection override whose
   default is `localhost`. Do not add it to `.env.example` merely to represent
   that default, and do not otherwise modify `.env.example` in this task.
7. Configure Flyway in `application.yml` to:
   - be enabled;
   - load migrations from `classpath:db/migration`;
   - use `public` as its default schema, placing the history table at
     `public.flyway_schema_history`;
   - validate migrations when migrating;
   - keep baseline-on-migrate disabled;
   - keep Flyway clean disabled.
8. Disable Spring's generic SQL initialization with
   `spring.sql.init.mode: never` so Flyway is the only schema initialization
   mechanism.
9. Create exactly one versioned migration:
   `backend/src/main/resources/db/migration/V1__create_nexuscrm_schema.sql`.
10. The V1 migration must contain only:

    ```sql
    CREATE SCHEMA nexuscrm;
    ```

    Do not use `IF NOT EXISTS`; an unexpected pre-existing schema must fail
    migration rather than hide unmanaged database state.
11. Keep the existing `NexusCrmApplicationTests` as an
    infrastructure-independent application smoke/regression test. If needed,
    exclude these auto-configurations only for that test:
    - `org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration`
    - `org.springframework.boot.flyway.autoconfigure.FlywayAutoConfiguration`
12. The smoke test proves only that the non-database Spring application
    context loads. It must not be cited as evidence for datasource binding,
    PostgreSQL connectivity, Flyway discovery, or migration execution.
13. Verify actual datasource and Flyway behavior by starting the packaged
    application with normal `DataSourceAutoConfiguration` and
    `FlywayAutoConfiguration` active against:
    - a clean disposable database named `nexuscrm_migration_test`;
    - the persistent `nexuscrm_dev` database.
14. Verify that re-running the application does not reapply the completed V1
    migration.
15. Document Git Bash as the authoritative local verification shell.

## Constraints

- Do not add Spring Data JPA or Hibernate.
- Do not add entities, repositories, persistence services, transaction
  workflows, or business-domain code.
- Do not configure `spring.jpa.*` or any Hibernate `ddl-auto` property.
- Do not add `schema.sql`, `data.sql`, repeatable migrations, Java migrations,
  callbacks, or business seed/demo data.
- Do not create business tables, indexes, sequences, constraints, or domain
  schemas beyond the approved `nexuscrm` namespace.
- Do not add Testcontainers. Automated PostgreSQL integration-test
  infrastructure remains TASK-0008 scope.
- Do not add authentication, authorization, users, roles, permissions, REST
  endpoints, Redis, RabbitMQ, or frontend changes.
- Do not modify `docker-compose.yml` or replace PostgreSQL 18.6.
- Do not modify `.env.example`.
- Do not delete, reset, or recreate the TASK-0003 `postgres_data` volume.
- Never execute `docker compose down --volumes`.
- Do not begin TASK-0005 or later functionality.
- Do not commit a password, populated `.env`, JDBC URL containing credentials,
  or other secret.

## Expected Result

The backend has environment-driven PostgreSQL connectivity and automatically
runs one Flyway migration during normal application startup. A clean database
receives `public.flyway_schema_history` and the empty `nexuscrm` application
schema. Repeated startup validates the migration without applying it again.

The ordinary Maven smoke/regression test remains independent of Docker, while
the explicit local integration workflow proves the real datasource and Flyway
configuration against PostgreSQL 18.6. No business-domain persistence or JPA
infrastructure exists yet.

## Acceptance Criteria

- [ ] `spring-boot-starter-flyway`, `flyway-database-postgresql`, and the
      runtime-scoped PostgreSQL JDBC driver are present.
- [ ] Spring Boot manages the Flyway and PostgreSQL JDBC dependency versions.
- [ ] No redundant JDBC starter, Flyway Maven plugin, Spring Data JPA, or
      Hibernate dependency is present.
- [ ] Datasource URL, username, and password are environment-driven.
- [ ] `POSTGRES_HOST` is optional and defaults to `localhost` without being
      added to `.env.example`.
- [ ] No password or other database secret is committed.
- [ ] Flyway is enabled, reads `classpath:db/migration`, validates on migrate,
      refuses implicit baselining, and has destructive clean disabled.
- [ ] Spring generic SQL initialization is disabled.
- [ ] Exactly one versioned migration exists.
- [ ] V1 contains only `CREATE SCHEMA nexuscrm;` and introduces no business
      table or seed data.
- [ ] The infrastructure-independent context-load test passes without Docker
      and is not treated as datasource or Flyway evidence.
- [ ] The packaged application starts against a clean disposable PostgreSQL
      database with normal datasource and Flyway auto-configuration active.
- [ ] The clean database contains the `nexuscrm` schema.
- [ ] `public.flyway_schema_history` records exactly one successful version-1
      SQL migration.
- [ ] A second startup against the disposable database does not add or reapply
      version 1.
- [ ] The disposable verification database is removed after verification.
- [ ] The packaged application connects to and migrates `nexuscrm_dev` using
      the TASK-0003 environment configuration.
- [ ] Repeated startup against `nexuscrm_dev` is idempotent.
- [ ] JPA and Hibernate are absent and cannot silently create or mutate the
      schema.
- [ ] The TASK-0003 named volume remains intact.
- [ ] Existing backend compilation, testing, and executable JAR packaging
      succeed.
- [ ] No business-domain, API, frontend, messaging, Testcontainers, or
      TASK-0005/later functionality is introduced.

## Verification

Use Git Bash as the authoritative shell. Do not expose the password from the
local `.env` in logs or task-completion notes.

### 1. Baseline and isolated backend regression

From the repository root:

```bash
git status --short --branch --untracked-files=all
java -version

cd backend
./mvnw --version
env -u POSTGRES_HOST \
    -u POSTGRES_PORT \
    -u POSTGRES_DB \
    -u POSTGRES_USER \
    -u POSTGRES_PASSWORD \
    ./mvnw clean verify
cd ..
```

Confirm Java 21, Maven 3.9.16, successful compilation, the isolated context
smoke test, and executable JAR packaging. This result does not prove database
or Flyway behavior.

### 2. Dependency and schema-authority inspection

```bash
cd backend
./mvnw dependency:tree
cd ..

rg -n "ddl-auto|spring\\.jpa|spring-data-jpa|hibernate|schema\\.sql|data\\.sql" backend
```

Confirm the approved Flyway and PostgreSQL dependencies are present. Confirm
that JPA, Hibernate, alternative SQL initializers, and automatic schema
generation configuration are absent.

### 3. PostgreSQL startup and environment

```bash
docker version
docker compose version
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps

set -a
source .env
set +a
```

Confirm the service uses PostgreSQL 18.6 and reports healthy. The existing
ignored `.env` supplies the database name, user, password, and host port.
`POSTGRES_HOST` may be exported separately only when the backend must connect
through a host other than `localhost`.

### 4. Clean disposable-database migration

Create only the fixed disposable database. The hardcoded owner is acceptable
because TASK-0003 establishes `nexuscrm` as the development role and SQL
identifiers cannot be supplied as ordinary query parameters.

```bash
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname postgres --no-psqlrc --set ON_ERROR_STOP=1' <<'SQL'
DROP DATABASE IF EXISTS nexuscrm_migration_test WITH (FORCE);
CREATE DATABASE nexuscrm_migration_test OWNER nexuscrm;
SQL
```

Build the executable JAR:

```bash
cd backend
./mvnw clean package
cd ..
```

Start the packaged application in a controlled background process with:

```bash
POSTGRES_DB=nexuscrm_migration_test \
  java -jar backend/target/nexus-crm-backend-0.0.1-SNAPSHOT.jar \
  --server.port=0
```

Capture its logs, wait up to 60 seconds for
`Started NexusCrmApplication`, fail if the process exits early, and stop it
cleanly after startup. Do not exclude datasource or Flyway auto-configuration
from this run.

Query `nexuscrm_migration_test` through `psql` and assert:

```sql
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'nexuscrm';

SELECT installed_rank, version, description, type, success
FROM public.flyway_schema_history
WHERE version = '1';

SELECT count(*)
FROM information_schema.tables
WHERE table_schema = 'nexuscrm';
```

Expected results:

- schema `nexuscrm` exists;
- exactly one version-1 history row exists;
- its description is `create nexuscrm schema`;
- its type is `SQL` and `success` is true;
- the `nexuscrm` schema contains zero tables.

Start and stop the packaged application a second time against the same
database. Require Flyway to report that the schema is current and confirm the
version-1 history count remains exactly one.

Remove only the disposable database after successful verification:

```bash
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname postgres --no-psqlrc --set ON_ERROR_STOP=1' <<'SQL'
DROP DATABASE nexuscrm_migration_test WITH (FORCE);
SQL
```

If verification fails after the temporary database is created, preserve the
TASK-0003 volume and `nexuscrm_dev`; report the failure and remove only the
fixed disposable database when cleanup is safe.

### 5. Persistent development-database migration

With the root `.env` still exported, start the packaged application without
overriding `POSTGRES_DB`:

```bash
java -jar backend/target/nexus-crm-backend-0.0.1-SNAPSHOT.jar \
  --server.port=0
```

Use the same controlled startup, log wait, and clean termination procedure.
Normal datasource and Flyway auto-configuration must remain active.

Query `nexuscrm_dev` and assert the same schema, history, success, and
zero-business-table results. Start the application a second time, require the
schema to be current, and confirm version 1 still has exactly one history row.

Do not remove `nexuscrm_dev`, its migrated schema, its Flyway history, or the
named volume. A normal `docker compose down` may be used after verification;
`docker compose down --volumes` must never be used.

### 6. Final regression and scope review

```bash
cd backend
env -u POSTGRES_HOST \
    -u POSTGRES_PORT \
    -u POSTGRES_DB \
    -u POSTGRES_USER \
    -u POSTGRES_PASSWORD \
    ./mvnw clean verify
cd ..

git check-ignore -v .env
git ls-files --error-unmatch .env
git diff --check
git status --short --branch --untracked-files=all
git diff
```

The `git ls-files --error-unmatch .env` command must fail because `.env` is
not tracked. Review the complete diff and confirm that it contains only the
approved backend Flyway/JDBC integration, datasource/Flyway configuration,
V1 migration, narrowly adjusted smoke test, and task-completion documentation.

## Learning Objectives

- Understand why versioned migrations are authoritative database history.
- Understand how Spring Boot discovers and runs Flyway during application
  startup.
- Understand the roles of the JDBC driver, datasource, Flyway core, and the
  PostgreSQL-specific Flyway module.
- Understand environment-based datasource configuration without committing
  credentials.
- Understand why Flyway history belongs outside application business tables.
- Understand why versioned migrations must be immutable after application.
- Understand how migration idempotence differs from making DDL silently
  conditional with `IF NOT EXISTS`.
- Understand why JPA schema generation and generic SQL initialization must not
  compete with Flyway.
- Understand the distinction between an infrastructure-independent context
  smoke test and real PostgreSQL integration verification.
- Understand how a disposable database proves clean migration behavior without
  destroying a developer's persistent volume.
- Be able to explain common failure modes: missing credentials, unavailable
  PostgreSQL, checksum mismatch, pre-existing unmanaged schema, failed
  migration, incorrect Flyway module, and accidental destructive cleanup.

## Definition of Done

1. All acceptance criteria are satisfied.
2. Required verification succeeds against both the disposable database and
   `nexuscrm_dev`.
3. The temporary database is removed and the TASK-0003 volume remains intact.
4. Backend compilation, smoke testing, packaging, and real application startup
   succeed.
5. Flyway is the only schema-management mechanism and no JPA/Hibernate schema
   generation exists.
6. Changes remain within TASK-0004 scope.
7. Git diff has been reviewed and contains no local secret or unrelated change.
8. The `## Completion` section accurately reflects the final result.
9. The task file is moved from `planning/tasks/active/` to
   `planning/tasks/completed/`.
10. The corresponding Phase 00 task entry is marked `— ✅ Completed` without
    marking the overall phase complete.

## Completion

Status: Completed

Implemented:

- Added Spring Boot Flyway integration, the PostgreSQL-specific Flyway
  module, and the runtime PostgreSQL JDBC driver with versions managed by
  Spring Boot 4.1.1.
- Added environment-driven datasource configuration with an optional
  `POSTGRES_HOST` override and no committed password default.
- Configured Flyway as the schema authority with migration validation,
  implicit baselining disabled, destructive clean disabled, and history in
  the `public` schema.
- Disabled generic Spring SQL initialization.
- Added `V1__create_nexuscrm_schema.sql`, which creates only the empty
  `nexuscrm` schema.
- Kept the context-load test infrastructure-independent by excluding
  datasource and Flyway auto-configuration for that smoke test only.

Verification:

- Java 21.0.12.1 and Maven Wrapper 3.9.16 were verified.
- `./mvnw clean verify` passed with 1 test and no failures, errors, or
  skipped tests, and packaged the executable JAR.
- PostgreSQL 18.6 started healthy through Docker Compose.
- The packaged application connected to a clean disposable
  `nexuscrm_migration_test` database with normal datasource and Flyway
  auto-configuration active.
- The disposable database contained the `nexuscrm` schema, exactly one
  successful version-1 SQL migration in `public.flyway_schema_history`, and
  zero tables in the application schema.
- A second disposable-database startup succeeded with an unchanged Flyway
  history fingerprint; the disposable database was then removed.
- The packaged application migrated `nexuscrm_dev`, and a second startup
  succeeded with an unchanged Flyway history fingerprint.
- Dependency and source inspection confirmed that JPA, Hibernate,
  `ddl-auto`, Liquibase, alternative SQL initializers, Testcontainers, and
  business persistence code remain absent.
- `.env` was verified ignored and untracked, and `git diff --check` passed.
- Normal Compose shutdown preserved the named volume discovered from the
  live `/var/lib/postgresql` mount.

Notes:

- Git Bash was used as the authoritative verification shell.
- The ignored `.env` file was read as literal `KEY=value` data and was not
  sourced or printed; `POSTGRES_HOST` was set deterministically to
  `localhost` for local verification.
- `.env.example` and `docker-compose.yml` were not modified.
- The PostgreSQL container and Compose network were removed after
  verification; the discovered named volume remains intact.
- `docker compose down --volumes` was not executed.
- The existing non-blocking Mockito dynamic-agent warning remains unchanged.
