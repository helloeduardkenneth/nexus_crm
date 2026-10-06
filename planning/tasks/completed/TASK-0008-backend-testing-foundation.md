# TASK-0008 — Backend Testing Foundation

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Establish a repeatable backend testing foundation that separates isolated
tests from real PostgreSQL integration tests and proves the existing Spring
Boot datasource and Flyway configuration without touching development data.

## Context

TASK-0002 established Java 21, Spring Boot 4.1.1 and Maven Wrapper 3.9.16.
TASK-0003 established PostgreSQL 18.6 with a persistent development volume.
TASK-0004 introduced datasource/Flyway auto-configuration and V1, which creates
only the empty `nexuscrm` schema. Its existing context smoke test deliberately
excludes datasource/Flyway auto-configuration and is not database evidence.
TASK-0007 completed frontend testing; this task is backend-only.

Spring Boot already manages JUnit Jupiter 6.0.3 and Mockito 5.23.0. The developer
explicitly approved retaining Boot-managed JUnit rather than overriding it to
match older JUnit 5 wording. No accepted ADR changes the modular monolith.

## Requirements

1. Retain Java 21, Boot 4.1.1 and Maven 3.9.16. Use Boot-managed JUnit/Mockito
   from the existing test starter; do not add redundant declarations or version
   overrides. Add only test-scoped `spring-boot-testcontainers` and
   `org.testcontainers:testcontainers-postgresql`, with versions managed by
   Boot (Testcontainers 2.0.5).
2. Establish Surefire isolated-test naming (`*Test`/`*Tests`) and Failsafe
   integration naming (`*IT`), with Failsafe `integration-test` and `verify`
   goals bound to Maven's lifecycle and its version managed by Boot.
3. Preserve the existing infrastructure-independent context smoke test.
   Add a meaningful isolated JUnit/Mockito test of the existing application
   bootstrap delegation, without starting Spring or Docker and without adding
   artificial business classes solely to demonstrate mocking.
4. Add a Spring Boot integration test using a fresh Testcontainers PostgreSQL
   `postgres:18.6` instance with dynamically mapped ports and container-owned
   credentials. Use normal datasource and Flyway auto-configuration, the
   production application configuration and existing production V1 migration.
   Test-only connection details must override development connection settings.
5. Verify real JDBC connectivity and PostgreSQL version, the `nexuscrm` schema,
   `public.flyway_schema_history`, exactly one successful V1 SQL migration with
   description `create nexuscrm schema`, and zero application tables.
6. Reinvoke the real Flyway migration operation against the same disposable
   database. Assert zero migrations executed and an unchanged complete history
   fingerprint, including rank, version, description, type, script, checksum,
   installer, installation timestamp, execution time and success. Do not use
   exact Flyway log text as a pass/fail condition.
7. Keep `./mvnw test` independent of Docker and `POSTGRES_*` credentials.
   `./mvnw clean verify` must execute both isolated and PostgreSQL integration
   tests and package the executable JAR. Missing Docker must fail integration
   verification visibly, not produce a skipped or silently successful build.
8. Use bounded PostgreSQL startup waits and framework-owned container/context
   cleanup. Do not enable reusable containers or disable the resource reaper.
   Repeated clean verification must start with a fresh database and leave no
   task-owned containers behind.
9. Record test commands, naming, prerequisites and the distinction between
   smoke/unit/integration evidence here. General developer onboarding remains
   TASK-0009; no README or general documentation expansion is required.
10. Apply only the approved JUnit wording correction in root/backend
    `AGENTS.md`, the backend implementation skill and Phase 00's testing
    references. Preserve their testing intent and all unrelated wording.

## Constraints

- Do not change production Java, `application.yml`, V1, Maven Wrapper,
  `docker-compose.yml`, `.env`, `.env.example`, frontend or prior task records.
- Do not add JPA/Hibernate, H2, business classes/tables, REST endpoints,
  authentication, messaging, new migrations, test SQL initializers or fixtures.
- Never connect integration tests to `nexuscrm_dev`, use fixed host ports,
  attach the Compose named volume, source `.env`, or print local secrets.
