# TASK-0006 — Frontend Architecture Foundation

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Establish the minimal frontend architecture using React Router, Zustand, React Hook Form, and Tailwind CSS. Demonstrate their integration through a small technical foundation screen without introducing CRM functionality.

## Context

TASK-0005 established the React 19.3.0, TypeScript 6.0.2, Vite 8.3.2 frontend with pnpm 12.9.1, strict TypeScript project references, and a minimal placeholder.

The frontend currently has no router, global state, form infrastructure, or styling integration. TASK-0006 introduces these foundations before business screens.

TASK-0005 is the direct prerequisite. Backend and database prerequisites are completed but are not required to run this frontend task.

No accepted ADR currently establishes a frontend layout or routing design. `docs/ARCHITECTURE.md` is empty. The choices below are task-local foundation decisions, not a new application-wide domain architecture.

## Requirements

1. Preserve the existing frontend runtime, package-manager pin, scripts, strict TypeScript settings, project references, composite mode, noEmit, and ignored build-info locations.
2. Add React Router, Zustand, React Hook Form, Tailwind CSS, and only the integration dependency needed to connect Tailwind to Vite.
3. Select compatible exact dependency versions during implementation planning, document dependency scopes and compatibility, and obtain approval before installation. Use pnpm add with exact pins and retain the canonical lockfile.
4. Establish minimal separation between application composition/routing, pages, and shared client state. Create only files required by actual behavior; do not pre-create business feature directories.
5. Use client-side browser-history routing:
   - `/`: retain the NexusCRM heading and foundation-ready message.
   - `/foundation`: a technical integration screen.
   - Unmatched paths: a simple not-found page with a link home.
6. Provide a small semantic application shell with links to Home and Foundation and a routed content region. Verify direct navigation, refresh, and browser history.
7. Use Zustand for one non-persistent shared UI preference: compact spacing. Expose an accessible toggle on the foundation screen and apply the preference to the shared shell.
8. Keep that preference across client-side navigation. A full reload resets it. Do not add persistence middleware, storage, server state, or authentication state.
9. Use React Hook Form for a non-business demonstration form:
   - One labeled field, “Preview label.”
   - Required value, with a maximum length of 40 characters.
   - Invalid submission displays associated errors.
   - Valid submission displays the submitted value locally.
   - No network request, storage, or business operation occurs.
10. Integrate Tailwind through Vite and a stylesheet imported by the frontend entry point. Use modest utility styling for spacing, readable content, controls, and visible focus states.
11. Keep the technical screen clearly identified as foundation verification, not a CRM feature or reusable business workflow.
12. Use Git Bash as the primary verification shell.
13. Require independent architecture assessment during implementation planning, independent code review, and QA validation before implementation completion.

### Architecture and Approval Notes

- Library choices are established by Phase 00.
- The minimal technical screen and version-selection approval gate were selected during task authoring.
- Exact package versions and the concrete router/Tailwind integration must be reviewed during implementation planning.
- Avoid framework/server rendering, route loaders/actions, speculative providers, generic form abstractions, or design-system architecture.
- Any significant departure from this foundation requires approval rather than silent implementation.

## Constraints

- Do not implement authentication, permissions, CRM screens, business rules, or domain state.
- Do not add API clients, backend integration, TanStack Query, or server-data caching.
- Do not modify backend, database, Docker Compose, environment files, frontend instructions, or unrelated documentation.
- Do not introduce Oxlint, ESLint, Vitest, React Testing Library, Playwright, Puppeteer, or other TASK-0007 tooling.
- Do not add placeholder lint/test scripts.
- Do not add component libraries, icon packages, schema-validation dependencies, or additional state/form packages.
- Do not upgrade existing bootstrap dependencies unless a concrete compatibility conflict is reported and separately approved.
- Use pnpm exclusively; do not install or activate package managers automatically.
- Do not introduce competing lockfiles or workspace configuration.
- Preserve developer-authored changes. Do not repair historical documentation inconsistencies.
- Do not commit or push without explicit authorization.

## Expected Result

The frontend has a small routed application shell, working shared UI state, a validated technical form, and compiled Tailwind styling.

These capabilities work independently of backend and database services. No business functionality or TASK-0007 infrastructure is introduced.

