# TASK-0005 — React + TypeScript Bootstrap

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Create the initial NexusCRM frontend using React, strict TypeScript, Vite,
and pnpm. Prove reproducible dependency installation, development-server
startup, TypeScript verification, production building, and browser rendering
from a minimal frontend foundation.

## Context

TASK-0001 established the repository structure. TASK-0002 through TASK-0004
established the backend, PostgreSQL environment, and Flyway migrations.
The frontend currently contains only `frontend/AGENTS.md`, which must be
preserved.

This task establishes the frontend executable foundation before routing,
state, forms, styling infrastructure, or CRM screens are introduced.
Construct the minimal files directly, using the official Vite React
TypeScript template's structure as a reference rather than scaffolding over
the existing frontend directory.

The inspected development runtime is Node 22.13.0. The approved exact
`@types/node` version is 22.20.5, intentionally selecting the Node 22 type
line for that runtime. This is not the newer Node type line used by the
current Vite template. Type declarations do not upgrade the runtime; do not
use Node APIs unavailable in the actual development runtime.

The approved pnpm version is 12.9.1. pnpm was unavailable on PATH during
authoring inspection. Its availability must be checked again before
implementation. Package-manager activation or installation is a separate
environment setup action and is not authorized by this task.

All engineering decisions recorded below are approved. No remaining
architectural decision requires approval.

## Requirements

1. Before creating or modifying frontend implementation files, verify a
   supported Node runtime and exactly pnpm 12.9.1. If pnpm is unavailable or
   reports a different version, stop and report that the approved version
   must be activated. Do not activate or install it as part of this task.
2. Create these files under `frontend/`:

   ```text
   package.json
   pnpm-lock.yaml
   index.html
   vite.config.ts
   tsconfig.json
   tsconfig.app.json
   tsconfig.node.json
   src/main.tsx
   src/App.tsx
   ```

3. Create a private ESM package named `nexus-crm-frontend`, with
   `"type": "module"` and `"packageManager": "pnpm@12.9.1"`.
4. Add only these exact direct dependencies using pnpm:

   | Package | Version | Dependency scope |
   |---|---|---|
   | `react` | `19.3.0` | Runtime |
   | `react-dom` | `19.3.0` | Runtime |
   | `vite` | `8.3.2` | Development |
   | `@vitejs/plugin-react` | `6.1.1` | Development |
   | `typescript` | `6.0.2` | Development |
   | `@types/react` | `19.3.0` | Development |
   | `@types/react-dom` | `19.3.0` | Development |
   | `@types/node` | `22.20.5` | Development |

   Use `pnpm add --save-exact` and `pnpm add -D --save-exact`; do not manually
   author the dependency lockfile or use another package manager. TypeScript
   6.0.2 is the approved template-reference compiler line; do not upgrade it
   to TypeScript 7 during bootstrap.
5. Provide exactly these package scripts:

   ```json
   {
     "dev": "vite",
     "typecheck": "tsc -b",
     "build": "tsc -b && vite build",
     "preview": "vite preview"
   }
   ```

6. Configure `tsconfig.json` with no root source files and project references
   to `tsconfig.app.json` and `tsconfig.node.json`.
7. Configure both referenced TypeScript projects with explicit `strict: true`
   and `noEmit: true`. Application configuration must include `src`, target
   ES2023, use browser DOM libraries, ESNext modules, bundler module
   resolution, automatic `react-jsx`, and `vite/client` types. Node
   configuration must include `vite.config.ts`, target ES2023, use NodeNext
   modules and module resolution, and Node types. Put each project's
   TypeScript build metadata inside `node_modules/.tmp/`.
8. Keep `vite.config.ts` limited to Vite's `defineConfig` and registration of
   `@vitejs/plugin-react` through `plugins: [react()]`. Do not add proxies,
   aliases, deployment settings, or speculative plugins.
9. Give `index.html` the document title `NexusCRM`, a React root element, and
   the module entry `/src/main.tsx`.
10. Use React DOM `createRoot` and React `StrictMode` in `src/main.tsx`.
    Render `App` with a semantic, unstyled placeholder containing a heading
    `NexusCRM` and the text `Frontend foundation is ready.`.
