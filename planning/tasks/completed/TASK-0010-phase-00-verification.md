# TASK-0010 — Phase 00 Verification

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Establish fresh, traceable evidence that the existing NexusCRM foundation
works together and satisfies the approved Phase 00 boundary before human
review and any later Phase 01 work.

## Context

TASK-0001 through TASK-0009 are completed and merged. The repository contains
a Java 21/Spring Boot backend, Flyway/PostgreSQL 18.6 infrastructure, a
React/TypeScript frontend, frontend quality tooling, backend unit/smoke and
Testcontainers integration tests, and local development/testing guides.

Phase 00 still has an incomplete status/checklist and originally required
Spring Data JPA and backend validation although prerequisite implementations
intentionally excluded them. The developer approved deferring JPA/Hibernate
until the first later task introducing domain persistence and backend Bean
Validation until the first later task introducing a request boundary. This
task records that decision, not those implementations. Formatting means
checking existing style and whitespace; no formatter installation is required.

There are no accepted ADR files. Normal backend startup has real datasource
and Flyway auto-configuration; its infrastructure-independent smoke test does
not prove connectivity. TASK-0008 integration tests use their own disposable
PostgreSQL container, not the persistent Compose development database.

## Requirements

1. Verify the existing repository structure, documented prerequisites and
   completed-task outcomes against current files, not previous chat claims.
2. Run fresh backend isolated tests, full Maven verification with actual
   PostgreSQL Testcontainers tests, and executable JAR verification.
3. Run frozen pnpm installation, Oxlint, strict TypeScript checks, frontend
   component tests and production build without changing dependencies or
   the canonical lockfile.
4. Validate and start the existing Compose PostgreSQL service; verify health,
   version, connectivity, the empty application schema and Flyway history.
5. Start the packaged backend with normal datasource/Flyway auto-configuration
   and verify existing migration state is unchanged across startup. No new
   database, migration, table or persistence probe is needed.
6. Verify controlled frontend development-server startup and HTTP readiness
   separately from browser rendering and interaction checks.
7. Check README, development/testing guide commands and local links against
   the implementation. Preserve their existing safe literal dotenv workflow.
8. Reconcile only the approved JPA/Hibernate and validation deferral wording
   in Phase 00, including its scope, technology and learning expectations.
   Retain those technologies as later project goals and retain the prohibition
   on Hibernate schema mutation; do not claim deferred capabilities exist.
9. Map every Phase 00 acceptance criterion and completion-review item to
   current verification evidence. Record independent review and QA outcomes.
10. After all gates pass, complete this task and the Phase 00 status, checklist
    and completion record. Publication/review state is separate from local
    completion, and human merge is not automated.

## Constraints

- Planned edits are this task specification and Phase 00 only. A shared
  repair ledger may be added if substantive repairs require it. If verification
  discovers an implementation defect, assess its scope and approval gate
  before repairing; do not silently turn closeout into a feature task.
- Preserve application source/tests, dependencies, wrappers, lockfiles,
  configuration, `.env`, `.env.example`, Docker Compose, instructions, accepted
  ADRs and completed prerequisite records unless a newly discovered scoped
  defect requires an explicitly justified repair.
- No JPA/Hibernate, validation starter, formatter, business features,
  authentication, Redis/RabbitMQ, new infrastructure or Phase 01 work.
- Never evaluate/source `.env`, expose credentials, skip required tests,
  weaken gates, reset/drop development data or remove Docker volumes.
- Discover the physical named volume from its live `/var/lib/postgresql`
  mount. Never assume a project-prefixed volume name or execute destructive
  Compose shutdown/reset/prune.
- Own and track verification processes; do not kill an unrelated port owner.
  Preserve unrelated containers/volumes. Stop on incompatible existing state.
- No broad historical documentation cleanup. Human review/merge remain
  separate from local phase completion; do not begin the next phase.

## Expected Result

Phase 00 has current passing engineering evidence and an accurate completion
record, with the approved later persistence/validation work explicitly deferred.
Application functionality, dependencies and persistent development data remain
unchanged. The scoped task PR is ready for human review, not merged.

## Acceptance Criteria