## Acceptance Criteria

- [x] Approved new dependencies use exact compatible versions and correct scopes.
- [x] pnpm remains pinned to 12.9.1 and frozen installation succeeds without changing the lockfile.
- [x] Existing strict TypeScript configuration, project references, composite mode, noEmit, and build-info locations remain intact.
- [x] Home, Foundation, and unmatched-path behavior render correctly.
- [x] Direct navigation and refresh work on `/foundation` through the local Vite server.
- [x] Navigation and browser Back/Forward work without unintended full-page reloads.
- [x] Compact spacing changes the shared shell and survives client-side navigation.
- [x] Reload resets the non-persistent preference.
- [x] Empty and overlength form submissions show accessible errors without producing a successful preview.
- [x] A valid submission displays its value locally without a network request.
- [x] Tailwind utilities produce observable styling in development and production preview.
- [x] Navigation, toggle, and form controls support keyboard interaction and visible focus.
- [x] Typecheck and production build pass.
- [x] Development-server HTTP readiness, process cleanup, and port release pass.
- [x] Browser verification finds no runtime errors.
- [x] Generated artifacts remain ignored; no competing package-manager files exist.
- [x] Backend, database, Docker, environment files, and frontend instructions remain unchanged.
- [x] Independent review has no unresolved P0/P1 findings and QA passes.
- [x] No CRM functionality or TASK-0007 tooling is introduced.

## Verification

### Prerequisites and Build

From Git Bash:

```bash
git status --short --branch --untracked-files=all
node --version
pnpm --version

cd frontend
pnpm install --frozen-lockfile
pnpm typecheck
pnpm build
pnpm list --depth 0
cd ..
```

Require pnpm 12.9.1 and compatibility with the existing Node/Vite runtime. Stop on unavailable prerequisites rather than installing or substituting tools.

Record the lockfile checksum before and after frozen installation and require equality. Inspect dependencies against the approved implementation plan.

### Controlled Runtime Verification

Start:

```bash
cd frontend
pnpm dev --host 127.0.0.1 --port 5173 --strictPort
```

Check that the port is initially free. Capture owned process identities and stdout/stderr. Require HTTP readiness within 60 seconds and detect early process failure.

Verify production styling separately using the built application:

```bash
pnpm preview --host 127.0.0.1 --port 4173 --strictPort
```

Use bounded readiness and owned-process cleanup for both servers. Do not terminate unrelated processes. Confirm each port is released afterward.

### Browser Scenarios

Use native browser capability if available; otherwise require explicitly attributed manual verification:

1. Open Home and confirm both existing placeholder strings.
2. Navigate to Foundation, refresh it, and exercise Back/Forward.
3. Open an unmatched path and return home.
4. Toggle compact spacing, navigate away and back, then reload to verify reset.
5. Submit an empty value, a value longer than 40 characters, and a valid value.
6. Confirm invalid submissions show associated errors and valid submission shows only a local preview.
7. Verify keyboard navigation, focus visibility, and labeled controls.
8. Inspect the console for runtime errors and confirm no backend requests.
9. Confirm Tailwind styling also appears in production preview.

HTTP readiness alone does not prove these behaviors. Required browser verification that remains unavailable blocks completion.

### Final Scope and QA

```bash
git check-ignore frontend/node_modules frontend/dist
git diff --check
git status --short --branch --untracked-files=all
git diff
git diff -- frontend/AGENTS.md backend docker-compose.yml .env.example
```

Inspect new files, dependency changes, and compiled artifacts. Confirm TypeScript metadata remains ignored and no alternative lockfiles or TASK-0007 packages exist.

Compare preserved-file checksums with the implementation baseline. Obtain independent review and QA evidence against the final implementation.

Linting and automated component tests are deferred to TASK-0007; do not claim they ran.

## Learning Objectives

- Explain routing, nested composition, browser history, and local-server fallback.
- Distinguish shared client state, local component state, form state, and server state.
- Explain why the UI preference belongs in Zustand but submitted preview data does not.
- Understand React Hook Form registration, validation, and accessible error handling.
- Explain Tailwind’s Vite integration and development versus production CSS generation.
- Understand dependency compatibility, exact pins, and reproducible installation.
- Distinguish build evidence, HTTP readiness, browser verification, code review, and QA.
- Recognize common failures involving deep links, stale state, validation, missing CSS, inaccessible controls, and orphaned server processes.