11. Preserve all root `.gitignore` rules and add only:

    ```gitignore
    /frontend/node_modules/
    /frontend/dist/
    ```

    TypeScript build metadata is covered by the node_modules rule.
12. Use Git Bash as the authoritative developer verification shell.
    Verify fresh frozen-lockfile installation, type checking, building,
    automated dev-server readiness and termination, and separate browser
    rendering. Record which checks were automated and which were manual.

## Constraints

- Preserve `frontend/AGENTS.md` and any existing user changes.
- Use pnpm exclusively. Do not use npm, Yarn, Bun, or a different pnpm
  version, or silently install or activate a package manager globally.
- Do not create `package-lock.json`, `yarn.lock`, `bun.lock`, `bun.lockb`,
  another package-manager lockfile, or `pnpm-workspace.yaml`.
- Do not run create-vite over the existing frontend directory.
- Do not add React Router, Zustand, React Hook Form, Tailwind CSS, shadcn/ui,
  TanStack Query, API clients, navigation/layout architecture, shared state,
  forms architecture, or frontend feature/domain architecture. The planned
  router, state, forms, and Tailwind foundations belong to TASK-0006.
- Do not add Oxlint, ESLint, Vitest, React Testing Library, Playwright,
  Puppeteer, browser-testing libraries, or Testcontainers. Frontend linting
  and automated test tooling belong to TASK-0007.
- Do not create placeholder lint/test scripts merely to report passing
  checks. Type checking and building are the applicable frontend command
  checks for this task; linting and automated component tests are deferred.
- Do not add demo counters, logo assets, CSS frameworks, authentication,
  business screens, business rules, or backend integration.
- Do not change backend, database, Docker Compose, environment files,
  existing completed tasks, general development documentation, or unrelated
  phase content.
- Do not commit or push as part of this task.

## Expected Result

The frontend contains a minimal React application, strict TypeScript and
Vite configuration, and a pnpm-managed dependency manifest and lockfile.
A developer with the approved prerequisites can install dependencies,
type-check, build, and run the application independently of backend or
database services. The browser renders only the NexusCRM foundation
placeholder. Generated artifacts are ignored by Git.

## Acceptance Criteria

- [ ] Exactly pnpm 12.9.1 is verified before frontend implementation begins.
- [ ] `package.json` is private ESM, named `nexus-crm-frontend`, and declares
      `packageManager: "pnpm@12.9.1"`.
- [ ] Only the approved exact direct dependency versions and scopes exist.
- [ ] The canonical `pnpm-lock.yaml` is generated by pnpm.
- [ ] A fresh `pnpm install --frozen-lockfile` succeeds without changing the
      lockfile.
- [ ] No alternative package-manager lockfile or workspace file is created.
- [ ] TypeScript project references cover application and Vite configuration
      code with explicit strict mode and no TypeScript JavaScript emission.
- [ ] The approved dev, typecheck, build, and preview scripts exist.
- [ ] `pnpm typecheck` succeeds.
- [ ] `pnpm build` succeeds and produces `dist/index.html` and built assets.
- [ ] Vite starts on `127.0.0.1:5173` and becomes ready within 60 seconds.
- [ ] The development HTTP endpoint responds successfully.
- [ ] The verification server and its children terminate cleanly, and port
      5173 is released afterward.
- [ ] Browser inspection confirms `NexusCRM` and
      `Frontend foundation is ready.` render without console runtime errors.
- [ ] Browser rendering is verified separately from automated HTTP readiness.
- [ ] `node_modules`, `dist`, and TypeScript build metadata are ignored.
- [ ] `frontend/AGENTS.md`, backend, database, and Compose files are unchanged.
- [ ] No business/domain functionality or TASK-0006/0007 tooling is introduced.

## Verification

Use Git Bash. These are future implementation checks, not actions to execute
during task authoring. Do not start backend or database services for frontend
bootstrap verification.

### 1. Prerequisites and baseline

From the repository root:

```bash
git status --short --branch --untracked-files=all
node --version
pnpm --version
```

