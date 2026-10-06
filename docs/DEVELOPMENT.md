# Local development

These instructions describe the existing Phase 00 foundation. Use Git Bash
on Windows and start commands from the repository root unless stated otherwise.
Other shells require their own quoting/environment equivalents; this guide
does not claim those workflows were verified.

## Prerequisites

| Tool | Required setup |
|---|---|
| Git and Git Bash | Available on PATH |
| JDK | Java 21; both PATH and JAVA_HOME must select the JDK |
| Maven | Use committed wrapper 3.9.16; global Maven is unnecessary |
| Node.js | Established development runtime: 22.13.0 |
| pnpm | Exactly 12.9.1, already available; packageManager pins it |
| Docker | Running Linux-container Docker Engine / Docker Desktop |
| Docker Compose | Supports `up --wait` (verified with 5.3.1) |

Dependency/image downloads require network access unless already cached.
If a prerequisite is missing, ask the developer to install/activate it. Do not
silently install global tools, substitute package managers or upgrade runtimes.
After changing Java/Node setup, reopen the terminal/IDE to refresh its environment.

```bash
git clone https://github.com/helloeduardkenneth/nexus_crm.git
cd nexus_crm
java -version
node --version
pnpm --version  # must be 12.9.1
docker version # must include a reachable Server, not just Client
docker compose version
(cd backend && ./mvnw --version) # Maven 3.9.16 on Java 21
```

For an existing checkout, do not clone over it; use its root directory.
Stop on an unmet prerequisite before installation/build/startup commands.

## Local configuration and secrets

Create the local file only if it does not already exist:

```bash
if [[ ! -e .env ]]; then
  cp .env.example .env
fi
```

Edit `.env` locally and supply your own nonempty `POSTGRES_PASSWORD`. Keep the
development database/user defaults. Never paste credentials into logs, commands,
PRs or task notes. `.env` and `.env.*` are ignored; `.env.example` is trackable
and its password must remain empty. These are development credentials only.

| Variable | Compose | Backend |
|---|---|---|
| `POSTGRES_DB` | Required; example `nexuscrm_dev` | Default `nexuscrm_dev` |
| `POSTGRES_USER` | Required; example `nexuscrm` | Default `nexuscrm` |
| `POSTGRES_PASSWORD` | Required, nonempty | Required, no committed default |
| `POSTGRES_PORT` | Host port, default 5432 | Connection port, default 5432 |
| `POSTGRES_HOST` | Not used | Optional connection override, default `localhost` |

Compose reads root `.env`; Spring Boot **does not**. Do not use `source .env`
or `eval` to load it. Existing exported shell values override Compose's dotenv
values. Clear stale values before using Compose:

```bash
unset POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD POSTGRES_PORT POSTGRES_HOST
```

The following helper exports only the four connection entries as literal data,
then chooses localhost for the local backend. It requires exactly one nonempty,
unquoted `KEY=value` entry for database, user and password, including CRLF files.
`POSTGRES_PORT` is optional: omission or an empty value defaults to `5432`,
matching Compose's host-port fallback. Any supplied key must be unique. It rejects
whitespace, quotes, backslashes and dollar signs in those values: these can
require Compose-specific trimming, escaping or interpolation. Punctuation
such as `!`, `;`, `&` and parentheses remains data, never shell code.
Use a long randomly generated password within this supported syntax.

This is not a general-purpose dotenv parser. If an existing `.env` uses other
syntax, stop and arrange a compatible explicit environment-loading approach;
do not silently rewrite its credentials or evaluate the file.

```bash
load_backend_env() {
  local line key value
  local -A values=()
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    case "$line" in
      POSTGRES_DB=*|POSTGRES_USER=*|POSTGRES_PASSWORD=*|POSTGRES_PORT=*) ;;
      *) continue ;;
    esac
    key="${line%%=*}"
    value="${line#*=}"
    if [[ ${values[$key]+present} ]]; then
      printf 'Duplicate %s in .env\n' "$key" >&2
      return 1
    fi
    case "$value" in
      *'$'*|*'"'*|*"'"*|*'\'*|*[[:space:]]*)
        printf 'Unsupported dotenv syntax for %s; no values printed\n' "$key" >&2
        return 1 ;;
    esac
    values[$key]="$value"
  done < .env
  for key in POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD; do
    if [[ -z ${values[$key]-} ]]; then
      printf 'Missing or empty %s in .env\n' "$key" >&2
      return 1
    fi
  done
  values[POSTGRES_PORT]="${values[POSTGRES_PORT]:-5432}"
  for key in POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD POSTGRES_PORT; do
    printf -v "$key" '%s' "${values[$key]}"
    export "$key"
  done
  export POSTGRES_HOST=localhost
}
load_backend_env
```

