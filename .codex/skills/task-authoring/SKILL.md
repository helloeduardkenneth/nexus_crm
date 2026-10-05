---
name: task-authoring
description: Author or revise a NexusCRM task specification from the current phase, repository state, prerequisite tasks, accepted ADRs, and project instructions. Automatically request independent task-spec review for every authored task and architecture review when the proposed work has architectural impact. Use when asked to author, create, define, revise, or prepare the next NexusCRM task.
---

# Task Authoring

Use this skill when asked to:

- author a NexusCRM task
- create a task specification
- define the next task
- prepare a task from the current phase
- revise a task specification
- author the next task in a phase

This skill defines **what work should be done**.

It does not implement the task.

Implementation belongs to `task-execution`.

---

# Objective

Create one precise, executable, reviewable NexusCRM task specification that:

- matches the current phase
- respects completed prerequisite work
- reflects actual repository state
- stays within task boundaries
- has objective acceptance criteria
- has sufficient verification
- avoids premature implementation detail
- avoids work assigned to later tasks
- respects accepted architecture decisions

Every newly authored task must receive independent `task-spec-review`.

Architecture review is conditional.

---

# Authoring Boundary

During task authoring, do not:

- modify application source code
- install dependencies
- modify dependency versions
- create migrations
- modify database state
- modify Docker infrastructure
- implement task functionality
- execute implementation verification
- mark the task completed
- mark the phase completed
- begin the following task
- commit
- push
- create a pull request

Task authoring may create or revise only the intended task specification unless
another documentation change is explicitly authorized.

Do not alter phase progress merely because a task specification was authored.

---

# 1. Load Repository Context

Before drafting a task, read:

1. root `AGENTS.md`
2. applicable nested `AGENTS.md` files
3. the current phase document
4. existing active tasks
5. relevant completed prerequisite tasks
6. accepted ADRs
7. relevant architecture documentation
8. relevant API/database/design documentation when present
9. current implementation relevant to the task
10. dependency/build configuration relevant to the task
11. current Git worktree

Repository state is the source of truth.

Do not rely on chat history when repository documentation can answer the
question.

---

# 2. Determine the Task to Author

If the developer explicitly names a task:

- author only that task
- verify that it belongs to the current phase
- verify prerequisites
- do not substitute another task

If asked to author the next task:

1. read the current phase
2. identify completed tasks
3. identify active tasks
4. determine the next incomplete task in documented order
5. confirm prerequisites are complete

If multiple candidate tasks are equally eligible and repository policy does
not establish priority:

`TASK_AUTHORING_RESULT: NEEDS_HUMAN_DECISION`

Do not guess.

---

# 3. Inspect Existing Repository State

Before defining requirements, inspect the repository areas affected by the
future task.

Determine:

- what already exists
- what the preceding task established
- what architecture is already accepted
- which dependencies already exist
- which verification tooling exists
- which capabilities are intentionally deferred

Do not author requirements based on assumptions that contradict the current
repository.

If the phase document is stale but the repository clearly contains completed
work, report the discrepancy rather than silently rewriting planning history.

---

# 4. Establish Task Boundary

The task should represent one coherent engineering outcome.

Define:

- goal
- context
- scope
- out of scope
- task-specific constraints
- acceptance criteria
- verification requirements
- architecture/approval notes
- learning focus

Avoid combining several independently completable tasks into one large task.

Do not pull future-phase work into the current task merely because it would be
convenient.

---

# 5. Use the Repository Task Template

Use every required heading from the repository's canonical task template.

When the canonical template exists in the repository, follow it rather than
inventing a different structure.

If the repository uses the standard NexusCRM task structure, include:

- task title
- phase
- status
- objective or goal
- context
- requirements or scope
- constraints / out of scope
- expected result when required
- acceptance criteria
- verification
- architecture / approval notes
- learning objectives
- definition of done when required by the template
- completion section

Preserve repository terminology.

Do not silently rename established headings when the template requires exact
headings.

---

# 6. Write the Goal

The goal should describe the resulting state, not the step-by-step
implementation.

Good:

> Establish the minimal frontend architecture required for routing, shared
> client UI state, form handling, and Tailwind-based styling.

Avoid:

> Install packages, create files, configure router, make components, then run
> build.

Keep the goal singular and outcome-oriented.

---

# 7. Write Context

Include only context that materially affects implementation.

Useful context includes:

- relevant prerequisite task outcomes
- current implementation state
- known version constraints
- phase boundaries
- existing architecture decisions
- known deferred work

Do not duplicate generic rules already defined by `AGENTS.md`.

Do not repeat accepted ADRs in full.

Reference them where appropriate.