Require a Node version supported by the approved Vite and React plugin.
The inspected Node 22.13.0 satisfies their Node 22.12+ requirement.
Require pnpm 12.9.1 exactly. If unavailable or different, stop before
frontend implementation and report the prerequisite. Do not install,
activate, substitute, or downgrade tools to bypass that check.

### 2. Dependency setup and build

During implementation, after creating the minimal manifest, add dependencies
through pnpm from `frontend/`:

```bash
pnpm add --save-exact react@19.3.0 react-dom@19.3.0
pnpm add -D --save-exact vite@8.3.2 @vitejs/plugin-react@6.1.1 typescript@6.0.2 @types/react@19.3.0 @types/react-dom@19.3.0 @types/node@22.20.5
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm list --depth 0
test -f dist/index.html
```

Inspect the manifest and dependency list for the exact approved direct
versions. Confirm the build outputs bundled assets and the TypeScript
projects complete successfully.

### 3. Fresh frozen installation

Create an isolated temporary directory with `mktemp -d`. Copy only the
frontend manifest, lockfile, HTML, Vite/TypeScript configuration, and `src/`
into it. Do not copy `node_modules`, `dist`, or unrelated repository files.
Record the lockfile checksum before installation with `sha256sum`.

Inside the temporary copy, run:

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
```

Assert the lockfile checksum is unchanged afterward. A cached pnpm store is
acceptable; the temporary project must start without an installed dependency
directory. Clean up only the exact temporary directory created for this
verification after stopping any processes that use it.

### 4. Automated development-server verification

First check that port 5173 is available. If occupied, report the conflict;
do not stop an unrelated process or silently select another port.

From `frontend/`, start a controlled background process running:

```bash
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Capture the process identity and stdout/stderr in temporary logs outside
tracked files. Use a maximum 60-second readiness deadline and detect early
process exit. Check readiness through successful HTTP responses from
`http://127.0.0.1:5173/`, for example with `curl --fail --silent`.
Log text alone is not sufficient evidence.

Register cleanup for success, failure, interruption, and timeout. Terminate
and reap the controlled server process and its Vite child processes. On
Windows, use process-tree-aware cleanup for the captured process when needed;
do not assume stopping only a pnpm wrapper necessarily stops Vite. Verify
port 5173 can be bound again after termination. Report cleanup failure and
do not mark the task complete if a server remains running.

### 5. Separate browser rendering verification

Use a separate controlled development-server run with the same host and
port, then inspect `http://127.0.0.1:5173/` in a browser. Confirm:

- `NexusCRM` renders as the application heading.
- `Frontend foundation is ready.` renders.
- The browser console contains no runtime errors.

Treat this as manual verification unless the implementation environment
already provides native browser capability. Do not add browser automation
or test dependencies to perform it. HTTP readiness and static source text
do not prove React rendering. Record the actual browser result separately;
if browser verification cannot be performed, report it as outstanding and
do not mark the task completed.

Stop this server, clean up its child processes, and verify port release using
the same procedure as automated startup verification.

### 6. Git and scope review

From the repository root:

```bash
git check-ignore frontend/node_modules frontend/dist
git diff --check
git status --short --branch --untracked-files=all
git diff
git diff -- frontend/AGENTS.md backend docker-compose.yml .env.example
```

Inspect new untracked files as well as the tracked diff. Confirm compiler
build metadata is under ignored `frontend/node_modules/.tmp/`, no generated
artifact is tracked, and no competing lockfile or workspace file exists.
Confirm frontend instructions and backend/database/Compose configuration
remain unchanged relative to the implementation baseline. Preserve any
pre-existing user modifications.

Review only the approved frontend bootstrap files, narrow ignore additions,
and required task-completion documentation. Repeat scope review after
completion documentation is updated.

## Learning Objectives

- Explain the roles of React, React DOM, TypeScript, Vite, and the React plugin.
- Understand how the HTML module entry, React root, and App component connect.
- Understand strict TypeScript, separate browser/Node typing contexts, and
  project-reference checking.
- Understand why Node type declarations must be selected intentionally and
  do not change the installed Node runtime.
- Understand why Vite transformation/building and TypeScript type checking
  are separate concerns, and why the build script performs both.