- [x] Repository structure, committed pnpm lockfile and documented runtime/tool
      prerequisites match the implemented foundation.
- [x] Credential-unset Maven unit/smoke tests pass independently of PostgreSQL.
- [x] Full Maven verification runs all unit/smoke and real PostgreSQL integration
      tests without failures, errors or skipped tests and packages the JAR.
- [x] Frozen pnpm installation preserves the lockfile; lint, typecheck, all
      component tests and production build pass.
- [x] Compose validates quietly; PostgreSQL 18.6 is healthy and accepts a
      connection to the development database.
- [x] Normal packaged backend startup succeeds within 60 seconds with real
      datasource/Flyway configuration; the existing full history is unchanged.
- [x] The `nexuscrm` schema exists, has zero application tables, and public
      Flyway history contains exactly one successful V1 SQL migration with
      description `create nexuscrm schema` and no additional migrations.
- [x] Vite starts on 127.0.0.1:5173 within 60 seconds and returns HTTP success.
- [x] Browser inspection confirms Home text, Foundation navigation, compact
      spacing and valid/invalid local form behavior without runtime errors.
      HTTP/component tests are not substituted for this browser evidence.
- [x] Only owned backend/frontend processes are terminated and their ports
      released; the discovered volume survives normal Compose shutdown and
      unrelated Docker resources remain intact.
- [x] Development/testing documentation commands and local links agree with
      the implementation; no secret or generated output is tracked.
- [x] Source/dependency review confirms no CRM functionality, JPA/Hibernate
      schema generation or competing schema initializer was introduced.
- [x] Approved deferrals are explicit and every Phase 00 acceptance/completion
      item has evidence; independent review approves and QA passes.
- [x] Final scope/whitespace/protected-file checks pass before completion and
      again after updating task/phase lifecycle records.

## Verification

Use Git Bash and the existing README, docs/DEVELOPMENT.md and docs/TESTING.md
as the executable workflow. Missing tools or unreachable Docker are blockers,
not permission to install global tools or claim success.

### Baseline and static/build verification

Capture Git status and protected-file hashes, inventory current Docker
containers/volumes and check prerequisites before changing runtime state:

```bash
git status --short --branch --untracked-files=all
java -version
node --version
pnpm --version
docker version
docker compose version
(cd backend && ./mvnw --version)
```

Require Java 21, Maven Wrapper 3.9.16, the established Node 22.13.0 runtime,
pnpm 12.9.1 and a reachable Linux-container Docker Engine. Preserve the existing
frontend instructions and lockfile hashes. Inspect repository structure,
Maven/pnpm dependencies, strict composite/noEmit TypeScript configuration,
scripts and source boundaries; do not resolve new dependency versions.

```bash
(cd backend && env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
  -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw test)
(cd backend && env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
  -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw clean verify)
(cd backend && ./mvnw dependency:tree)
(cd frontend && pnpm install --frozen-lockfile && pnpm lint && \
  pnpm typecheck && pnpm test && pnpm build && pnpm list --depth 0)
```

Inspect Surefire/Failsafe results, packaged JAR and frontend build output;
require all existing tests to execute with zero skips. Compare lockfile hashes
before/after. Prior fresh-install evidence from TASK-0005/TASK-0009 remains
historical evidence, not a claimed rerun; this closeout requires a fresh frozen
installation/check sequence in the current checkout, not another source copy.

### Local integration and process safety

Load only required connection keys as literal data using the supported helper
in docs/DEVELOPMENT.md, without shell evaluation or value output. Clear stale
connection values first and explicitly export POSTGRES_HOST=localhost. Stop
on unsupported dotenv syntax rather than rewriting `.env`.

```bash
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
docker compose exec -T postgres postgres --version
docker compose exec -T postgres sh -c \
  'pg_isready --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"'
```

Use environment-driven psql connections with ON_ERROR_STOP. Assert
current_database() matches the configured development database; query schema,
history metadata/count and zero application tables as documented. Capture a
stable full-history fingerprint before and after normal backend startup, for
example ordered JSON of all history fields hashed with PostgreSQL md5. Require
the identical fingerprint and exactly one successful V1 entry. Exact Flyway log
wording is supporting evidence only. Never replay historical disposable-database
creation/drop procedures or run a migration repair/clean/baseline command.

