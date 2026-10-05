---
name: task-execution
description: Execute one NexusCRM task through planning, implementation, verification, independent review, QA, completion documentation, and a human-review-ready pull request. Respect narrower authoring, planning, local-only, and explicit Git restrictions.
---

# Task Execution

Use this skill when asked to:

- execute a NexusCRM task
- continue the current task
- resume development
- continue the current phase
- implement the next task
- complete an active task
- continue the project

This skill is the primary development orchestration workflow.

It coordinates specialized skills and agents but does not replace their
domain-specific instructions.

The root `AGENTS.md` remains the repository-wide policy authority.

---

# Objective

Move exactly one development task from its current repository state toward
verified completion while preserving:

- task scope
- repository architecture
- developer-authored work
- accepted ADRs
- security
- data integrity
- test quality
- learning value
- accurate planning state

The orchestrator is responsible for the overall workflow.

Specialist agents and skills provide focused implementation, review, or
validation.

Only the orchestrator may declare the task complete.

---

# Core Workflow

The standard task lifecycle is:

```text
Discover
   ↓
Understand
   ↓
Architecture Gate
   ↓
Plan
   ↓
Implementation
   ↓
Developer Verification
   ↓
Independent Code Review
   ↓
Repair if required
   ↓
QA Validation
   ↓
Repair if required
   ↓
Final Verification
   ↓
Completion Documentation
   ↓
pull-request skill
   ↓
Scoped Commit and Push
   ↓
Draft PR → Ready for Review
   ↓
External Review and Scoped Repairs
   ↓
READY_FOR_HUMAN_REVIEW
```

Do not skip required gates merely because earlier stages appear successful.

---

# 1. Load Repository Instructions

Before selecting or executing work, read:

1. root `AGENTS.md`
2. applicable nested `AGENTS.md` files
3. current phase document
4. active task documents
5. applicable accepted ADRs
6. relevant project documentation
7. relevant source and tests
8. current Git worktree state

Use the instruction precedence defined by the root `AGENTS.md`.

Do not rely on conversation history when repository state can answer the
question.

---

# 2. Inspect Git State

Before changing files, inspect:

```bash
git status --short --untracked-files=all
git diff --stat
git diff
git diff --cached
```

Determine whether the worktree already contains:

- developer-authored changes
- unfinished task work
- generated artifacts
- unrelated modifications
- staged changes
- untracked files

Preserve developer-authored changes.

Do not discard, reset, overwrite, or clean unrelated work.

Do not use destructive Git commands such as:

```bash
git reset --hard
git clean -fd
```

or equivalent destructive restore/checkout operations unless the developer
explicitly authorizes them.

Existing modifications may represent work that must be incorporated rather
than replaced.

---

# 3. Determine the Active Task

## Reconcile an Unfinished PR Lifecycle First

Before selecting a new task, inspect the current task branch and open
task-scoped PRs against the completed task records in the active phase. A task
moved to `completed/` may still have unpublished verified work, pending external
review, valid repair findings, or a PR awaiting human review/merge.

For a generic continue/resume request, resume that existing task's PR lifecycle
before choosing the next incomplete phase task. If its PR is already Ready for
human review, report the handoff and stop rather than beginning another task.
If it has been merged, report that state when explicitly asked to resume that
task; only a separate instruction to advance authorizes selecting the next task.

Do not treat an empty `active/` directory as permission to advance. If multiple
unfinished task PRs or conflicting task/branch states make selection ambiguous,
return `NEEDS_HUMAN_DECISION`. If required PR-state inspection is unavailable,
return `BLOCKED` rather than guessing. Honor narrower no-PR/read-only requests;
inspection does not authorize publication.

Reconcile current unfinished task work, not every historical completed task
that predates this PR workflow. An explicit request for a different task while
the prior task is still awaiting human handoff requires direction rather than
silently skipping the outstanding lifecycle.

Inspect `planning/tasks/active/`.

## Exactly One Active Task