- Understand exact package versions, packageManager pinning, pnpm lockfiles,
  and frozen installation reproducibility.
- Distinguish installation, type checking, production building, HTTP
  readiness, and browser rendering evidence.
- Understand background-process ownership, bounded readiness checks, and
  cleanup of server process trees on Windows.
- Explain common failures: missing pnpm, incompatible Node, mismatched
  lockfile, TypeScript errors, occupied ports, browser runtime errors, and
  server processes left running.
- Explain why frontend bootstrap precedes architecture and testing tooling.

## Definition of Done

1. All acceptance criteria are satisfied.
2. Required verification succeeds, including fresh frozen installation,
   type checking, production build, automated server checks, and separate
   browser rendering verification.
3. Changes remain within task scope.
4. Git diff has been reviewed, including new files and generated-artifact
   protection.
5. The `## Completion` section accurately reflects the final result, with
   automated and manual verification evidence identified separately.
6. The task file is moved from `planning/tasks/active/` to
   `planning/tasks/completed/`.
7. The corresponding phase document marks this task as `— ✅ Completed`
   without marking overall Phase 00 complete or starting a later task.

## Completion

Status: Completed

Implemented:

- Created the private ESM React/TypeScript/Vite frontend and canonical
  pnpm-generated lockfile, with `packageManager: "pnpm@12.9.1"`.
- Installed exactly React and React DOM 19.3.0, Vite 8.3.2,
  @vitejs/plugin-react 6.1.1, TypeScript 6.0.2, @types/react and
  @types/react-dom 19.3.0, and @types/node 22.20.5.
- Added the approved dev, typecheck, build, and preview scripts.
- Configured strict browser and Node TypeScript projects with project
  references, `composite: true`, `noEmit: true`, and build metadata under
  ignored `node_modules/.tmp/`.
- Added the minimal, unstyled NexusCRM placeholder using createRoot and
  StrictMode, and the HTML entry and minimal React-plugin Vite configuration.
- Added only `/frontend/node_modules/` and `/frontend/dist/` ignore rules.

Verification:

- Automated prerequisite checks confirmed Node 22.13.0 and pnpm 12.9.1
  before implementation; no package manager was installed or activated.
- Exact dependency installation and repeated frozen-lockfile installation
  succeeded. SHA-256 remained
  `0c077f63981c1ab27d5f8f47399a853eb6cea714343c2ca0710e0fb6aef40db4`.
- `pnpm typecheck`, `pnpm build`, and `pnpm list --depth 0` passed.
  The build produced dist/index.html and bundled assets.
- A fresh isolated temporary project outside the repository, initially
  without node_modules or dist, passed frozen installation, type checking,
  and building with the same unchanged lockfile checksum.
- Automated controlled Vite startup on 127.0.0.1:5173 returned HTTP 200
  within the 60-second deadline. The owned process tree was terminated and
  port 5173 could be bound again; Windows required forced tree termination
  after the non-forced attempt failed.
- Manual browser verification was supplied by the developer: NexusCRM and
  "Frontend foundation is ready." rendered at http://127.0.0.1:5173/ with
  no console runtime errors. The developer stopped that verification server
  and confirmed port 5173 was released.
- frontend/AGENTS.md SHA-256 was unchanged:
  `035ce05bb71638d0f7b9ec35aa323e28856bd11f3068609e6e3638c628877e2e`.
- Generated-artifact ignores, competing-lockfile/workspace checks,
  TASK-0006/0007 boundary checks, whitespace checks, and complete Git scope
  review passed. Backend, database, Docker, and environment files remained
  unchanged.

Notes:

- Browser rendering was verified manually by the developer, separately from
  automated HTTP readiness, because native browser access was unavailable.
- Linting and automated component testing remain TASK-0007 scope; no
  placeholder checks or later-task dependencies were added.
- Temporary verification-file cleanup was blocked by execution policy during
  implementation. The isolated copy remains outside the repository in the
  Windows temporary directory; no verification server remains running.
- Only TASK-0005 is marked completed in Phase 00; the overall phase remains
  incomplete. No application changes were made during completion authoring.
- No commit or push was performed.