## Definition of Done

1. All acceptance criteria are satisfied.
2. Required installation, typecheck, build, runtime, and browser verification succeeds.
3. Independent review passes with no unresolved P0/P1 findings; QA passes.
4. Changes remain within TASK-0006 scope and the complete Git diff is reviewed.
5. Completion records actual implementation, verification, review, QA, and warnings.
6. Move the task from active to completed only after all required gates pass.
7. Mark only TASK-0006 `— ✅ Completed` in Phase 00; leave the overall phase incomplete and TASK-0007 untouched.

## Completion

Status: Completed

Implemented:

- Added the approved exact runtime dependencies: `react-router@7.18.4`,
  `zustand@5.0.15`, and `react-hook-form@7.89.0`.
- Added the approved exact development dependencies: `tailwindcss@4.3.3`
  and `@tailwindcss/vite@4.3.3`; updated the canonical pnpm lockfile.
- Added declarative BrowserRouter composition, a persistent navigation shell,
  Home and Foundation pages, and unmatched-path handling.
- Added only a nonpersistent shared compact-spacing preference to Zustand.
- Added a local technical preview form with required/max-40 validation,
  associated accessible errors, and preview clearing on invalid submission.
- Integrated Tailwind through Vite and the entry stylesheet with literal
  utility classes. Preserved the bootstrap runtime, scripts, TypeScript
  configuration, frontend instructions, and all backend/infrastructure files.

Verification:

- Git Bash prerequisite checks confirmed Node 22.13.0 and pnpm 12.9.1.
- Exact dependency installation, `pnpm install --frozen-lockfile`,
  `pnpm typecheck`, `pnpm build`, and `pnpm list --depth 0` passed.
- Frozen installation preserved lockfile SHA256
  `332AE9D92CACAE449FDEDCCD1806CD97945846E2FD5059BBAB0DBB1CC74DDF15`.
- Controlled development and production-preview servers returned HTTP 200
  within the 60-second deadline. Owned server processes were terminated and
  ports 5173 and 4173 were confirmed released.
- Orchestrator-executed native-browser checks passed: Home strings,
  Foundation navigation/refresh, Back/Forward, unmatched paths, preference
  survival across navigation and reset on reload, empty/overlength errors,
  valid local preview (including the 40-character boundary), invalid-submit
  preview clearing, keyboard controls, associated errors, and visible focus.
- Native-browser console inspection found no development or production
  runtime errors. Production computed padding changed from 32px to 16px when
  compact spacing was enabled, confirming both generated utility states.
- Source inspection confirmed local-only submission with no backend/network
  API calls, storage, CRM behavior, or TASK-0007 tooling.
- Protected-file checksums matched the baseline, including frontend
  instructions, TypeScript configuration, backend, Compose, and environment
  files. Generated artifacts/build metadata are ignored; no competing
  lockfiles or workspace configuration were introduced.
- Independent code review returned `APPROVE` with no findings; independent
  QA returned `PASS` after its own frozen install, typecheck, build, HTTP,
  process-cleanup, dependency, and scope verification.
- Git whitespace and complete tracked/untracked scope reviews passed.

Notes:

- Exact dependency versions and integration choices received human approval.
  React Router 7.18.4 preserves the existing Node 22.13.0 runtime rather than
  introducing React Router 8.x or a Node upgrade.
- Architecture assessment approved the implementation with constraints on
  state ownership, persistent shell composition, accessible validation,
  invalid-preview clearing, and statically discoverable Tailwind classes.
- QA's browser surface was unavailable in its separate agent context; its
  browser acceptance results explicitly use the orchestrator's actual native
  browser evidence, independently reconciled against the implementation.
  No network-capture claim is made; no-request behavior is supported by the
  local submission implementation and inspected absence of network calls.
- Linting and automated component-test infrastructure remain TASK-0007 scope
  and were not run or added. Phase 00 remains incomplete.
- Existing developer-authored untracked skill files were preserved.
- No unresolved review/QA findings remain. No commit, push, merge, or pull
  request was performed.