If exactly one active task exists:

- read it completely
- continue that task unless the developer explicitly requested another task

## Multiple Active Tasks

If multiple active tasks exist:

- use the task explicitly named by the developer

If no task was explicitly selected and priority cannot be determined safely:

`TASK_EXECUTION_RESULT: NEEDS_HUMAN_DECISION`

Do not guess between multiple active tasks.

## No Active Task

If no active task exists:

1. read the current phase
2. identify incomplete tasks in documented phase order
3. select the next eligible task
4. verify prerequisites are satisfied
5. use `task-authoring` to create the specification and run its task-spec and
   architecture review workflow when the specification does not yet exist
6. activate only that task after authoring gates pass

A request to complete the selected task includes this authoring-to-execution
handoff. An authoring-only request still stops after authoring approval.
Do not introduce artificial approval gates for routine Green/Yellow choices;
retain explicit developer gates and unresolved Red decisions.

Do not skip an earlier incomplete task merely because a later task appears
more interesting.

Do not begin a task whose documented prerequisites are incomplete.

---

# 4. Establish Task Context

Read the complete task specification.

Extract:

- task ID
- title
- objective
- scope
- non-goals
- prerequisites
- acceptance criteria
- architecture implications
- affected backend/frontend areas
- database implications
- security implications
- required tests
- required verification
- documentation requirements
- approval gates

If information is missing, inspect:

- phase documentation
- ADRs
- architecture documentation
- API documentation
- database documentation
- existing implementation
- tests

Do not invent business requirements.

---

# 5. Validate Repository Reality

Before planning implementation, inspect the actual repository.

Verify assumptions from the task against:

- source structure
- current dependencies
- existing abstractions
- API contracts
- database migrations
- test infrastructure
- frontend/backend conventions
- existing configuration

Repository reality may differ from the task's assumptions.

If a harmless discrepancy can be resolved within task scope, account for it in
the plan.

If a material conflict exists between the task and accepted repository policy,
stop and report it.

---

# 6. Classify the Task

Determine which implementation path applies.

Possible classifications:

- backend
- frontend
- full-stack
- infrastructure/configuration
- documentation-only
- testing-only
- architecture-only
- mixed

Also classify whether the task is:

- trivial
- non-trivial

Use the root `AGENTS.md` definition for non-trivial work.

This classification determines which specialist skills and review gates are
required.

---

# 7. Architecture Gate

Determine whether architecture review is required.

Use `architecture-review` when the task materially affects:

- module boundaries
- new modules
- public API design
- database schema design
- authentication architecture
- authorization architecture
- transaction design
- concurrency strategy
- infrastructure
- messaging architecture
- caching architecture
- significant dependencies
- cross-domain abstractions
- long-lived reusable architecture

Architecture review may be skipped for straightforward implementation that
follows an already-established design.

When architecture review runs, consume exactly one final result:

```text
ARCHITECTURE_RESULT: APPROVED
```

```text
ARCHITECTURE_RESULT: APPROVED_WITH_CONSTRAINTS
```

or:

```text
ARCHITECTURE_RESULT: NEEDS_HUMAN_DECISION
```

## APPROVED

Proceed to implementation planning.

## APPROVED_WITH_CONSTRAINTS

Record the constraints and ensure the implementation follows them.

## NEEDS_HUMAN_DECISION

Stop.

Do not implement the unresolved architectural decision.

Return the decision required and recommended option.

---

# 8. Human Approval Gate

Apply the Green / Yellow / Red policy from root `AGENTS.md`.

## Green

Proceed autonomously.

## Yellow

Proceed only when:

- the task clearly requires the change
- the change is reversible
- no Red condition applies

Record the decision for the final summary.

Choose compatible exact versions of task-approved dependencies and routine
implementation details autonomously. Record the rationale and compatibility
evidence. Explicit developer restrictions and task-specific approval gates
remain binding; do not reinterpret them as permission to proceed.

## Red

Stop before performing the action.

