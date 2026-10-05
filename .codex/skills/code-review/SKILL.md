
### `.codex/skills/code-review/SKILL.md`

```md
---
name: code-review
description: Independently review a NexusCRM local implementation diff for correctness, security, architecture, regression risk, test quality, and task compliance without modifying files. Use for local implementation review; use pull-request-review for GitHub pull requests.
---

# Code Review

Use this skill for independent review of local NexusCRM implementation.

For GitHub pull requests requiring a base SHA, head SHA, and merge
recommendation, use `pull-request-review` instead.

This skill is strictly read-only.

Do not modify:

- implementation
- tests
- planning documents
- task state

Do not commit.

Do not push.

Do not fix findings yourself.

The orchestrator owns repair.

## Objective

Determine whether the current implementation is technically sound and ready
for QA.

Do not assume:

- the implementation plan was correct
- architecture review was correct
- the implementer's summary is accurate
- compilation proves correctness
- passing tests prove correctness

Review actual repository state.

## Procedure

1. Read:
   - root `AGENTS.md`
   - applicable nested `AGENTS.md`
   - referenced task
   - corresponding phase
   - applicable accepted ADRs

2. Inspect:
   - current Git state
   - staged changes
   - unstaged changes
   - untracked files
   - actual implementation diff
   - relevant surrounding code
   - callers
   - tests

3. Establish the implementation baseline and current worktree/revision where
   possible.

4. Evaluate the implementation independently from the approved plan.

5. Confirm each potential finding against:
   - surrounding code
   - existing safeguards
   - tests
   - repository rules
   - actual task requirements

6. Report only concrete issues introduced or materially exposed by the current
   implementation.

Do not manufacture findings merely to produce feedback.

## Scope Review

Check for:

- unrelated refactoring
- unrelated formatting churn
- unexpected generated files
- unrelated dependency changes
- unrelated configuration changes
- accidental lockfile changes
- task scope violations

Do not flag supporting changes that are legitimately necessary for the task.

## Correctness Review

Check relevant:

- conditions
- state transitions
- nullability
- assumptions
- calculations
- duplicate operations
- partial updates
- stale state
- error handling
- lifecycle behavior
- API behavior
- acceptance criteria

Look for credible failure scenarios.

Do not report hypothetical concerns without evidence.

## Architecture Review

Check compliance with:

- modular-monolith boundaries
- domain ownership
- accepted ADRs
- root and nested `AGENTS.md`
- controller/service/repository responsibilities
- frontend state ownership
- existing architectural conventions

A code review may identify an architecture violation even when an earlier
architecture review approved the plan.

## Security Review

Inspect relevant:

- authentication
- authorization
- object-level access
- sensitive data
- validation
- secret handling
- trust boundaries
- unsafe input
- privilege escalation

Frontend authorization is never sufficient security enforcement.

## Backend Review

Where applicable, inspect:

- API contracts
- DTO boundaries
- transaction behavior
- persistence behavior
- Flyway changes
- constraints
- indexes
- N+1 risks
- relationship loading
- concurrency
- idempotency
- retry behavior

## Frontend Review

Where applicable, inspect:

- TypeScript safety
- component behavior
- state ownership
- Zustand usage
- form behavior
- API assumptions
- loading/error/empty states
- accessibility
- stale async behavior
- duplicate requests
- route behavior

Avoid subjective design commentary unless it materially affects usability,
accessibility, or project conventions.

## Test Review

Evaluate whether tests actually protect behavior.

Check:

- important rules are tested
- regression scenarios are covered where practical
- tests would fail if behavior broke
- mocks do not make tests meaningless
- assertions check outcomes rather than implementation details
- persistence-sensitive behavior uses appropriate integration testing when
  required

Do not require tests for trivial mechanical changes without a real regression
risk.

## Dependency and Configuration Review

When dependencies or configuration changed, check:

- necessity
- scope
- lockfile consistency
- environment assumptions
- security implications
- operational impact
- whether the task authorized the change

## Finding Severity

Use exactly one severity per finding.

### P0 — Critical

Examples:

- severe exploitable security vulnerability
- likely data corruption
- likely data loss
- catastrophic correctness failure

P0 blocks completion.

### P1 — Must Fix

Examples:

- definite correctness defect
- meaningful security defect
- broken acceptance criterion
- serious transaction issue
- serious concurrency issue
- unintended API break
- material authorization bug

P1 blocks completion.

### P2 — Meaningful Non-Blocking

Examples:

- maintainability problem
- limited edge-case defect
- meaningful test weakness
- moderate performance problem
- architectural debt that does not make the task unsafe

P2 normally does not block completion unless repository policy says otherwise.

### P3 — Optional

Examples:

- readability improvement
- minor simplification
- optional cleanup
- non-essential polish

Do not inflate subjective preferences into higher severities.

## Finding Requirements

Each finding must contain:

- severity
- file
- location
- failure scenario or concrete issue
- impact
- recommended correction

Prefer precise findings.

Bad:

> This service could be improved.

Good:

> P1 — `OrderService.java`, `processPayment()`  
> Two concurrent requests can both observe the order as `PENDING` before either
> commits the state transition. This permits duplicate payment processing.
> Protect the invariant using an appropriate idempotency or persistence-level
> concurrency mechanism.

## False-Positive Control

Before reporting a finding:

1. inspect surrounding code
2. inspect callers
3. inspect existing validation
4. inspect applicable tests
5. inspect repository rules
6. verify the problem is introduced or materially exposed by this change

Do not flag a concern if another layer already handles it correctly.

Do not report unrelated pre-existing problems as blocking findings.

## Read-Only Verification

Useful inspection commands include:

```bash
git status --short --untracked-files=all
git diff --stat
git diff
git diff --cached
rg "<relevant-pattern>"