- Never reset/delete development databases or volumes, run broad Docker prune,
  or execute `docker compose down --volumes`. Inspect resources read-only;
  cleanup must target only containers/resources owned by the test lifecycle.
- Do not disable failing tests, use Docker-unavailable skip settings, add
  opt-in integration profiles, or use mocks as PostgreSQL/Flyway evidence.
- Do not add CI/review workflows, coverage thresholds or unrelated tooling.
- Do not begin TASK-0009 or later work. The developer initially restricted
  Git publication, then explicitly authorized review, scoped commits, push and
  PR creation after local completion. Never merge the PR.

## Expected Result

Fast isolated tests run without development infrastructure or credentials.
Full verification also starts disposable PostgreSQL 18.6, migrates it through
normal Spring Boot configuration, verifies real database state and migration
idempotence, then cleans up the owned container. Development data is unchanged.

## Acceptance Criteria

- [x] JUnit/Mockito remain Boot-managed; necessary new dependencies are test-only.
- [x] `./mvnw test` runs the smoke test and isolated Mockito bootstrap test,
      without Docker access or database credentials.
- [x] Surefire does not execute `*IT`; Failsafe executes it during `verify`.
- [x] Normal datasource/Flyway auto-configuration connects to disposable
      PostgreSQL 18.6, not the Compose development database.
- [x] Real database assertions prove connectivity, version, schema, history,
      exactly one successful expected V1 and zero application tables.
- [x] A second migration executes zero migrations and leaves history unchanged.
- [x] Two consecutive clean full-verification runs pass with no skipped tests
      and each uses fresh PostgreSQL data.
- [x] Docker is confirmed reachable before integration verification; required
      integration tests have no Docker-unavailable skip or opt-in bypass.
- [x] Test-owned containers are removed; pre-existing containers and named
      volumes remain unchanged.
- [x] Compilation and executable JAR packaging pass on Java 21/Maven 3.9.16.
- [x] Production configuration, migrations, Compose, environment files,
      frontend and previous task records remain unchanged.
- [x] The approved conflicting JUnit wording is corrected without unrelated
      documentation changes; no secret or generated output appears in Git.
- [x] Independent code review approves and QA returns PASS.

## Verification

Use Git Bash and the Maven Wrapper. Do not load or print `.env`.

### Prerequisites and baseline

```bash
git status --short --branch --untracked-files=all
java -version
docker version
docker ps -a --format '{{.ID}} {{.Names}} {{.Image}}'
docker volume ls --format '{{.Name}}'
cd backend
./mvnw --version
./mvnw dependency:tree
```

Require Java 21, Maven 3.9.16 and a reachable Docker Engine. Snapshot existing
container/volume identities and protected-file checksums for comparison. An
unavailable prerequisite blocks implementation; do not install global tooling
or change runtime versions as recovery.

### Isolated and full testing

```bash
env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
    -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw clean test
env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
    -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw clean verify
env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
    -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw clean verify
./mvnw dependency:tree
```

Inspect Surefire/Failsafe XML reports separately: nonzero expected test counts,
zero failures/errors/skips, isolated test names only in Surefire and real
PostgreSQL integration tests only in Failsafe. Confirm the packaged JAR exists.
Integration assertions must check the actual JDBC URL/database identity,
`SHOW server_version`, schema/history existence, V1 metadata and total history
count, zero tables in `nexuscrm`, and the unchanged history fingerprint after
the second real migration. Restore normal environment after negative checks.

### Docker prerequisite and failure handling

Inspect the integration test/build configuration for disabled tests,
Docker-unavailable skip settings and opt-in profiles; none may bypass the
required integration gate. Require actual successful PostgreSQL execution and
zero skips in Failsafe reports. If Docker, image access, startup or a migration
fails, report the exact command and failure, keep the task incomplete, and
allow the framework to clean up only its owned resources.

Do not stop Docker Desktop, kill unrelated containers or assume an invalid
`DOCKER_HOST` forces failure: Testcontainers can discover another provider,
including Windows named pipes. This task does not require a simulated Docker
outage. No unavailable-Docker run may be reported as successful integration.

### Cleanup, secret and scope review

