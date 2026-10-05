# NexusCRM Agent Instructions

## Mission

NexusCRM is a production-oriented enterprise CRM and order-management
platform built as a learning project for enterprise full-stack engineering.

The system manages:

Customer
→ Lead
→ Opportunity
→ Quote
→ Order
→ Payment
→ Fulfillment

It also includes support tickets, reporting, notifications, inventory,
audit logging, and administrative functionality.

---

## Primary Engineering Goal

The purpose of this repository is not merely to produce working software.

It must also help the developer understand:

- Java
- Spring Boot
- Spring MVC
- Spring Security
- JPA / Hibernate
- PostgreSQL
- transaction management
- concurrency
- REST API design
- React
- TypeScript
- enterprise architecture
- automated testing
- production engineering

Do not hide important engineering concepts behind generated code.

---

## Architecture

Use a modular monolith.

Do NOT introduce microservices unless an accepted ADR explicitly changes
this decision.

Primary backend domains:

- auth
- user
- customer
- lead
- opportunity
- quote
- product
- inventory
- order
- payment
- support
- notification
- reporting
- audit

---

## Backend Technology

- Java 21
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- Hibernate
- PostgreSQL
- Flyway
- Redis
- RabbitMQ
- JUnit 5
- Mockito
- Testcontainers

---

## Frontend Technology

- React
- TypeScript
- Zustand
- React Router
- React Hook Form
- Tailwind CSS
- Vitest
- React Testing Library
- Oxlint

## Frontend Tooling

- pnpm is the required JavaScript package manager.
- Oxlint is the primary JavaScript/TypeScript linter.

---

## Infrastructure

- Docker
- Docker Compose
- Git

---

## Engineering Rules

- Never expose JPA entities directly from REST controllers.
- Controllers must not contain business logic.
- Authorization must be enforced on the backend.
- Frontend permission checks are UX only, not security.
- Database schema changes require Flyway migrations.
- Do not use Hibernate ddl-auto=update.
- Avoid unnecessary EAGER relationships.
- Avoid N+1 query problems.
- Validate all external input.
- Do not silently introduce dependencies.
- Do not silently change architecture.
- Do not refactor unrelated code while implementing a task.
- Prefer simple implementations over speculative abstractions.

## Package Management Rules

- Use pnpm for all JavaScript/TypeScript package management.
- Do not use npm, Yarn, or Bun.
- Do not create package-lock.json or yarn.lock.
- pnpm-lock.yaml is the canonical frontend lockfile.
- Use `pnpm add` and `pnpm remove` for dependency changes.
- Do not manually edit dependency versions in package.json when pnpm
  should perform the operation.
- Do not install dependencies globally when a project-local dependency
  is appropriate.

## Frontend Linting Rules

- Oxlint is the primary frontend linter.
- Do not introduce ESLint unless an accepted ADR explicitly requires it.
- Do not disable lint rules merely to make checks pass.
- Fix the underlying issue when practical.
- Any lint suppression must be narrow and justified.

---

## AI Workflow

The root agent acts as the development orchestrator for NexusCRM.

Its responsibility is to understand repository state, determine the correct
next action, coordinate specialist agents when useful, implement or delegate
work, verify results, and keep planning documentation synchronized with the
actual codebase.

Repository state is the source of truth.

Do not rely on previous chat history when the repository can answer the
question.

### Task Discovery

Before implementing work:

1. Read the root `AGENTS.md`.
2. Read the applicable nested `AGENTS.md` files.
3. Read the active phase document.
4. Inspect `planning/tasks/active/`.
5. Read the active task document if one exists.
6. If no active task exists, determine the next incomplete task from the
   active phase.
7. Read applicable ADRs.
8. Inspect relevant existing code and tests.
9. Identify dependencies, risks, acceptance criteria, and verification
   requirements.
10. Produce a short implementation plan.

Do not modify code until the task, relevant architecture, and existing
implementation have been understood.

### Execution

During implementation:

1. Stay strictly within task scope.
2. Follow existing project conventions.
3. Implement the smallest correct solution.
4. Add or update tests alongside the implementation.
5. Do not perform unrelated refactoring.
6. Do not introduce speculative abstractions.
7. Do not silently change architecture.
8. Do not silently introduce dependencies.
9. Delegate specialized or independent work only when doing so improves
   quality or reduces context complexity.
10. Do not use multiple agents merely to simulate activity.

### Verification

After implementation:

1. Compile affected projects.
2. Run task-specific verification.
3. Run relevant tests.
4. Run lint and typecheck where applicable.
5. Review the diff.
6. Check for architecture violations.
7. Check for security issues.
8. Check for data-integrity or transaction issues.
9. Request independent review when appropriate.
10. Perform final QA validation before task completion.
11. Update planning documentation only after required verification succeeds.

Never claim a command passed unless it was actually executed successfully.

If required verification cannot run because of an environment, dependency,
network, service, permission, or tooling limitation:

- do not report the verification as passed
- do not mark the task complete
- distinguish implementation failure from environment failure
- report the exact blocked command and reason
- preserve successful verification evidence from commands that did run
- do not weaken tests, lint rules, security checks, or build configuration
  merely to obtain a passing result

### Repair Loop

If implementation, review, or QA fails:

1. Inspect the failure.
2. Determine whether the issue is implementation, architecture, test,
   environment, or requirement related.
3. Fix issues that are within task scope.
4. Re-run the affected verification.
5. Request re-review when required.

Maximum automated repair cycles: 3.

After three unsuccessful repair cycles:

- stop automated repair
- keep the task incomplete
- clearly report the blocker
- explain what decision or information is required

Do not continue indefinitely attempting different fixes.

## Delegation

Specialist agents are tools used by the root orchestrator.

The root orchestrator remains responsible for:

- understanding the task
- selecting appropriate specialists
- coordinating work
- reconciling results
- verifying completion
- updating task and phase documentation

Do not delegate every task.

Use specialist agents only when their independent context or expertise adds
meaningful value.

### Available Specialist Roles

#### Software Architect

Use when work involves:

- architecture boundaries
- new modules
- public API design
- database schema design
- authentication or authorization architecture
- infrastructure changes
- concurrency
- transaction design
- significant dependencies
- cross-domain abstractions

The architect should analyze and recommend.

The architect should not implement code unless explicitly instructed.

#### Frontend Engineer

Use for substantial frontend work involving:

- multiple React components
- new screens or workflows
- client-side state
- forms
- data fetching
- accessibility-sensitive UI
- frontend architecture
- significant visual implementation

The frontend engineer should follow frontend-specific AGENTS.md files and
available frontend skills.

Do not delegate trivial frontend edits.

#### Backend Engineer

Use for substantial backend work involving:

- domain logic
- Spring services
- REST APIs
- persistence
- transactions
- database interaction
- migrations
- messaging
- security
- integration behavior

The backend engineer should follow backend-specific AGENTS.md files.

Do not delegate trivial backend edits.

#### QA Engineer

Use for independent validation after implementation.

The QA engineer should verify:

- acceptance criteria
- happy paths
- invalid input
- edge cases
- failure behavior
- regression risk
- integration behavior
- required verification commands

The QA engineer should not modify implementation files unless explicitly
authorized by the orchestrator.

#### Senior Code Reviewer

Use for independent review of non-trivial implementation.

The reviewer must not assume the implementation plan was correct.

The reviewer should inspect:

- correctness
- architecture
- maintainability
- unnecessary complexity
- error handling
- security
- transactions
- API contracts
- state management
- test coverage
- regression risk

The reviewer should not modify implementation files.

The reviewer must inspect the actual diff and enough surrounding code to
understand the behavior being changed. Review must be based on repository
state, not only on the implementer's summary.

### Delegation Rules

Do not allow multiple agents to modify the same files concurrently unless
the work is intentionally isolated.

Do not delegate sequentially dependent work in parallel.

Parallel delegation is appropriate only when work is genuinely independent.

Examples:

Good:

- frontend analysis and backend analysis of separate areas
- implementation and independent test-planning research
- separate modules that do not modify overlapping files

Bad:

- two agents editing the same service
- reviewer editing code while implementation is still changing
- QA modifying tests while implementation has not stabilized

## Review and QA Gates

A non-trivial task must pass independent review before completion.

A task is non-trivial when it includes one or more of:

- business logic changes
- persistence or database behavior
- API contract changes
- authentication or authorization
- state-management behavior
- concurrency or transaction behavior
- infrastructure or build configuration
- dependency changes
- multiple production files with behavioral changes
- bug fixes with meaningful regression risk
- security-sensitive behavior

Pure documentation changes, formatting-only changes, and similarly mechanical
edits may skip independent review unless the task explicitly requires it.

### Review Severity

Review findings use these levels:

- P0 — critical security, correctness, or data-loss issue
- P1 — must fix before completion
- P2 — meaningful non-blocking issue
- P3 — optional improvement

A task must not be marked complete with unresolved P0 or P1 findings.

P2 findings should either:

- be fixed when reasonably within task scope, or
- be documented with justification

P3 findings do not block completion.

### Review Flow

1. Implementation completes.
2. Developer verification passes.
3. Independent reviewer inspects the diff and surrounding code.
4. Blocking findings are fixed.
5. Affected verification is re-run.
6. Re-review occurs when necessary.
7. QA validates acceptance criteria.
8. Only then may task-completion documentation be updated.

### QA Gate

QA must validate behavior against the task requirements.

Compilation alone is not sufficient.

Passing unit tests alone is not sufficient.

QA should consider:

- acceptance criteria
- regression risk
- integration behavior
- edge conditions
- invalid input
- failure paths
- security-sensitive behavior
- persistence-sensitive behavior

QA returns either:

- PASS
- FAIL

A FAIL blocks task completion.

## Human Approval Gates

The orchestrator may proceed autonomously for routine development work.

### Green — Proceed Automatically

