# TASK-0007 — Frontend Quality & Testing Tooling

## Phase

PHASE-00 — Foundation

## Status

Completed

## Objective

Establish repeatable frontend linting and automated component testing that
protect the existing technical foundation without adding application features.

## Context

TASK-0005 established React, strict TypeScript project references, Vite and
pnpm. TASK-0006 established BrowserRouter routes, a persistent shell, a
nonpersistent Zustand compact-spacing preference, a React Hook Form preview,
and Tailwind. Both prerequisites are completed and merged. The current frontend
has no lint/test scripts or automated tests.

The development runtime is Node 22.13.0 and pnpm is pinned to 12.9.1.
Vite is 8.3.2, React is 19.3.0, and TypeScript is 6.0.2. Architecture documentation
and accepted ADRs do not establish another frontend testing design.
TASK-0008 owns backend testing; TASK-0009 owns general development documentation.

## Requirements

1. Preserve the current runtime, package manager, runtime dependencies,
   routing/state/form ownership, and production UI behavior.
2. Add exact, project-local development dependencies through pnpm only:

   | Package | Version | Purpose |
   |---|---|---|
   | `oxlint` | `1.86.0` | Primary frontend linter |
   | `vitest` | `5.0.3` | Test runner compatible with existing Vite/Node |
   | `@testing-library/react` | `16.3.3` | Render and query React components |
   | `@testing-library/dom` | `10.4.2` | Required Testing Library peer |
   | `@testing-library/user-event` | `14.6.7` | User-oriented interactions |
   | `@testing-library/jest-dom` | `7.0.1` | DOM assertions integrated with Vitest |
   | `jsdom` | `29.0.1` | DOM test environment compatible with Node 22.13.0 |

   Newer jsdom 30.1.2 requires a newer Node runtime; do not upgrade Node to
   adopt it. Confirm resolved engines/peers before installing. Preserve existing
   direct dependency versions; allow pnpm-generated canonical lockfile updates
   for these additions. Require checksum stability during subsequent frozen
   verification, not across the initial dependency-add operation.
   Oxlint 1.86.0 avoids the release-age exceptions and prohibited workspace
   file that pnpm generated for the newly published 1.87.0 during implementation.
   Do not retain or introduce release-age exceptions to bypass this constraint.
3. Add `lint` using Oxlint over frontend source, tests, and Vite/test config,
   with warnings treated as failure. Configure the built-in TypeScript, React,
   and JSX accessibility checks and correctness rules. Do not introduce ESLint,
   custom plugins, blanket suppressions, or formatting churn.
4. Add non-watching `test` (`vitest run`) and interactive `test:watch`
   (`vitest`). Preserve `dev`, `typecheck`, `build`, and `preview`.
5. Configure Vitest with jsdom, explicit test API imports, DOM matchers,
   reliable DOM cleanup and isolated test state. Tests must not require backend,
   Docker, PostgreSQL, browser downloads, or a running development server.
6. Include test/setup code in strict TypeScript checking. Keep project
   references, composite mode, noEmit, and ignored build-info locations.
   Ensure production entry points do not import test modules.
7. Add behavioral tests using actual existing components and state:
   - Home renders NexusCRM and its foundation-ready message.
   - In-app Home/Foundation navigation and unknown-route recovery work through
     the existing router/shell; do not mock routing.
   - Compact spacing changes the shared shell, survives client navigation,
     and can be switched off. Reset the shared store between tests.
   - Empty and over-40 submissions produce associated accessible errors and
     no successful preview; valid input, including the 40-character boundary,
     produces the local preview.
   - Invalid submission after a valid one clears the previous preview.
8. Tests must use labeled/role queries and awaited user interactions. Avoid
   snapshots as sole proof, arbitrary sleeps, production-only test hooks,
   trivial tautologies, and replacing the libraries under test with mocks.
9. Prove fresh frozen installation, lint, typecheck, tests, and build from an
   isolated temporary source copy outside the repository, without copying
   node_modules/dist. Confirm the lockfile checksum is unchanged.
10. Prove lint and test failures return nonzero using temporary failing probes
    in the isolated copy only. Remove the probes and rerun all checks.
11. Keep generated Vitest artifacts ignored with narrowly scoped rules if
    necessary. Do not commit caches or test/build reports.

### Architecture and Approval Notes

Phase 00 establishes the required quality libraries. Exact compatible pins,
jsdom, DOM peers/matchers and user-event are task-local Yellow choices within
the approved tooling scope. Dependency metadata must demonstrate compatibility.
Use a small explicit test setup and colocated tests; no speculative test
framework abstraction, coverage platform, or domain architecture is required.
Independent task-spec review and architecture assessment precede implementation;
independent code review and QA precede completion. Any material compatibility
conflict or runtime upgrade requires a human decision.

