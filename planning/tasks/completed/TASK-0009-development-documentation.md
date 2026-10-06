# TASK-0009 — Development Documentation

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Enable a new developer to reproduce the existing NexusCRM local environment
and run its verification using safe, accurate, repository-backed instructions.

## Context

TASK-0002 through TASK-0008 established Java 21, Spring Boot 4.1.1, Maven
Wrapper 3.9.16, PostgreSQL 18.6, Flyway, React/TypeScript/Vite, pnpm 12.9.1,
frontend quality tooling and isolated/PostgreSQL backend testing. TASK-0008
is merged. README.md and docs/TESTING.md are empty; general onboarding was
deliberately deferred to this task.

The current backend has no business endpoints or JPA/Hibernate. Its smoke
test excludes database auto-configuration; real database proof comes from
normal application startup and Testcontainers integration tests. Maven test
is infrastructure-independent, whereas clean verify requires Docker Engine.
The frontend is a technical demonstration, not a CRM workflow. TASK-0010
owns the overall Phase 00 verification/completion review.

## Requirements

1. Populate root README.md as a concise project entry point describing the
   implemented foundation, its limitations, repository layout and links to
   the development/testing guides and phase/roadmap.
2. Create docs/DEVELOPMENT.md as the authoritative Git Bash workflow for
   prerequisites, checkout, safe local environment setup, PostgreSQL startup,
   backend packaging/startup, frontend installation/startup and shutdown.
3. Populate docs/TESTING.md with actual Maven/pnpm commands, test roles,
   Docker requirements, test/report locations, lint/typecheck/build roles,
   interactive watch commands and expected success/failure evidence.
4. Document Java 21, the committed Maven Wrapper, the established Node
   22.13.0 development runtime and exact pre-existing pnpm 12.9.1 prerequisite.
   Require reachable Docker Engine and Compose with --wait support. Missing
   global tools require developer action, not automatic installation/upgrades.
5. Explain the existing POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD and
   POSTGRES_PORT contract, optional backend-only POSTGRES_HOST override,
   datasource defaults and the fact that Spring Boot does not load root .env.
   Never source/evaluate .env as shell code or print its values. Provide a
   safe, bounded-syntax literal loading workflow and clearly document its
   supported dotenv syntax, avoiding silent Compose/backend disagreement.
6. Preserve an existing .env; instruct first-time developers to copy the safe
   example only when .env is absent and supply their own nonempty password.
   Explain shell-variable precedence, ignored secrets and credential changes
   not reinitializing an existing PostgreSQL volume.
7. Document PostgreSQL 18.6 readiness/version/connectivity inspection, the
   postgres_data mount at /var/lib/postgresql, non-destructive operating
   commands and normal down retaining data. Discover the physical volume
   from the live mount rather than assuming a project-prefixed name. Warn
   about destructive resets without prescribing them as troubleshooting.
8. Document normal backend startup against nexuscrm_dev with Flyway active,
   the empty nexuscrm schema and public.flyway_schema_history. Use read-only
   database inspection; do not create databases, tables, metadata probes or
   re-run historical destructive verification examples. Clarify the absence
   of an implemented backend root/health API and frontend/backend integration.
9. Document pnpm frozen installation, dev, lint, typecheck, test, test:watch,
   build and preview; identify canonical lockfile and generated artifacts.
   Distinguish HTTP readiness, component tests and manual browser rendering.
10. Provide task-specific troubleshooting for missing tools, unavailable
    Docker, occupied ports, empty/mismatched credentials, Flyway failures,
    frozen-lockfile failures and failed checks without weakening any gate.
11. Verify documented commands and links against the actual repository,
    exercise installation/quality commands from an isolated frontend source
    copy outside the repository, and perform a controlled local startup
    walkthrough using existing development infrastructure safely.

## Constraints

- Change only README.md, docs/DEVELOPMENT.md, docs/TESTING.md and this task's
  lifecycle records. A repair ledger may be added only if substantive repairs
  require it. Completion may mark only TASK-0009 in Phase 00.
- Preserve source, tests, dependency/build configuration, lockfiles, wrappers,
  .env, .env.example, Compose, instructions, ADRs and prior task records.
- No new dependencies, application behavior, infrastructure, CI, CRM features
  or production deployment instructions. Do not begin TASK-0010 or Phase 01.
- Never delete/reset development data or volumes, run destructive Compose
  reset/prune, expose secrets or terminate unrelated processes. Stop for
  incompatible existing state rather than attempting destructive recovery.
- No broad historical documentation cleanup or filling unrelated empty docs.

## Expected Result

A short README links to reliable development and testing guides. A developer
can operate the existing foundation with Git Bash, understand which checks
need Docker, protect local secrets/data and diagnose failures without
inventing missing application capabilities.

