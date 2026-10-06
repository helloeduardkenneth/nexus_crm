# Testing and quality checks

Run from the named directory using Git Bash. See
[Development setup](DEVELOPMENT.md) for prerequisites and local startup.
These checks protect the technical foundation; no CRM business rules exist yet.

## Backend: fast checks versus real PostgreSQL

Use Java 21 and committed Maven Wrapper 3.9.16. Spring Boot 4.1.1 manages
JUnit (currently Jupiter 6.0.3), Mockito (5.23.0) and Testcontainers (2.0.5).
Do not override JUnit to an older major version or add global Maven.

Run isolated tests without loading `.env`, Docker or Compose:

```bash
cd backend
env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
    -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw test
cd ..
```

Surefire discovers `*Test` / `*Tests` (current suite: 3 tests):

- `ApplicationBootstrapTests`: two Mockito unit tests verify argument
  forwarding to SpringApplication and propagation of startup failures.
- `NexusCrmApplicationTests`: one context smoke test excludes datasource and
  Flyway auto-configuration. It proves only non-database context loading,
  not connectivity, credential binding or migration execution.

Full verification requires reachable Docker Engine and access to `postgres:18.6`
but **does not require root `.env` or the Compose database**:

```bash
docker version
cd backend
env -u POSTGRES_HOST -u POSTGRES_PORT -u POSTGRES_DB \
    -u POSTGRES_USER -u POSTGRES_PASSWORD ./mvnw clean verify
cd ..
```

Maven compiles, runs the 3 isolated tests, packages the executable JAR and
runs 2 Failsafe `*IT` tests during integration-test/verify. Missing Docker/image
access or migration failure fails the build; no Docker-unavailable skip is valid.
The JAR is `backend/target/nexus-crm-backend-0.0.1-SNAPSHOT.jar`.

`PostgreSqlMigrationIT` uses a fresh Spring-managed PostgreSQL 18.6 container,
dynamic mapped port, test-owned credentials and normal production datasource/
Flyway configuration. It asserts actual JDBC identity/version, the empty
`nexuscrm` schema, exactly one successful V1 SQL migration in
`public.flyway_schema_history`, and zero application tables. A real second
Flyway migrate executes zero migrations and leaves the complete history
unchanged. It never connects to `nexuscrm_dev` or its persistent named volume.
The context/container closes after the class; reuse is disabled and the
resource reaper remains enabled. Do not bypass cleanup or disable integration.

| Evidence | Location under `backend/target/` |
|---|---|
| Isolated test counts/failures | `surefire-reports/TEST-*.xml` and text reports |
| PostgreSQL integration counts/failures | `failsafe-reports/TEST-*.xml` and `failsafe-summary.xml` |
| Packaged application | `nexus-crm-backend-0.0.1-SNAPSHOT.jar` |

Require BUILD SUCCESS, expected discovered tests and zero failures/errors/skips.
`test` is not full database verification. `package` does not complete Failsafe
verification; use `clean verify` for the authoritative complete backend gate.
The Mockito startup agent may emit a class-data-sharing warning; it is not
a test failure. Do not confuse such warnings with skipped or failing checks.

Optional diagnostics from `backend/`: `./mvnw dependency:tree` inspects resolved
dependencies; `./mvnw help:effective-pom` inspects managed lifecycle configuration.
For an isolated test, `./mvnw -Dtest=ApplicationBootstrapTests test`; focused
commands never replace the complete gate before task completion.

## Frontend

Use Node 22.13.0 and exactly pnpm 12.9.1. No Docker, backend, database or
running browser/dev server is required for frontend quality commands:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm list --depth 0
cd ..
```

| Command | Purpose / expected evidence |
|---|---|
| `pnpm install --frozen-lockfile` | Install canonical `pnpm-lock.yaml`; fail rather than rewrite a mismatch |
| `pnpm lint` | Oxlint checks source/tests/Vite config, including React/TypeScript/accessibility; zero warnings required |
| `pnpm typecheck` | `tsc -b`, strict referenced app/Node projects with composite/noEmit; includes tests/config |
| `pnpm test` | Vitest run-once mode; currently 10 tests in `src/App.test.tsx`, zero failures/skips |
| `pnpm test:watch` | Interactive Vitest watch mode; quit with `q` or Ctrl+C |
| `pnpm build` | Typecheck plus Vite production build, including Tailwind CSS; creates `dist/` |
| `pnpm preview --host 127.0.0.1 --port 4173 --strictPort` | Interactive built-bundle preview after build; stop with Ctrl+C |

React Testing Library/user-event exercise actual router, shared spacing and
form validation/preview behavior in jsdom. Test setup cleans mounted DOM and
tests reset shared/history state. jsdom does not prove real-browser CSS/layout,
browser console cleanliness or production deployment behavior.

For manual browser checks, follow the [frontend startup guide](DEVELOPMENT.md),
inspect Home/Foundation, keyboard navigation and console errors, then stop the
owned server. An HTTP 200 proves readiness only, not these rendering behaviors.

### Fresh installation

To rule out existing dependencies/caches masking a problem, copy only frontend
package.json, pnpm-lock.yaml, index.html, source and Vite/TypeScript/Oxlint
configuration into an owned temporary directory outside the checkout. Do not
copy node_modules, dist or reports. From that copy, run frozen installation,
lint, typecheck, test and build. Compare `sha256sum pnpm-lock.yaml` before/after
and against the source lockfile; it must be unchanged. Delete only the exact
temporary copy you created, after validating its path and stopping its owned
processes. Never recursively clean the repository or an unrelated temp directory.

## Safety and scope checks

Generated output is ignored: `backend/target/`, `frontend/node_modules/`
(including TypeScript `.tmp/` build metadata), `frontend/dist/` and
`frontend/.vitest/`. Do not commit reports or caches. pnpm-lock.yaml is the only
frontend package-manager lockfile; do not create npm/Yarn/Bun lockfiles.

From the root:

```bash
git check-ignore -v .env backend/target frontend/node_modules frontend/dist frontend/.vitest
if git ls-files --error-unmatch .env >/dev/null 2>&1; then
  printf '.env must not be tracked\n' >&2
  exit 1
fi
git diff --check
git status --short --branch --untracked-files=all
git diff
```

Inspect untracked files too; a tracked diff alone misses new files. Keep local
secrets out of logs. If a required command cannot run, report the exact failure
and distinguish environment blockage from an implementation defect; do not
mark verification passed or the task complete. Never weaken tests/lint/types,
reset development data or kill unrelated processes to obtain a green result.