Return:

- decision required
- relevant context
- recommended option
- meaningful alternatives
- consequences

Finish the workflow as:

`TASK_EXECUTION_RESULT: NEEDS_HUMAN_DECISION`

Do not bypass Red gates.

---

# 9. Produce the Execution Plan

Create a concise implementation plan before modifying files.

The plan should identify:

- task objective
- affected areas
- implementation sequence
- specialist skill(s) required
- likely files or modules
- tests
- verification
- architecture constraints
- meaningful risks

Do not create an unnecessarily long plan for a simple task.

Do not repeat the entire task specification.

The plan exists to guide execution.

---

# 10. Select the Implementation Path

## Backend Task

Use `backend-implementation`.

Examples:

- Spring services
- domain rules
- REST APIs
- persistence
- Flyway migrations
- transactions
- concurrency
- backend security
- RabbitMQ
- Redis
- backend integrations

Expected result:

```text
BACKEND_RESULT: IMPLEMENTED
```

or:

```text
BACKEND_RESULT: BLOCKED
```

## Frontend Task

Use `frontend-implementation`.

Examples:

- React components
- pages/screens
- forms
- routing
- Zustand state
- frontend API integration
- accessibility
- visual UI behavior

Expected result:

```text
FRONTEND_RESULT: IMPLEMENTED
```

or:

```text
FRONTEND_RESULT: BLOCKED
```

## Full-Stack Task

Coordinate backend and frontend implementation deliberately.

Determine dependency order.

Example:

```text
Backend contract
      ↓
Frontend integration
```

Do not run frontend implementation in parallel with backend contract design
when the frontend depends on an unresolved API.

Parallel work is allowed only where changes are genuinely independent.

Avoid multiple agents editing overlapping files concurrently.

## Documentation-Only Task

Specialist implementation skills may be unnecessary.

Make the scoped documentation change directly according to repository policy.

Run relevant documentation/scope checks.

Independent review may be skipped if the change qualifies as trivial under
root policy.

## Testing-Only Task

Use the appropriate implementation context for the affected area.

Do not change production behavior unless the task explicitly authorizes it.

## Architecture-Only Task

Use `architecture-review`.

Do not proceed into implementation unless the task explicitly includes
implementation.

---

# 11. Implementation Result Handling

After an implementation skill returns, inspect the result.

## IMPLEMENTED

`IMPLEMENTED` means:

- implementation work is finished
- implementation-specific checks were performed as applicable
- the change is ready for independent review

It does not mean the task is complete.

Proceed to orchestrator verification and independent review.

## BLOCKED

Determine why the implementation is blocked.

Classify the blocker:

- implementation defect
- architecture decision
- requirement ambiguity
- environment limitation
- missing dependency/service
- verification failure
- human approval required
- conflicting repository state

If the blocker can be safely repaired within task scope, enter the repair loop.

Otherwise stop and report it.

Do not mark the task complete.

---

# 12. Developer Verification Gate

Before independent review, confirm applicable implementation verification.

Examples may include:

Backend:

```bash
cd backend
./mvnw clean verify
```

Frontend:

```bash
cd frontend
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Use only commands appropriate to the actual repository and task.

Task-specific verification takes precedence over generic examples.

Also inspect:

```bash
git diff --check
git status --short --untracked-files=all
git diff
```

Do not claim a command passed unless it actually ran successfully.

If required verification fails because of the implementation, repair it before
review.

If verification is blocked by the environment, keep the task incomplete and
record the blocker.

---

# 13. Independent Code Review Gate

For non-trivial implementation, use `code-review`.

The reviewer must be independent from the implementation role.

Do not ask the implementation agent to approve its own work.

Expected results:

```text
CODE_REVIEW_RESULT: APPROVE
```

```text
CODE_REVIEW_RESULT: REQUEST_CHANGES
```

or:

```text
CODE_REVIEW_RESULT: BLOCKED
```

## APPROVE

Proceed toward QA.

P2 and P3 findings may remain if root policy permits and they are documented.

## REQUEST_CHANGES

Return findings to the appropriate implementation role.

Do not let the reviewer repair its own findings.

After repair:

1. rerun affected developer verification
2. request independent re-review
3. confirm previously blocking findings are resolved
4. inspect whether the repair introduced regressions

## BLOCKED

Determine whether critical review context can be restored.

If not, task completion is blocked.

---

# 14. Repair Loop

Use the repair loop when:

- implementation verification fails
- code review returns P0/P1 findings
- QA returns FAIL
- a repair introduces another blocking defect

The repair workflow is:

```text
Finding
   ↓