Stop if the helper fails. Keep shell tracing (`set -x`) off; do not print
`env`, `.env`, expanded Compose configuration or secret-valued exports.
The exported values now agree with the supported `.env` syntax. Run subsequent
Compose/backend commands in this same shell. In each new terminal, repeat
the unset/helper steps before backend startup. For a genuinely remote database,
set `POSTGRES_HOST` explicitly after loading; this guide verifies local only.

## PostgreSQL

From the root after configuration:

```bash
docker compose config --quiet
docker compose up -d --wait postgres
docker compose ps
docker compose exec -T postgres postgres --version
docker compose exec -T postgres sh -c \
  'pg_isready --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"'
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --set ON_ERROR_STOP=1 --command "SELECT current_database();"'
```

Require successful exits, a healthy service, PostgreSQL 18.6 (Debian build
metadata may follow the version), accepting connections and `nexuscrm_dev`.
Compose initializes database/user/password only on an empty data directory.
Editing `.env` does not change credentials in an existing database. If existing
volume settings conflict, stop and request an intentional recovery decision;
do not delete or reinitialize its data to make startup pass.

The logical `postgres_data` named volume mounts at `/var/lib/postgresql`, the
PostgreSQL 18+ image location, not `/var/lib/postgresql/data`. Its physical name
depends on the Compose project. Discover it while the container is running:

```bash
POSTGRES_CONTAINER="$(docker compose ps -q postgres)"
test -n "$POSTGRES_CONTAINER"
POSTGRES_VOLUME="$(docker inspect \
  --format '{{range .Mounts}}{{if eq .Destination "/var/lib/postgresql"}}{{.Name}}{{end}}{{end}}' \
  "$POSTGRES_CONTAINER")"
test -n "$POSTGRES_VOLUME"
docker volume inspect "$POSTGRES_VOLUME" >/dev/null
```

## Backend

Build/check with the [testing workflow](TESTING.md). For a complete package:

```bash
(cd backend && ./mvnw clean verify)
java -jar backend/target/nexus-crm-backend-0.0.1-SNAPSHOT.jar
```

Docker must be reachable for `verify`; the packaged application also needs
the running Compose database and exported credentials. Testcontainers creates
a separate fresh database—it does not use this development volume.

Normal startup binds port 8080 and logs `Started NexusCrmApplication`. Flyway
runs/validates V1, which creates only the empty `nexuscrm` namespace; history
is `public.flyway_schema_history`. No JPA/Hibernate schema generation is present,
and generic SQL initialization is disabled. Never edit an applied migration or
manually create competing schema objects. There is no backend root or health
endpoint yet; HTTP 404 at `/` is expected, not a startup failure.

Use Ctrl+C in the owning terminal to stop the backend. An occupied 8080 is
not permission to kill another process: resolve it with its owner or explicitly
run this backend with `--server.port=8081`. Verification can use port 0 for an
OS-assigned port and capture it from the Tomcat startup log.

### Windows Java loopback failure

If startup fails with `Unable to establish loopback connection` followed by
`SocketException: Invalid argument: connect` in `sun.nio.ch.UnixDomainSockets`,
the failure can occur in the JDK's selector setup rather than database access.
On the verified Windows environment, a standalone `Selector.open()` also
failed; directing its temporary Unix sockets to the existing build directory
allowed the selector to open. The broader Windows failure cause is not proven.

From Git Bash at the repository root, after packaging and loading credentials,
try this process-local option (the directory must already exist):

```bash
test -d backend/target &&
java "-Djdk.net.unixdomain.tmpdir=$(pwd -W)/backend/target" \
  -jar backend/target/nexus-crm-backend-0.0.1-SNAPSHOT.jar
```

This changes only where this JVM places temporary Unix sockets. It does not
disable tests, networking, datasource/Flyway auto-configuration or migrations,
and does not change the JDK installation, application configuration or database.
`pwd -W` supplies a native Windows path in Git Bash; do not run Maven clean
while this backend is using the build directory. Keep the path short enough
for Unix-socket address limits. If it still fails, report the runtime failure
rather than altering security settings or bypassing startup verification.
See [Java 21 networking properties](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/net/doc-files/net-properties.html)
for the supported socket-directory property. `java.io.tmpdir` alone need not
override Windows' earlier socket-directory choices.