```bash
cd ..
docker ps -a --format '{{.ID}} {{.Names}} {{.Image}}'
docker volume ls --format '{{.Name}}'
git check-ignore -v .env backend/target
git ls-files --error-unmatch .env
git diff --check
git status --short --branch --untracked-files=all
git diff
```

`git ls-files --error-unmatch .env` must fail because it is untracked. Compare
container/volume snapshots and protected-file checksums; inspect new files as
well as tracked diffs. Dependency/source inspection must confirm no JPA,
Hibernate, H2, alternate schema initializer, business code or runtime
Testcontainers dependency. Request independent review and QA before completion.

## Architecture / Approval Notes

- Developer approved retaining Boot-managed JUnit (currently 6.0.3), with no
  JUnit 5 override, and the narrow governing-document wording correction.
- Prefer a test-only Spring-managed PostgreSQL container bean and service
  connection so datasource/Flyway use the same container and its lifecycle
  outlives dependent beans. Close the context after the integration class with
  `@DirtiesContext(AFTER_CLASS)`. No general container base class is needed.
- Activate Boot's managed Failsafe execution without duplicating its lifecycle
  bindings. Inspect the effective build and separate reports. If Mockito needs
  a Java 21 startup agent, resolve its managed JAR through Maven and quote the
  path in both runners; do not pin another Mockito version.
- Surefire/Failsafe separation and Boot-managed test dependencies are reversible
  Yellow decisions within the phase's approved testing stack.
- Mockito proves isolated bootstrap delegation only; smoke context loading is
  distinct from real PostgreSQL integration. No invented business fixture is
  necessary. Production behavior and migration ownership remain unchanged.
- Docker Engine and required image/dependency access are prerequisites, not
  grounds for skipping the integration gate. No remaining human decision is
  identified, subject to independent planning/architecture review.

## Learning Objectives

- Distinguish isolated unit tests, infrastructure-independent Spring smoke
  tests and real database integration tests; understand what each cannot prove.
- Use Mockito at an actual isolation boundary rather than mocking PostgreSQL.
- Understand Surefire/Failsafe naming and Maven `test` versus `verify` phases.
- Understand Boot-managed versions and test-scoped dependencies.
- Understand Testcontainers lifecycle, dynamic ports and connection overrides.
- Prove Flyway startup effects and idempotence from database state rather than
  log wording, while protecting persistent development data.
- Diagnose unavailable Docker, image pull failures and undiscovered/skipped
  tests without weakening verification.

## Definition of Done

1. All acceptance criteria and required verification pass.
2. Independent review approves with no unresolved P0/P1; QA returns PASS.
3. Production and development database state remain unchanged.
4. The complete diff and new files are reviewed for scope/secrets/artifacts.
5. Completion records actual implementation, checks, review and QA evidence.
6. Move this specification to `planning/tasks/completed/` and mark only
   TASK-0008 `— ✅ Completed` in Phase 00; leave the overall phase incomplete.
7. Honor the developer's current Git/PR authorization; never merge or begin
   TASK-0009.

## Completion

Status: Completed

Implemented:

- Added only test-scoped `spring-boot-testcontainers` and
  `testcontainers-postgresql`. Spring Boot 4.1.1 manages JUnit Jupiter 6.0.3,
  Mockito 5.23.0 and Testcontainers 2.0.5; no version override was introduced.
- Activated managed Surefire/Failsafe 3.5.6, with Failsafe's inherited
  `integration-test`/`verify` execution. Both runners reject empty test suites
  and use Maven's resolved Mockito JAR as a quoted Java startup agent.
- Added `ApplicationBootstrapTests`: scoped static Mockito tests verify main
  argument forwarding and propagation of the same startup exception.
- Added `PostgreSqlMigrationIT`: a Spring-managed PostgreSQL 18.6 container,
  service connection, dynamic ports, generated credentials, 60-second startup
  bound, disabled reuse and context cleanup after the class. Normal production
  datasource/Flyway configuration and V1 are used without exclusions.
- Added actual JDBC/schema/history assertions and real Flyway idempotence
  verification, comparing all ten migration-history fields.
- Corrected only the directly conflicting JUnit wording in root/backend
  instructions, the backend implementation skill and Phase 00. The existing
  infrastructure-independent smoke test remains unchanged.