Classify
   ↓
Appropriate implementation skill
   ↓
Fix
   ↓
Affected verification
   ↓
Independent review when required
   ↓
QA when required
```

Maximum automated repair cycles:

`3`

Count a cycle when the orchestrator attempts a substantive repair for a
blocking defect and returns through verification.

Do not count simple command retries caused by a transient tool issue unless
code or configuration was changed.

After three unsuccessful automated repair cycles:

1. stop automated repair
2. keep the task incomplete
3. summarize attempted repairs
4. report remaining blocker
5. identify required human decision or investigation

Finish with:

`TASK_EXECUTION_RESULT: BLOCKED`

Do not continue indefinitely.

---

# 15. QA Gate

After required code review passes, use `qa-validation`.

QA validates the final implementation against the task.

Expected results:

```text
QA_RESULT: PASS
```

```text
QA_RESULT: FAIL
```

or:

```text
QA_RESULT: BLOCKED
```

## PASS

Proceed to final verification.

## FAIL

Return the defect to the appropriate implementation role.

Repair the issue.

Then rerun:

1. affected implementation checks
2. code review if the repair materially changes reviewed code
3. QA validation

Do not let QA repair its own defect.

## BLOCKED

Do not treat this as an implementation failure automatically.

Determine whether the blocker is:

- Docker
- database
- network
- permissions
- browser tooling
- external service
- missing environment
- unavailable dependency
- critical missing context

Required QA that remains blocked prevents task completion.

---

# 16. Stale Approval Protection

Review and QA results apply only to the implementation they examined.

If code materially changes after:

- code-review approval
- QA PASS

then determine which gates became stale.

Examples:

A backend logic repair after code review normally requires re-review.

A UI behavior repair after QA normally requires affected QA to rerun.

A documentation-only correction after final QA may not require repeating
runtime tests.

Use judgment based on whether the change could invalidate existing evidence.

Never rely on stale approval for materially changed code.

---

# 17. Final Verification Gate

Before completion documentation:

1. confirm all acceptance criteria
2. confirm required implementation verification
3. confirm required code review
4. confirm QA PASS
5. inspect final Git diff
6. inspect untracked files
7. confirm no unrelated developer work was modified
8. confirm no unresolved P0/P1 findings
9. confirm no required check remains BLOCKED
10. confirm documentation will describe the final verified implementation

Run relevant final scope checks:

```bash
git diff --check
git status --short --untracked-files=all
git diff --stat
git diff
```

Do not proceed to task completion when required verification is:

- failed
- blocked
- inconclusive

---

# 18. Learning Contract

For significant engineering concepts introduced or changed by the task,
prepare a concise learning explanation covering:

1. what was implemented
2. why it is necessary
3. how it works
4. meaningful alternatives
5. common failure modes
6. how the concept might appear in a technical interview

Do not generate repetitive tutorials for mechanical changes.

The learning explanation belongs in the final task report unless repository
documentation explicitly requires it elsewhere.

---

# 19. Completion Documentation

Only after all required gates pass:

1. open the active task document
2. update its `## Completion` section
3. record:
   - final status
   - implemented changes
   - verification actually performed
   - review result
   - QA result
   - relevant notes or warnings

4. confirm the documentation reflects the final verified implementation

5. move the task from:

```text
planning/tasks/active/
```