After first successful startup, inspect migration state read-only:

```bash
docker compose exec -T postgres sh -c \
  'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --no-psqlrc --set ON_ERROR_STOP=1' <<'SQL'
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'nexuscrm';
SELECT installed_rank, version, description, type, success
FROM public.flyway_schema_history ORDER BY installed_rank;
SELECT count(*) FROM information_schema.tables WHERE table_schema = 'nexuscrm';
SQL
```

Expect `nexuscrm`, one successful V1 SQL entry (`create nexuscrm schema`), and
zero application tables. Repeated startup must leave history unchanged; exact
Flyway log wording is not the authority. Do not run clean/reset/drop commands.

## Frontend

Use another terminal, from the repository root:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Open `http://127.0.0.1:5173/`: Home displays NexusCRM and
"Frontend foundation is ready."; Foundation demonstrates a local form and
compact-spacing preference. Check the browser console for runtime errors.
No frontend environment file or backend API connection is required.
HTTP success alone does not prove rendering; browser inspection is separate.
If port 5173 is occupied, strictPort fails instead of silently selecting another
port. Resolve with the owner; never terminate an unrelated process.
Stop with Ctrl+C in the owning terminal; confirm no Vite child remains and
the port is released before another startup.

Run [frontend quality commands](TESTING.md) in a separate frontend terminal.
For the built bundle, `pnpm preview --host 127.0.0.1 --port 4173 --strictPort`
after `pnpm build` serves a local preview—not a production deployment.

## Database operation and shutdown

These root commands are alternatives; do not paste them as one sequence:

| Action | Command |
|---|---|
| Status | `docker compose ps` |
| Recent logs | `docker compose logs --tail 100 postgres` |
| Follow logs (Ctrl+C exits log following only) | `docker compose logs -f postgres` |
| Stop, retain container/data | `docker compose stop postgres` |
| Start existing container, wait for readiness | `docker compose start --wait postgres` |
| Restart and wait | `docker compose restart postgres` then `docker compose up -d --wait postgres` |
| Interactive SQL (exit with `\q`) | `docker compose exec postgres sh -c 'psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB"'` |

For normal shutdown, stop the owned frontend/backend processes first, then:

```bash
docker compose down
docker volume inspect "$POSTGRES_VOLUME" >/dev/null
unset POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD POSTGRES_PORT POSTGRES_HOST
```

`POSTGRES_VOLUME` is the mount discovered above in this shell; an empty value
is not a volume name. Normal down removes this project's containers/network,
not its named volume. On restart, use `up -d --wait` again. Never use
`docker compose down --volumes`, volume removal or Docker prune as routine
shutdown/troubleshooting: they can permanently delete development data.
Stop only services you own; do not bring down a shared project's database.

## Troubleshooting

| Symptom | Safe next step |
|---|---|
| Java missing/wrong version | Check JDK 21 PATH/JAVA_HOME, refresh terminal; do not downgrade build settings |
| pnpm missing/wrong version | Stop; have the developer activate exactly 12.9.1; do not substitute npm/Yarn/Bun |
| Docker client works but Server fails | Start Docker Desktop/Engine in Linux-container mode; retry `docker version` |
| Dependency/image download fails | Check network/registry availability; preserve failed evidence; do not skip tests |
| Port already allocated | Identify/discuss its owner, or intentionally set a free local port; no arbitrary process kills |
| Empty/missing password | Set a local value and repeat safe loading; never commit it |
| PostgreSQL authentication fails | Check environment/volume initialization consistency without printing secrets; changing dotenv is not a password reset |
| Java Unix-socket loopback failure | Follow the process-local Windows diagnostic above; keep normal datasource/Flyway configuration active |
| Flyway checksum/pre-existing schema failure | Stop and inspect migration history; no automatic clean, baseline, repair or volume deletion |
| Frozen lockfile mismatch | Inspect intended manifest/lockfile changes with the developer; do not disable frozen mode or use another lockfile |
| Lint/typecheck/test/build fails | Read the specific failure/report and fix the cause; do not suppress rules, weaken types or skip verification |

See [Testing](TESTING.md) for report locations and the limits of each check.