## Constraints

- Do not introduce CRM functionality, new routes, state persistence, APIs,
  or new UI behavior. Only necessary lint-correctness fixes may touch existing
  production code; document and test any behavioral correction.
- Do not modify backend, database, Docker, environment files, frontend
  instructions, previous completed tasks, or unrelated policy/documentation.
- Do not introduce ESLint, Jest, Playwright, Puppeteer, Vitest browser mode,
  coverage dependencies/thresholds, CI workflows, formatting tools, or workspace
  configuration. Real-browser visual/CSS/history verification is not replaced
  by jsdom; existing TASK-0006 browser evidence remains separately classified.
- Do not weaken strict TypeScript, lint rules, or test assertions to get a pass.
- Do not install/activate global tools or another package manager. Stop if
  pnpm 12.9.1 is unavailable. Do not upgrade existing bootstrap dependencies.
- Leave Phase 00 incomplete and do not begin TASK-0008 or later work.

## Expected Result

A developer can run meaningful linting, strict type checking, non-watching
component tests and a production build using standard pnpm commands. Tests
protect existing foundation behavior independently of external services and
fail on regressions. The production frontend remains unchanged in functionality.

## Acceptance Criteria

- [x] Exact compatible development dependencies and pnpm 12.9.1 are used;
      existing runtime/bootstrap dependencies and canonical lockfile are preserved.
- [x] Fresh frozen installation succeeds without changing the lockfile.
- [x] `pnpm lint` checks source/tests/config and exits zero with no warnings;
      an intentional isolated lint violation exits nonzero.
- [x] `pnpm test` executes discovered tests once and exits; an intentional
      failing assertion in the isolated copy exits nonzero.
- [x] `test:watch` invokes Vitest watch mode; no fake passing scripts exist.
- [x] Home, navigation, unmatched-path recovery, shared preference, required/
      overlength/boundary validation, valid preview and invalid-preview clearing
      have passing user-oriented automated tests.
- [x] Accessible field/error association is asserted, and DOM/store/history
      state is reset so repeated runs pass without order-dependent leakage.
- [x] Test/setup/config files participate in strict TypeScript checks;
      project references/composite/noEmit and build-info locations remain intact.
- [x] `pnpm typecheck` and `pnpm build` pass; built assets contain no test
      entry modules or test-runner code.
- [x] Fresh isolated source copy passes all four quality commands and cleanup
      removes only the owned temporary directory.
- [x] Generated artifacts are ignored, no alternative lockfile is introduced,
      protected files remain unchanged, and Git whitespace/scope checks pass.
- [x] Independent code review has no unresolved P0/P1 findings and QA passes.
- [x] No new production feature, backend testing, CI, or later-task work exists.

## Verification

Use Git Bash as the authoritative shell. From the repository root:

```bash
git status --short --branch --untracked-files=all
node --version
pnpm --version
cd frontend
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test
pnpm build
pnpm list --depth 0
test -f dist/index.html
cd ..
```

Inspect package engines/peers, manifest scripts, exact pins and resolved
dependencies. Record lockfile SHA-256 before/after frozen installation.
Review test names/assertions against each behavior above. Confirm tests execute
without external services and are not skipped; inspect setup cleanup and state
reset. Inspect watch-script configuration rather than leaving a watch process
running. jsdom provides DOM behavior evidence, not browser layout/CSS proof.

Create an owned temporary directory with `mktemp -d` outside the repository.
Copy only frontend manifest/lockfile, HTML, source, and build/test/lint/TypeScript
configs. Record checksum; run frozen installation and the four quality commands.
Add a deliberate debugger statement in an isolated source probe, require lint
to fail, then remove the probe. Add an isolated failing assertion, require tests
to fail, remove it, and rerun lint/typecheck/test/build. Do not mutate repository
application code for negative probes. Verify lockfile equality throughout.
Clean up only the resolved exact temporary directory created by verification.

From the root, review tracked and untracked changes and protected-file hashes:

```bash
git check-ignore frontend/node_modules frontend/dist frontend/.vitest
git check-ignore -v .env
git ls-files --error-unmatch .env  # must fail: local secret is untracked
git diff --check
git status --short --branch --untracked-files=all
git diff
git diff -- frontend/AGENTS.md backend docker-compose.yml .env.example
```

Inspect production build entry/assets for test modules and test-runner imports.
Check for competing package-manager lockfiles/workspace files and generated
artifacts. Required verification blocked by tooling or network remains blocked,
not passed. Obtain independent review then QA against the final diff.

## Learning Objectives