to:

```text
planning/tasks/completed/
```

6. update the corresponding phase under:

```text
planning/phases/
```

7. mark only the completed task:

```text
— ✅ Completed
```

8. do not mark the next task completed

9. do not mark the next task in progress unless work on that task actually
   begins

10. do not modify unrelated tasks or phases

Task completion documentation is part of the current task.

It does not require a separate documentation task.

---

# 20. Completion Preconditions

A task may be completed only when all applicable conditions are true:

- acceptance criteria are satisfied
- implementation is finished
- required compilation succeeds
- required tests pass
- required lint/typecheck/build checks pass
- architecture policy is respected
- required architecture constraints are satisfied
- independent review passed when required
- QA returned `PASS`
- no unresolved P0 findings remain
- no unresolved P1 findings remain
- required verification is not blocked
- no unrelated developer work was discarded
- final documentation matches the verified implementation

If any required condition is false, the task remains incomplete.

Local completion is not the terminal autonomous state and does not imply a
merged or externally approved PR. Keep PR review status distinct from the
local task record.

## Pull Request Handoff

After local gates and completion documentation pass, use
`.codex/skills/pull-request/SKILL.md` unless the developer restricted Git/PR
actions. Supply the task, approved architecture, actual diff, verification,
independent review, QA, Yellow decisions, and deferred work.

Handle its result as follows:

- `PR_RESULT: READY_FOR_HUMAN_REVIEW` →
  `TASK_EXECUTION_RESULT: READY_FOR_HUMAN_REVIEW`
- `PR_RESULT: REVIEW_PENDING` → `TASK_EXECUTION_RESULT: PR_REVIEW_PENDING`
- `PR_RESULT: BLOCKED` → `TASK_EXECUTION_RESULT: BLOCKED`
- `PR_RESULT: NEEDS_HUMAN_DECISION` →
  `TASK_EXECUTION_RESULT: NEEDS_HUMAN_DECISION`

Valid PR findings return through the implementation, verification, independent
review, QA, and documentation gates as applicable. Count substantive PR repairs
against the same three-cycle repair budget; never restart the counter simply
because feedback arrived on GitHub. Do not rely on stale approvals after a
repair or report missing external review as passed.

---

# 21. Git Policy

For authorized single-task execution, the orchestrator may create/use a task
branch, create scoped commits after local gates pass, push that branch,
create/update its PR against `main`, mark the Draft Ready for Review, and push
verified repairs to the same PR branch.

Do not merge, force push without separate explicit authorization, rewrite
history, delete protected branches, stage unrelated work, or begin the next
task. Do not implement on `main`.

Explicit no-commit/no-push/no-PR or local-only instructions override this
default. Stop at the requested boundary and report which PR stages were not
performed. Never use broad staging commands for a dirty worktree.

Never include secrets in Git.

---

# 22. Secret and Sensitive Data Safety

Never:

- print secrets
- expose API keys
- expose passwords
- expose tokens
- commit `.env` secrets
- copy sensitive values into task documents
- include credentials in logs or summaries

When verification requires credentials, use existing environment mechanisms
without printing their values.

If required credentials are unavailable, report verification as blocked.

---

# 23. Environment Safety

Do not perform destructive environment recovery merely to get a passing
result.

Without explicit approval, do not:

- delete Docker volumes
- delete developer databases
- reset persistent state
- terminate unrelated processes
- delete unrelated files
- overwrite local configuration
- alter production systems

Use disposable resources where appropriate.

Only clean up processes and resources clearly owned by the current workflow.

---

# 24. Orchestrator Delegation Rules

Delegate only when doing so provides meaningful specialization or independent
validation.

Do not spawn agents merely because they exist.

Good delegation:

```text
Orchestrator
   ↓
Architecture Review
   ↓
Backend Implementation
   ↓
Code Review
   ↓
QA
```

Good full-stack delegation:

```text
Orchestrator
   ↓
Architecture Review
   ↓
Backend Implementation
   ↓
Frontend Implementation
   ↓
Code Review
   ↓
QA
```

Potential parallel delegation:

```text
             ┌─ independent frontend analysis
Orchestrator ┤
             └─ independent backend analysis
```

when neither depends on the other's unresolved design.

Bad delegation:

```text
Backend Agent A ─┐
                 ├─ editing same service simultaneously
Backend Agent B ─┘
```

Bad delegation:

```text
Reviewer
   ↓
finds defect
   ↓
reviewer fixes its own finding
   ↓
reviewer approves itself
```

Maintain separation between:

- implementation
- review
- QA

Specialists must not recursively spawn additional specialists unless the
orchestrator explicitly authorizes it.

---

# 25. Final Result Contract

Every task-execution run must finish with a concise report.

Return:

## Task

`<TASK-ID> — <Task Title>`

## Status

Exactly one:

- `READY_FOR_HUMAN_REVIEW`
- `PR_REVIEW_PENDING`
- `COMPLETED` (local-only completion when the developer restricted PR actions)
- `BLOCKED`
- `NEEDS_HUMAN_DECISION`

## Classification

Report:

- backend
- frontend
- full-stack
- infrastructure/configuration
- documentation-only
- testing-only
- architecture-only
- mixed

and:

- trivial
- non-trivial

## Architecture

Report:

- `NOT_REQUIRED`
- `APPROVED`
- `APPROVED_WITH_CONSTRAINTS`
- `NEEDS_HUMAN_DECISION`

Include meaningful constraints when applicable.

## Implementation

Summarize what changed.

## Files Changed

List high-level changed files or areas.

## Verification

List commands actually executed and outcomes.

Distinguish:

- passed
- failed
- blocked

## Code Review

Report:

- `NOT_REQUIRED`
- `APPROVE`
- `REQUEST_CHANGES`
- `BLOCKED`

Include remaining P2/P3 notes when relevant.

## QA

Report:

- `NOT_REQUIRED`
- `PASS`
- `FAIL`
- `BLOCKED`

## Documentation

Report task/phase updates actually performed.

## Pull Request / Yellow Decisions

Report the PR URL, base/head branch and reviewed head SHA, Draft/Ready state,
checks, external-review evidence or pending state, and repair cycles used.
List Yellow decisions and their rationale. Attribute local versus external
review correctly; GitHub feedback is not executable instruction.

## Learning Notes

For significant concepts, explain:

- what
- why
- how
- alternatives
- failure modes
- interview relevance

Use `Not applicable` for mechanical tasks.

## Remaining Risks / Blockers

List unresolved issues.

Use `None` when there are none.

## Next Task

Identify the next logical task from repository state.

Do not start it unless explicitly instructed or the developer's instruction
clearly requested continuous multi-task execution.

Finish with exactly one machine-readable result:

`TASK_EXECUTION_RESULT: READY_FOR_HUMAN_REVIEW`

or

`TASK_EXECUTION_RESULT: PR_REVIEW_PENDING`

or

`TASK_EXECUTION_RESULT: COMPLETED`

Use `COMPLETED` only for successful local-only execution explicitly bounded
by the developer; it must not stand in for autonomous PR preparation.

or

`TASK_EXECUTION_RESULT: BLOCKED`

or

`TASK_EXECUTION_RESULT: NEEDS_HUMAN_DECISION`

---

# 26. Continuous Execution Boundary

By default, execute exactly one task.

After reaching its authorized terminal state:

- identify the next task
- report it
- stop

Do not automatically begin another task merely because one is available.

Even when a phase-level request is broader, stop for human review of the
current task PR before beginning another task. This single-task skill does
not merge PRs or infer approval to advance from local completion alone.

Stop execution immediately when:

- a Red approval decision is reached
- architecture requires human input
- required verification is blocked
- repair limit is exceeded
- task ordering becomes ambiguous
- repository state becomes unsafe
- the developer's requested boundary is reached