## Acceptance Criteria

- [x] README describes actual implemented capabilities/limits and links to
      existing development, testing, project and planning documents.
- [x] Prerequisites, working directories, environment contract and safe
      first-time setup are explicit; existing local configuration is preserved.
- [x] Backend environment loading does not evaluate .env, disclose credentials
      or silently disagree with Compose for the supported syntax.
- [x] Documented PostgreSQL commands validate, start healthy, report 18.6,
      accept read-only queries and preserve the discovered named volume.
- [x] Documented backend startup succeeds with normal datasource/Flyway
      configuration; no new migration or business schema is introduced.
- [x] Maven isolated test and full verification pass; documentation correctly
      separates their evidence and Docker requirements/report locations.
- [x] Frozen frontend installation, lint, typecheck, tests and build pass from
      an isolated source copy with unchanged lockfile checksum.
- [x] Documented Vite startup returns HTTP success within 60 seconds; only
      owned processes are cleaned up and the selected port is released.
- [x] Troubleshooting, safe shutdown, generated-artifact/secret handling and
      optional interactive commands are documented; all local links resolve.
- [x] Independent documentation review approves and QA validates onboarding
      requirements; no unresolved P0/P1 or blocked verification remains.
- [x] Git whitespace/scope and protected-file checks confirm docs-only changes,
      no secrets/generated artifacts and no TASK-0010/Phase 01 work.

## Verification

Use Git Bash. First inspect Git state, protected-file/lockfile checksums,
existing containers/volumes and available tools:

```bash
git status --short --branch --untracked-files=all
java -version
node --version
pnpm --version
docker version
docker compose version
(cd backend && ./mvnw --version)
```

Require the documented versions and running Docker; stop on unmet prerequisites.
Compare every documented script/default/path with repository configuration.
Validate Markdown links and Bash command syntax, then execute the guide's
noninteractive onboarding/verification steps. Do not claim interactive watch,
browser layout or Windows-versus-other-platform behavior without direct proof.

Run credential-unset ./mvnw test and ./mvnw clean verify from backend, inspect
separate Surefire/Failsafe reports and the executable JAR. Full verification
must run actual PostgreSQL integration tests, not skip them. Copy only frontend
manifest/lockfile/source/HTML/configs to an owned mktemp directory outside the
repository. Run pnpm install --frozen-lockfile, lint, typecheck, test and build;
compare lockfile checksums before/after and clean up only the validated copy.

Validate Compose quietly and start postgres with --wait. Inspect health,
version, connection and existing Flyway history using read-only SQL. Capture
the actual /var/lib/postgresql volume identity and migration history before
normal backend startup; require Started NexusCrmApplication within 60 seconds,
detect early exit and capture stdout/stderr under ignored backend/target.
After stopping the owned process, require unchanged migration history and
released port. Use no datasource/Flyway exclusions in this runtime proof.

Exercise Vite on 127.0.0.1:5173 with --strictPort, bounded 60-second HTTP
readiness and owned process-tree cleanup. If a port is occupied, stop/report;
do not kill its owner. HTTP success proves server readiness, not rendering.
Normal Compose down must retain the discovered volume; preserve pre-existing
unrelated services. Report local runtime actions and any cleanup failure.

Finally check .env ignored/untracked, generated artifacts ignored, no
alternative lockfile, protected-file checksum stability, git diff --check,
complete tracked/untracked scope and all relative documentation links.
Obtain independent code-review of documentation safety/correctness, then
qa-validation of acceptance coverage before updating completion.

## Architecture / Approval Notes

Documentation-only: preserve all established architecture and versions.
No architecture review is required unless a material conflict is discovered.
Choosing a README entry point and separate development/testing guides is a
reversible documentation organization choice, not new application architecture.
Docker/tool availability is a verification prerequisite; absence is not a
reason to bypass gates. No unresolved engineering decision is identified.

## Learning Objectives

- Distinguish build, isolated test, real database integration and runtime proof.
- Understand Compose versus Spring environment loading and secret protection.
- Understand container versus named-volume lifetime and safe troubleshooting.
- Use wrappers/lockfiles for reproducibility and navigate test failure reports.

## Definition of Done

1. All acceptance criteria and required verification pass.
2. Independent documentation review approves and QA returns PASS.
3. Only scoped documentation changes; production/configuration and data intact.
4. Completion records actual verification, review, QA and warnings.
5. Move this file to planning/tasks/completed/ and mark only TASK-0009
   — ✅ Completed in Phase 00; leave overall phase and TASK-0010 incomplete.
6. Complete authorized PR preparation; never merge or begin the next task.

## Completion

Status: Completed locally; PR review tracked separately

Implemented:

- Added README.md as a concise entry point describing actual capabilities.
- Created docs/DEVELOPMENT.md with Git Bash prerequisites, safe literal
  environment loading, PostgreSQL/backend/frontend startup, volume discovery,
  shutdown and non-destructive troubleshooting.
- Populated docs/TESTING.md with Maven/pnpm commands, report locations and
  the distinction between smoke tests, database integration and runtime proof.
- Preserved application source, tests, dependencies, configuration, lockfiles,
  wrappers, local environment files, Compose and previous task records.

Verification:

- Task-spec review: APPROVED; architecture review: NOT_REQUIRED.
- Verified Java 21.0.12.1, Maven Wrapper 3.9.16, Node 22.13.0, pnpm 12.9.1,
  Docker Engine 29.6.2 and Compose 5.3.1 on 2026-10-06.
- Developer and independent QA credential-unset Maven test / clean verify
  passed: 3 isolated tests and 2 actual PostgreSQL 18.6 integration tests,
  zero failures/errors/skips, executable JAR packaged.
- Developer fresh isolated frontend source copy passed frozen installation,
  lint, typecheck, all 10 component tests and production build. Independent QA
  reran the repository frontend gates successfully. Lockfile SHA256 remained
  94E6FF727346CB71B278A50199FDACA42160F0DC420321C7E93D2A548AEAA3E4.
- All local documentation links and 15 Bash fences passed validation.
  Private Compose/environment comparisons and literal-loader positive/negative
  cases passed without evaluating dotenv contents or printing credentials.
- Developer and QA Compose walkthroughs validated healthy PostgreSQL 18.6,
  connectivity, empty nexuscrm schema and one successful V1 history row.
- Initial normal backend startup failed in JDK Unix-domain selector setup
  (Unable to establish loopback connection / Invalid argument: connect).
  A standalone Selector.open probe reproduced it. The supported process-local
  jdk.net.unixdomain.tmpdir option directed at existing ignored backend/target
  resolved the probe and real application startup; no application/build/JDK
  installation settings or gates were changed.
- Developer backend startup passed in 6.176 seconds; independent QA repeated
  it in 6.832 seconds with normal datasource/Flyway configuration active.
  Root HTTP 404 was expected; owned processes stopped and ports were released.
- Full Flyway history remained unchanged across startup. Independent QA's
  identical before/after jsonb history fingerprint was
  985b08b548b85a3da6ef92295f1b4aa1.
- Controlled Vite startup passed bounded HTTP readiness in both runs; QA
  observed HTTP 200 within 762 ms. Owned Windows process trees were terminated
  and port 5173 was released. HTTP evidence is not browser-rendering evidence.
- Normal Compose down retained the dynamically discovered mounted named
  volume; unrelated container and volume identities were preserved.
- The developer removed the owned isolated copy in File Explorer after tool
  execution policy denied cleanup; both root and QA verified the exact path
  no longer existed. No alternate deletion mechanism bypassed that denial.
- Independent code review: APPROVE, no P0–P3 findings.
- Independent QA: PASS, all 11 criteria covered, no blockers or findings.
- PR repair cycle 2 corrected optional POSTGRES_PORT defaulting and preserved
  Maven failure status with subshell commands. Independent re-review approved;
  affected QA passed all criteria, including missing/empty/custom port and CRLF,
  nine rejected invalid cases and a private Compose consistency comparison.
- Both exact repaired Maven command blocks passed again in developer and QA
  runs (3 isolated + 2 real PostgreSQL integration tests, zero failures/errors/
  skips); failure probes retained exit status 37 and the caller's directory.
  Unchanged frontend/runtime evidence was retained, not claimed as rerun.
- Whitespace, secret/ignore, generated-artifact, lockfile and complete scope
  checks passed; 73 protected files retained their original checksums.

Notes:

- Two shared substantive documentation repair cycles were reserved; see
  .codex/repair-history/TASK-0009.md. The broader Windows selector failure
  cause remains unproven; the documented process-local option was verified.
- No new browser rendering, interactive-watch or cross-platform verification
  is claimed; those evidence boundaries are explicit in the guides.
- Only TASK-0009 is marked completed. Overall Phase 00 and TASK-0010 remain
  incomplete; no next-task implementation, merge or destructive recovery.
- Publication and current-head external review are separate PR lifecycle gates.
- CodeRabbit identified optional-port handling and Maven exit-status issues.
  Shared repair cycle 2 resolved both with new developer verification,
  independent re-review and affected QA; external approval applies only to
  the corresponding PR head and must be rechecked after the repair push.
- PR: https://github.com/helloeduardkenneth/nexus_crm/pull/5 against main from
  feat/task-0009-development-documentation. Current-head external review/check
  state is tracked on GitHub; local completion is not merge approval.