Examples:

- scoped implementation
- test additions
- bug fixes
- internal refactoring required by the task
- documentation updates
- non-destructive configuration changes

### Yellow — Proceed Automatically and Report

Examples:

- exact compatible versions of dependencies already approved by task scope
- reversible internal abstractions or implementation patterns
- non-destructive configuration choices
- development-only tooling configuration
- non-destructive database indexes

For reversible decisions clearly within an approved task, choose the safest
reasonable option and proceed without interrupting single-task execution.
Record every Yellow decision and its rationale for final human review.

Do not silently add out-of-scope dependencies, change approved architecture,
upgrade a required runtime, or bypass an explicit developer restriction or
task-specific approval gate. Stop if new information escalates a decision to
Red. Yellow autonomy does not authorize materially different work.

### Red — Stop for Human Decision

Stop and request developer input before performing:

- destructive database migrations
- deletion of substantial functionality
- replacement of authentication architecture
- irreversible infrastructure changes
- production credential or secret changes
- major architecture changes
- introducing microservices
- materially ambiguous business behavior
- actions that could affect production systems

When stopped:

1. explain the decision required
2. present the recommended option
3. explain meaningful alternatives
4. do not perform the blocked action

---

## Autonomous Single-Task Lifecycle

A request to execute or complete one task normally includes its full local
engineering lifecycle and PR preparation. Authoring-only, planning-only,
read-only, local-only, and explicit no-commit/no-push/no-PR requests retain
their narrower boundaries.

After implementation verification, independent review, QA, final verification,
and completion documentation pass, use `.codex/skills/pull-request/SKILL.md`
to create scoped commits, push the task branch, create a Draft PR against
`main`, mark the final verified PR Ready for Review, inspect external feedback,
and push valid scoped repairs after rerunning any stale local gates.

Do not implement directly on `main`, stage unrelated developer changes, merge
PRs, force push without separate explicit authorization, delete protected
branches, or begin the next task. Human review and merge remain the developer's
responsibility; local completion does not imply PR approval or merge.

Native Codex GitHub review and CodeRabbit provide external review. Do not add
an API-key-based OpenAI GitHub Action or assume reviewer availability. Report
pending/unavailable reviews accurately; never weaken required checks to obtain
a passing result. Use bounded observation and the shared repair limit of three
cycles across local and PR repairs.

The normal successful terminal state is
`TASK_EXECUTION_RESULT: READY_FOR_HUMAN_REVIEW`. Pending external review uses
`TASK_EXECUTION_RESULT: PR_REVIEW_PENDING`; blockers and Red gates retain their
explicit failure/decision states.

---

## Testing Rules

Every business rule should have automated tests.

Important workflows require integration tests.

Persistence-sensitive tests should use PostgreSQL through Testcontainers
when database behavior matters.

Bug fixes should include regression tests when practical.

---

## Learning Contract

This is a learning project.

For significant engineering concepts, explain:

1. What was implemented.
2. Why it is necessary.
3. How it works.
4. Alternatives considered.
5. Common failure modes.
6. How the concept could appear in a technical interview.

Generated code without understanding is not considered sufficient.

Apply the full learning explanation to significant concepts introduced or
changed by the task. Do not add repetitive tutorial material for routine or
mechanical changes that introduce no meaningful engineering concept.

---

## Definition of Done

A task is not complete merely because code was generated.

A task is complete when:

- acceptance criteria are satisfied
- code compiles
- relevant tests pass
- architecture rules are respected
- documentation is updated when necessary
- the diff contains no unrelated modifications
- the implementation can be explained by the developer
- required independent review has passed for non-trivial tasks
- QA validation has passed
- no unresolved P0 or P1 findings remain

## Task Completion Workflow

A task is not considered complete merely because implementation has finished.

Before marking a task as completed:

1. Verify all task acceptance criteria.
2. Run all verification required by the task and applicable AGENTS.md files.
3. Review the implementation for scope violations.
4. Confirm required independent review and QA gates have passed.
5. Update the task's `## Completion` section with:
   - final status
   - implemented changes
   - verification results
   - relevant notes or warnings
6. Move the task specification from:
   `planning/tasks/active/`
   to:
   `planning/tasks/completed/`
7. Update the corresponding phase document under `planning/phases/`
   so the completed task is marked:
   `— ✅ Completed`
8. Do not mark the next task as completed or in progress unless work on
   that task has actually begun.
9. Do not modify unrelated phases or tasks.
10. Report all task-completion documentation changes in the final summary.
11. Continue through the PR lifecycle when authorized by the execution request.
    Record PR state separately from local task completion. Any PR repair that
    invalidates completion evidence must rerun affected gates and refresh that
    evidence before returning the PR to human review.

A task must not be marked completed when required verification fails,
cannot be executed, or is inconclusive.

When verification is blocked by the environment, keep the task active and
record the task as blocked or awaiting verification rather than completed.

Task completion documentation is part of the task itself and does not
require a separate follow-up task.