Start the existing packaged JAR with real environment settings and port 0,
capture PID/process ownership and stdout/stderr under ignored backend/target,
detect early exit and require Started NexusCrmApplication within 60 seconds.
The existing documented process-local Windows Unix-socket directory option
may be used without changing project/JDK configuration. Discover the selected
HTTP port from startup logs; an HTTP 404 at `/` is expected because no root API
exists. Stop/reap only the owned process and verify the port is released.

Ensure 5173 is free before starting:

```bash
(cd frontend && pnpm dev --host 127.0.0.1 --port 5173 --strictPort)
```

Capture owned PID/process tree and stdout/stderr, enforce a 60-second readiness
deadline, detect early exit and assert HTTP success. Use native browser capability
if available to inspect Home text, Foundation navigation, shared compact spacing,
valid preview and invalid-submission preview clearing/associated error. Inspect
browser console runtime errors. If native browser verification is unavailable,
request an explicitly attributed manual check; the task remains incomplete until
that evidence exists. Do not install browser-testing dependencies.

Clean up owned backend/frontend processes on success or failure, including the
Vite child, and assert released ports. Discover the live volume with docker
inspect at /var/lib/postgresql, verify its existence before and after normal
docker compose down. Do not alter unrelated resources. On failure preserve
diagnostics and persistent data, report the exact failed command and leave
task/phase incomplete; do not attempt destructive recovery.

### Final review and completion

Verify local Markdown links and commands against actual scripts/defaults,
style/whitespace conventions and generated-artifact ignores. Inspect tracked
and untracked files for alternate lockfiles, secrets or future-phase code:

```bash
git check-ignore -v .env frontend/node_modules frontend/dist backend/target
git ls-files --error-unmatch frontend/pnpm-lock.yaml
git diff --check
git status --short --branch --untracked-files=all
git diff
```

Require `.env` to remain untracked and `.env.example` unchanged/trackable.
Compare protected-file checksums with baseline and inventory Docker resources.
Request independent code review of actual scope/diff and fresh QA validation.
Map phase criteria to these results, update completion only after both gates
pass, and repeat scope/whitespace/secret checks. Follow the authorized PR lifecycle
without merging or beginning Phase 01.

## Architecture / Approval Notes

The developer explicitly approved the verification-only closeout and deferral
of JPA/Hibernate to the first later domain-persistence task and backend Bean
Validation to the first later request-boundary task. This is a Phase 00
sequencing decision, not removal of the project architecture/testing goals.
Flyway remains the sole schema authority. Existing routing/state/form/Tailwind
and Testcontainers designs remain unchanged. Independent task-spec review and
architecture reconciliation must confirm this boundary before execution.

## Learning Objectives

- Distinguish build, isolated smoke, real database integration, HTTP readiness
  and browser evidence; understand why none substitutes for every other layer.
- Explain how an evidence-based phase closeout differs from merely completing
  individual task checklists, including explicit approval of deferred work.
- Operate the existing foundation without evaluating dotenv secrets, mutating
  migration history, losing persistent data or terminating unrelated processes.

## Definition of Done

1. All task and approved Phase 00 acceptance criteria have passing evidence.
2. Required fresh verification, independent review and QA pass.
3. Runtime cleanup and persistent-volume protection are verified.
4. Changes remain within scope with no secrets, dependency or feature changes.
5. Completion accurately records commands, results, deferrals and limitations.
6. This task moves to planning/tasks/completed/ and its phase entry is marked
   `— ✅ Completed`; Phase 00 completion reflects the verified foundation.
7. Final diff review passes and the authorized task PR is prepared for human
   review, with external-review state reported separately from local completion.

## Completion

Status: Completed — local engineering verification passed on 2026-10-08

Implemented:

- Verified the existing foundation on `feat/task-0010-phase-00-verification`;
  no application, test, dependency, configuration or instruction changes.
- Reconciled Phase 00 with the developer-approved persistence/validation
  deferrals and recorded its acceptance/completion-review evidence.
- Completed this task and moved it to `planning/tasks/completed/`.

Verification:

- Git Bash prerequisites passed: Java 21.0.12.1, Node 22.13.0, pnpm 12.9.1,
  Maven Wrapper 3.9.16, reachable Linux Docker Engine 29.6.2 and Compose 5.3.1.
- Credential-unset `./mvnw test` passed all three unit/smoke tests.
  Credential-unset `./mvnw clean verify` compiled and packaged the executable
  JAR, passed three Surefire tests and two real PostgreSQL 18.6 Failsafe
  integration tests, with zero failures, errors or skips. Independent QA
  reran both commands successfully; the integration tests executed fresh
  migration and second-migration idempotence checks.
- `./mvnw dependency:tree` confirmed the approved Boot-managed dependencies
  and no JPA, Hibernate or competing schema manager. Source/config inspection
  confirmed Flyway authority, SQL initialization disabled and no CRM features.
- `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`,
  `pnpm build` and `pnpm list --depth 0` passed. All ten frontend tests ran.
  Independent QA reran every gate successfully. Lockfile SHA256 remained
  `94E6FF727346CB71B278A50199FDACA42160F0DC420321C7E93D2A548AEAA3E4`.
- Compose quiet validation and `up -d --wait postgres` passed; PostgreSQL
  18.6 was healthy and accepted connections to `nexuscrm_dev`. Read-only SQL
  confirmed `nexuscrm`, zero application tables, public history and exactly
  one successful V1 SQL migration with description `create nexuscrm schema`.
- Normal packaged backend startup with real datasource/Flyway configuration
  passed within 60 seconds (developer 6.41s; independent QA 3.48s). Root HTTP
  404 was expected with no API. Full ordered-history fingerprint remained
  `985b08b548b85a3da6ef92295f1b4aa1` before/after startup in both runs.
- Controlled Vite startup on `127.0.0.1:5173` returned HTTP 200 within 60
  seconds (developer 2.75s; QA 4.18s). Separate native-browser checks by the
  developer agent and QA confirmed Home text, Foundation navigation,
  compact spacing (32px to 16px), preference preservation across navigation,
  valid preview, required/max-length errors, invalid-submission preview
  clearing, associated accessible errors and Back/Forward navigation.
  QA additionally verified the valid 40-character boundary. Console runtime
  error logs were empty; verification tabs were closed.
- Owned backend and Vite process trees were terminated; all owned PIDs and
  their ports were released. The dynamically discovered named volume at
  `/var/lib/postgresql` survived normal Compose shutdown. The unrelated
  baseline container and both baseline volumes remained intact.
- Ten local Markdown links resolved; all fifteen Bash fences passed syntax
  checking, and documentation commands/defaults agreed with actual scripts.
  `.env` remained ignored/untracked, `.env.example` unchanged/trackable and
  generated outputs ignored/untracked. No alternative lockfile was found.
- Protected SHA256 hashes for all 77 other tracked files were unchanged.
  Whitespace, complete diff, untracked-file, secret and scope checks passed
  before and after the task/phase completion-record updates.
- Independent task-spec review: APPROVED (one review, zero revisions).
  Architecture reconciliation: APPROVED. Independent code review: APPROVE,
  no findings. Independent QA: PASS; no unresolved P0/P1 findings.

Notes:

- The earlier Docker named-pipe prerequisite failure was resolved by the
  developer starting Docker Desktop; all required Docker checks then ran.
- The first developer `pnpm test` attempt timed out starting a Vitest worker
  before tests ran. An unchanged retry passed all ten tests; independent QA
  also passed on its first attempt. The exact transient cause is unconfirmed.
  No test timeout, lint rule or build configuration was weakened.
- The existing documented Windows process-local Unix-socket directory
  workaround was used for packaged startup; project/JDK settings unchanged.
- JPA/Hibernate remain deferred to the first later domain-persistence task;
  backend Bean Validation remains deferred to the first later request-boundary
  task. Future validation/authorization and schema-mutation rules remain intact.
- No substantive repair cycles were consumed; no repair ledger was required.
  Diagnostic logs/helpers reside only under ignored `backend/target/`.
- Local completion is distinct from PR review/merge. The authorized scoped PR
  lifecycle follows these local gates; external-review state is reported
  separately. Phase 01 has not begun and no merge is authorized.