- Distinguish lint correctness checks, TypeScript checking, DOM behavioral
  tests and production builds; explain what each cannot prove.
- Explain Vitest/Vite integration, jsdom, explicit imports, matchers and cleanup.
- Write accessible user-oriented queries and await asynchronous form updates.
- Isolate router history, shared Zustand state and mounted DOM between tests.
- Explain frozen lockfiles, engine/peer compatibility and exact tooling pins.
- Demonstrate that quality gates fail on real violations rather than fake scripts.

## Definition of Done

1. All acceptance criteria are satisfied and required verification passes.
2. Independent review approves with no unresolved P0/P1; QA returns PASS.
3. Changes remain within TASK-0007; full Git scope and whitespace are reviewed.
4. Completion records actual changes, pins, verification, review, QA and warnings.
5. Move this task from active to completed only after all local gates pass.
6. Mark only TASK-0007 `— ✅ Completed` in Phase 00; leave the phase incomplete.
7. Complete authorized PR preparation under task-execution; do not merge or
   begin the next task. Distinguish local completion from external PR review.

## Completion

Status: Completed (local engineering gates passed on 2026-10-06)

Implemented:

- Added exact development pins: Oxlint 1.86.0, Vitest 5.0.3, React Testing
  Library 16.3.3, DOM Testing Library 10.4.2, user-event 14.6.7, jest-dom 7.0.1,
  and jsdom 29.0.1 using pnpm 12.9.1. Existing direct dependencies are unchanged.
- Added real lint, non-watching test and interactive watch scripts, Oxlint
  configuration, and jsdom Vitest configuration integrated with Vite.
- Added explicit DOM cleanup and ten actual-application behavioral tests for
  routing, persistent shell, shared spacing, accessible form validation,
  boundary input, submitted preview and invalid-preview clearing.
- Replaced only the preview's explicit status paragraph with native `output`
  and block layout to satisfy the accessibility lint rule without suppression.
- Added the narrowly scoped Vitest artifact ignore rule. Strict TypeScript
  project references/composite/noEmit/build-info configuration is unchanged.

Verification:

- Node 22.13.0 and pnpm 12.9.1 verified; approved dependency engines and peers
  inspected. Frozen installation succeeded with unchanged lockfile SHA-256:
  `94E6FF727346CB71B278A50199FDACA42160F0DC420321C7E93D2A548AEAA3E4`.
- Repository lint, typecheck, ten component tests and production build passed.
  Independent QA repeated frozen installation, lint, typecheck, two ten-test
  runs and build successfully against the same implementation worktree.
- Fresh isolated installation, lint, typecheck, all ten tests and build passed.
  Isolated debugger and false-assertion probes each exited nonzero as required;
  probes were removed and the clean four-command rerun passed. Lockfile unchanged.
- Task-spec review: APPROVED after two specification revisions; architecture:
  APPROVED. Independent code review: APPROVE with no severity findings.
- QA: PASS after independently confirming the user-removed verification
  directory is absent and reconciling all thirteen acceptance criteria.
  No implementation defects or unresolved review findings identified.
- Resume final verification on 2026-10-06: frozen install, lint, typecheck,
  two ten-test runs and production build passed; lockfile checksum unchanged.
  The implementation is unchanged from the independently approved version.
- Git whitespace, protected-file scope, local-secret and generated-artifact
  checks passed. No alternative lockfile, workspace, release-age exception,
  production test import or later-task feature was introduced.
- `frontend/AGENTS.md` SHA-256 remained
  `035CE05BB71638D0F7B9EC35AA323E28856BD11F3068609E6E3638C628877E2E`.

Notes:

- Initial isolated-copy cleanup was blocked by execution policy, not a
  frontend implementation failure. The owned verification directory was:
  `C:/Users/TondoSolutionsEduard/AppData/Local/Temp/nexuscrm-task0007-bdabbe43088245fda79b13b9e144da4f`.
- pnpm clean removed installed packages; remaining source/configuration/dist
  and generated caches required manual cleanup after the validated literal-path
  deletion was denied. No alternative deletion mechanism bypassed that denial.
  The developer removed the exact owned directory. On 2026-10-06 both the
  orchestrator and independent QA executed `Test-Path -LiteralPath` for it and
  received `False`, resolving the last blocker without implementation changes.
- Shared repair history is `.codex/repair-history/TASK-0007.md`: two of three
  substantive cycles consumed. Verification-only reruns do not reset this count.
- Task moved to completed and only TASK-0007 is marked completed in Phase 00;
  overall phase status remains incomplete. TASK-0008 and later work not started.
- This records local engineering completion, not external PR approval or merge.
  Authorized publication and external review are tracked separately in the PR
  and shared repair ledger. No merge is authorized by this task execution.