Verification:

Executed on 2026-10-06 using Git Bash:

- Prerequisites rechecked before implementation: Java 21.0.12.1, Maven Wrapper
  3.9.16, reachable Docker Engine 29.6.2 and available PostgreSQL 18.6 image.
- Developer and independent QA each ran credential-unset `clean test`:
  3 isolated tests, zero failures/errors/skips, no integration execution.
- Developer verification ran two consecutive credential-unset `clean verify`
  commands successfully. Independent QA repeated two consecutive clean runs
  successfully (55.937 seconds and 43.361 seconds). Each run compiled,
  packaged the executable JAR, passed 3 Surefire tests and 2 Failsafe tests,
  and reported zero failures/errors/skips.
- Consecutive QA runs used distinct fresh PostgreSQL containers and dynamic
  ports (64367 and 50457). Each began without migration history, applied V1,
  verified the exact 18.6 version token, JDBC URL/database identity, empty
  `nexuscrm` schema and one successful expected V1 entry. Reinvoking Flyway
  executed zero migrations and left the complete history unchanged.
- `dependency:tree` and `help:effective-pom` succeeded. Managed versions,
  test scopes and exactly one inherited Failsafe lifecycle binding were
  confirmed. Packaged-JAR inspection found no JUnit/Mockito/Testcontainers
  libraries or test classes. No JPA/Hibernate/H2 or alternative SQL initializer
  was added, and no required integration gate is disabled or skipped.
- Testcontainers removed its PostgreSQL and Ryuk containers. Pre-existing
  container and named-volume identities remained unchanged; QA also compared
  volume metadata. No Compose command or development database connection was
  needed. Repeated before-task SHA256 comparisons confirmed all 38 protected
  files unchanged, including ignored environment files.
- Git whitespace, secret, generated-artifact and scope inspections passed:
  `.env` and `backend/target/` remain ignored, `.env` is untracked, no secret or
  generated output appears in the change set, and no production/frontend or
  previous-task file changed.
- Planning review: `TASK_SPEC_RESULT: APPROVED` after one specification
  revision; architecture review: `ARCHITECTURE_RESULT: APPROVED`.
- Independent local code review: `CODE_REVIEW_RESULT: APPROVE`, no P0-P3
  findings. Independent QA: `QA_RESULT: PASS`, all 13 criteria validated.
- Before publication, refreshed independent code review returned `APPROVE`
  and confirmed that earlier QA evidence remains applicable. A fresh
  credential-unset `clean verify` passed in 52.333 seconds: 3 isolated tests
  and 2 PostgreSQL integration tests, zero failures/errors/skips. Only a
  whitespace correction and authorization notes changed after local QA.

Notes:

- One substantive repair cycle corrected comparison of PostgreSQL's version
  display, which includes Debian build metadata after `18.6`. The initial
  failed assertion and successful re-verification remain recorded in
  `.codex/repair-history/TASK-0008.md`; 1 of 3 shared cycles is consumed.
- The JVM emits a non-blocking class-data-sharing warning with the Mockito
  startup agent. All required backend checks passed; none were weakened.
- The auxiliary skill-format validator could not run because its Python
  environment lacks PyYAML. It is not claimed as passed. The narrow wording
  change was inspected manually and independently; existing skill packaging
  issues were not repaired outside this task.
- Local engineering completion preceded Git publication: at that point no
  commit, push, PR or merge had been performed. The developer subsequently
  authorized review, commit, push and PR creation, but not merge or TASK-0009.
- Only TASK-0008 is newly marked complete in Phase 00. The overall phase
  remains incomplete, and TASK-0009 has not begun.

PR handoff:

- Developer-authorized publication created implementation commit
  `adaec7371888f8af5290099864e7175e13f27050` and pushed
  `feat/task-0008-backend-testing-foundation`.
- PR: https://github.com/helloeduardkenneth/nexus_crm/pull/4, targeting `main`.
  The repair ledger is included in the branch and records the same PR identity.
- Local verification/review/QA approval is distinct from external GitHub
  review and merge. Consult the PR for current-head external review/check
  status; no external approval or merge is inferred from local completion.
- No merge or TASK-0009 work is authorized by this publication handoff.