---

# 8. Define Scope

Scope should describe what the task must introduce or change.

Include enough detail to prevent ambiguity while allowing the implementation
agent to select reasonable internal implementation details.

Avoid specifying exact filenames unless:

- repository convention requires them
- task behavior depends on them
- the phase explicitly requires a structure

Avoid designing speculative directories for future features.

---

# 9. Define Out of Scope

Explicitly exclude nearby work that could cause scope leakage.

Consider:

- next-task functionality
- future-phase features
- optional libraries
- unrelated refactors
- backend work in frontend-only tasks
- frontend work in backend-only tasks
- premature infrastructure
- deferred testing/tooling
- domain functionality not required by the foundation task

Do not create an enormous exclusion list when phase/task boundaries already
make the exclusion obvious.

Use exclusions where they materially reduce ambiguity.

---

# 10. Define Task-Specific Constraints

Include only constraints specific to this task.

Do not duplicate generic repository rules unnecessarily.

Examples:

- preserve a package-manager version established by a prerequisite
- do not modify a backend contract
- use exact versions subject to implementation approval
- remain frontend-only
- preserve an existing migration
- no destructive data changes

General engineering policy remains in `AGENTS.md`.

---

# 11. Acceptance Criteria

Every acceptance criterion must be:

- observable
- verifiable
- relevant to task scope
- independent enough to evaluate
- unambiguous

Prefer behavioral outcomes.

Good:

> Browser Back and Forward navigation preserve expected routed behavior.

Less useful:

> Implement React Router correctly.

Good:

> A valid form submission renders its local preview without a network request.

Less useful:

> Use React Hook Form.

Requirements may mandate a technology when the phase establishes that
technology, but acceptance criteria should still prove resulting behavior.

Use checklist syntax when consistent with the repository template.

---

# 12. Verification Design

Map task requirements to evidence.

Distinguish:

## Build / Static Verification

Examples:

- compilation
- typecheck
- lint
- build
- dependency inspection
- Git diff checks

## Runtime Verification

Examples:

- application startup
- HTTP readiness
- migrations
- endpoint behavior
- persistence behavior

## Browser Verification

Examples:

- navigation
- forms
- focus behavior
- accessibility
- console errors
- responsive behavior

## Manual Verification

Use only where automation is unavailable or unreasonable.

Do not define verification that existing tools cannot realistically perform
without identifying that dependency.

Do not claim generic build success proves runtime behavior.

Do not claim HTTP readiness proves UI behavior.

---

# 13. Verification Safety

Task specifications must not instruct implementation or QA to:

- delete developer databases
- delete Docker volumes
- kill unrelated processes
- expose secrets
- modify production systems
- weaken tests
- bypass security
- disable linting
- create fake verification scripts

When runtime processes are required:

- use bounded readiness waits
- track owned processes
- clean up only owned resources
- treat occupied ports as environment conditions, not permission to kill
  unrelated processes

---

# 14. Learning Objectives

For meaningful engineering tasks, identify the concepts the developer should
understand after completion.

Learning objectives should relate directly to the task.

Examples:

- routing ownership
- transaction boundaries
- state ownership
- schema migration lifecycle
- optimistic locking
- accessible form validation
- client/server state separation

Do not turn routine mechanical tasks into artificial tutorials.

---

# 15. Completion Section

The authored task must begin incomplete.

Do not fabricate implementation or verification evidence.

Use the completion structure required by the task template.

Typical initial state:

```text
Status: Not Started

Implemented:

None

Verification:

None

Notes:

None
```

Completion is updated only by `task-execution` after implementation, review,
QA, and verification pass.

---

# 16. Independent Task-Spec Review — Required

Every newly authored or materially revised task must be reviewed using
`task-spec-review`.

The author must not self-approve the task.

Provide the reviewer with:

- task specification
- relevant phase
- prerequisite task context
- applicable repository instructions
- relevant ADRs
- repository state needed to evaluate feasibility

Expected results:

`TASK_SPEC_RESULT: APPROVED`

`TASK_SPEC_RESULT: REQUEST_CHANGES`

or

`TASK_SPEC_RESULT: BLOCKED`

---

# 17. Task-Spec Revision Loop

If task-spec review returns:

`TASK_SPEC_RESULT: REQUEST_CHANGES`

then:

1. inspect every finding
2. revise only valid findings
3. preserve correct task boundaries
4. do not blindly accept reviewer suggestions
5. request independent task-spec review again

Maximum automatic task-spec revision cycles:

`2`

After two unsuccessful review/revision cycles:

`TASK_AUTHORING_RESULT: NEEDS_HUMAN_DECISION`

Report:

- unresolved disagreement
- affected requirement
- recommended resolution

Do not continue indefinitely.

---

# 18. Architecture Review Decision

After task-spec review approves the task, determine whether the proposed task
requires architecture review.

Architecture review is required when the task materially establishes or changes:

- module boundaries
- domain ownership
- public APIs
- database schema design
- authentication architecture
- authorization architecture
- transaction strategy
- concurrency strategy
- routing architecture
- shared state architecture
- frontend application composition
- major form architecture
- messaging
- caching
- infrastructure
- cross-domain abstractions
- significant new dependencies
- long-lived technical foundations

Architecture review is normally not required for:

- documentation-only corrections
- trivial UI text changes
- mechanical configuration updates
- small bug fixes that preserve existing architecture
- test-only additions that do not alter architecture
- straightforward implementation under an already accepted design

Use judgment.

Do not invoke architecture review merely to create ceremony.

---

# 19. Architecture Review

When required, use `architecture-review`.

Expected results:

`ARCHITECTURE_RESULT: APPROVED`

`ARCHITECTURE_RESULT: APPROVED_WITH_CONSTRAINTS`

or

`ARCHITECTURE_RESULT: NEEDS_HUMAN_DECISION`

## APPROVED

Continue finalization.

## APPROVED_WITH_CONSTRAINTS

Evaluate the constraints.

Important architectural constraints should be incorporated into the task
specification so the repository, not conversation history, retains the
decision.

Do not copy the architect's entire response into the task.

Incorporate only constraints that materially govern implementation.

After incorporation, determine whether the task changed architecturally.

If yes, request architecture re-review.

If changes are editorial only, re-review is unnecessary.

## NEEDS_HUMAN_DECISION

Stop authoring before implementation.

Return the unresolved decision to the developer.

Do not silently choose an architectural direction.

---

# 20. Architecture Re-Review

Architecture approval becomes stale if task revisions materially change:

- routing approach
- state ownership
- database design
- public API
- authentication/authorization
- transaction behavior
- concurrency strategy
- module ownership
- infrastructure
- significant dependencies

Request architecture review again when such changes occur.

Maximum automatic architecture revision cycles:

`2`

After two unresolved architecture cycles:

`TASK_AUTHORING_RESULT: NEEDS_HUMAN_DECISION`

---

# 21. Final Authoring Verification

Before declaring the task approved:

1. confirm the task follows the canonical template
2. confirm phase ownership
3. confirm prerequisites
4. confirm task-spec review is approved
5. confirm architecture review passed when required
6. confirm accepted architecture constraints are represented
7. confirm acceptance criteria are verifiable
8. confirm verification can prove them
9. confirm no future-task work leaked into scope
10. confirm completion is still unstarted
11. inspect Git state
12. confirm no application implementation occurred during authoring

When the authoring request required only task creation, the task specification
should normally be the only intentional repository modification.

---

# 22. Result Contract

Return:

## Task

`<TASK-ID> — <Task Title>`

## Authoring Status

Exactly one:

- `APPROVED`
- `BLOCKED`
- `NEEDS_HUMAN_DECISION`

## Task-Spec Review

Exactly one:

- `APPROVED`
- `REQUEST_CHANGES`
- `BLOCKED`

Include the number of review cycles used.

## Architecture Review

Exactly one:

- `NOT_REQUIRED`
- `APPROVED`
- `APPROVED_WITH_CONSTRAINTS`
- `NEEDS_HUMAN_DECISION`

## Task File

Report the authored task path.

## Key Scope

Briefly summarize what the task includes.

## Key Exclusions

Briefly summarize important deferred work.

## Architecture Constraints

List incorporated constraints.

Use `None` when not applicable.

## Verification Strategy

Briefly summarize how the future implementation will be proven.

## Unresolved Decisions

Use `None` when fully approved.

## Repository Changes

Report files modified during authoring.

Finish with exactly one:

`TASK_AUTHORING_RESULT: APPROVED`

`TASK_AUTHORING_RESULT: BLOCKED`

or

`TASK_AUTHORING_RESULT: NEEDS_HUMAN_DECISION`

---

# 23. Handoff

When:

`TASK_AUTHORING_RESULT: APPROVED`

the task is ready for developer inspection and later execution.

Do not automatically invoke `task-execution` unless the developer explicitly
requested both authoring and implementation.

Recommended boundary:

```text
Author task
    ↓
task-spec review
    ↓
architecture review if needed
    ↓
TASK_AUTHORING_RESULT: APPROVED
    ↓
STOP
```

Then implementation begins through a separate request:

> Execute TASK-XXXX.

This preserves a clean planning-versus-execution boundary.