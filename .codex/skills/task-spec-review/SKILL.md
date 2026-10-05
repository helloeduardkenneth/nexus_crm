---
name: task-spec-review
description: Independently review a NexusCRM task specification before implementation for clarity, phase alignment, scope control, prerequisites, acceptance criteria, verification quality, architecture leakage, contradictions, and feasibility. Use after task authoring or material task-spec revisions. This skill is read-only.
---

# Task Specification Review

Use this skill to review a proposed NexusCRM task specification before
implementation begins.

Every newly authored task should receive this review.

This skill reviews the **quality of the task specification**.

It does not review implemented code.

It does not replace `architecture-review`.

---

# Objective

Determine whether the task specification is sufficiently:

- clear
- scoped
- internally consistent
- aligned with its phase
- compatible with repository state
- objectively verifiable
- architecture-aware
- executable by `task-execution`

The reviewer must be independent from task authoring.

Do not approve the task merely because it is detailed.

More detail is not automatically better.

---

# Read-Only Boundary

Do not:

- modify the task
- modify planning files
- modify application code
- change dependencies
- install tools
- create migrations
- update phase status
- implement the task
- commit
- push

Return findings to `task-authoring`.

The authoring role performs revisions.

---

# 1. Load Context

Read:

1. root `AGENTS.md`
2. applicable nested `AGENTS.md`
3. proposed task specification
4. current phase document
5. relevant completed prerequisite tasks
6. other active tasks when relevant
7. accepted ADRs
8. relevant architecture/API/database/design documentation when present
9. enough current repository state to determine feasibility

Do not evaluate the task in isolation when repository context materially
affects it.

---

# 2. Verify Task Identity

Confirm:

- task ID matches phase
- title matches intended work
- status is appropriate for an unimplemented task
- prerequisite relationships are correct
- the task belongs at the current point in phase ordering

Flag:

- task IDs that conflict with existing tasks
- incorrect phase ownership
- missing prerequisites
- tasks that depend on future work
- task order that contradicts the phase plan

---

# 3. Review the Goal / Objective

The task should have one coherent outcome.

Flag goals that are:

- too broad
- too vague
- implementation-only
- actually multiple tasks
- inconsistent with phase scope
- dependent on undefined future architecture

The goal should describe resulting capability or repository state.

---

# 4. Review Context

Context should accurately describe repository reality.

Verify claims about:

- previous task outcomes
- versions
- dependencies
- existing architecture
- configuration
- current capabilities

Flag stale or invented context.

Do not require context that is irrelevant to implementation.

Do not require duplication of generic repository policy.

---

# 5. Review Scope

Check whether every in-scope requirement contributes to the task objective.

Flag:

- unrelated work
- speculative abstractions
- premature infrastructure
- future-phase functionality
- convenience refactors
- business functionality inside foundation work
- unnecessary dependencies
- implementation details masquerading as requirements

Supporting work necessary to satisfy the goal is acceptable.

Do not force artificially tiny scope when supporting changes are genuinely
required.

---

# 6. Review Out-of-Scope Boundaries

Check whether likely scope-leakage areas are explicitly deferred when needed.

Flag contradictions such as:

- scope requires a capability that out-of-scope forbids
- verification requires tooling explicitly deferred
- acceptance criteria require future-task infrastructure
- a dependency is both required and prohibited

Do not demand exhaustive exclusion lists.

Only require exclusions that materially improve scope control.

---

# 7. Review Constraints

Task-specific constraints should be:

- necessary
- compatible with repository policy
- compatible with accepted ADRs
- achievable
- not duplicated excessively

Flag constraints that:

- contradict root `AGENTS.md`
- contradict nested `AGENTS.md`
- contradict accepted ADRs
- freeze unnecessary implementation details
- prevent reasonable implementation
- require unavailable tooling without justification

---

# 8. Review Acceptance Criteria

Every acceptance criterion should be:

- observable
- testable
- unambiguous
- relevant to scope
- attainable
- independently understandable

Flag criteria that merely say:

- code was written
- package was installed
- architecture was implemented "correctly"
- tests pass without defining behavior
- UI "looks good"

When a specific technology is required by the phase, installing or integrating
that technology may be part of the task, but acceptance should also validate
the resulting behavior.

---

# 9. Acceptance-to-Verification Mapping

For each acceptance criterion, determine whether the Verification section
provides sufficient evidence.

Classify each criterion internally as:

- COVERED
- PARTIALLY_COVERED
- NOT_COVERED

Flag:

- acceptance criteria with no proof
- commands that do not prove the criterion
- browser behavior "verified" only through HTTP readiness
- persistence behavior "verified" only through compilation
- accessibility claims without interaction/semantic inspection
- environment behavior without environment checks

Do not require automation where manual verification is reasonable.

Manual verification must be explicitly attributed.

---

# 10. Review Verification Feasibility

Check that proposed verification:

- matches actual repository tooling
- uses commands that exist
- uses the correct package manager/build tool
- does not require future-task tooling
- does not require destructive operations
- distinguishes environment failures from implementation failures
- has realistic runtime expectations
- includes cleanup for owned processes where necessary

Flag verification that instructs agents to:

- kill arbitrary processes
- reset databases
- delete volumes
- expose secrets
- install missing global tools automatically
- weaken project configuration
- create fake scripts merely to satisfy a checklist

---

# 11. Architecture Leakage Review

Determine whether the task unnecessarily pre-decides architecture that should
instead be selected during implementation or architecture review.

Examples of potentially over-prescribed detail:

- exact internal class names
- exact component decomposition
- exact file paths without repository precedent
- unnecessary provider hierarchy
- speculative interfaces
- premature reusable abstractions
- exact database internals without an accepted design

Do not flag legitimate project decisions such as:

- required framework
- required package manager
- phase-selected libraries
- accepted ADR constraints
- compatibility requirements

Classify architectural content as one of:

- established decision
- valid task constraint
- implementation detail
- unresolved architecture decision

Unresolved architectural decisions should trigger architecture review rather
than being silently embedded into the task.

---

# 12. Architecture Review Recommendation

Return whether architecture review is needed.

Use:

`ARCHITECTURE_REVIEW: REQUIRED`

when the task materially introduces or changes:

- module boundaries
- public API architecture
- database schema design
- authentication/authorization architecture
- transaction strategy
- concurrency strategy
- routing architecture
- state architecture
- frontend application composition
- messaging
- caching
- infrastructure
- significant cross-cutting dependencies
- long-lived technical foundations

Use:

`ARCHITECTURE_REVIEW: NOT_REQUIRED`

for routine tasks that preserve accepted architecture.

This is a recommendation to `task-authoring`.

`task-spec-review` does not perform architecture review itself.

---

# 13. Phase Boundary Review

Check that the task belongs to the current phase.

Flag:

- later-phase business functionality
- future infrastructure
- prematurely introduced tooling
- work explicitly assigned to later tasks
- functionality already completed by previous tasks
- duplicate work

For Foundation phases, be especially alert to accidental domain-feature creep.

---

# 14. Learning Review

Learning objectives should correspond to real concepts introduced by the task.

Flag objectives that are:

- unrelated
- excessively broad
- not actually exercised
- duplicated from previous tasks without reason

Do not require a learning objective for purely mechanical work.

---

# 15. Definition-of-Done Review

When the task includes its own Definition of Done, check that it agrees with
root repository policy.

It must not weaken:

- required review
- required QA
- required verification
- task completion documentation
- scope controls

Do not allow the task to redefine repository-wide completion rules
incompatibly.

---

# 16. Completion-State Review

For a newly authored task, ensure completion evidence is empty.

Flag fabricated claims such as:

- Completed
- tests passed
- QA passed
- review approved
- implementation complete

before implementation actually occurs.

---

# 17. Internal Consistency Review

Check the entire specification for contradictions.

Examples:

- requires a dependency but forbids adding dependencies
- requires browser tests but prohibits all browser verification
- requires a feature while declaring it out of scope
- requires exact versions but also delegates version selection
- claims no backend dependency while requiring backend runtime
- requires automated tests but defers testing infrastructure

A detailed task with internal contradictions is not ready for implementation.

---

# 18. Feasibility Review

Determine whether the task can reasonably be executed from current repository
state.

Check:

- prerequisites
- available tools
- existing dependencies
- configuration
- environment expectations
- implementation boundaries

Do not reject a task merely because implementation will require work.

Reject or block it when required preconditions genuinely do not exist.

---

# 19. Finding Severity

Use:

## P0 — Critical Specification Defect

Reserved for cases where executing the task as written could plausibly cause:

- destructive data loss
- serious security exposure
- production-impacting unsafe behavior

Rare during task-spec review.

P0 blocks approval.

## P1 — Must Fix Before Implementation

Examples:

- contradictory requirements
- missing prerequisite
- unverifiable core acceptance criterion
- requirement outside the phase boundary
- dangerous verification procedure
- unresolved business behavior required for implementation
- architecture decision silently forced despite needing approval

P1 blocks approval.

## P2 — Should Fix

Examples:

- ambiguous non-core wording
- weak acceptance evidence
- unnecessary implementation prescription
- incomplete edge-case specification
- excessive scope that can be tightened

P2 normally requires revision when it materially improves execution quality.

## P3 — Optional

Examples:

- minor wording improvement
- formatting
- small clarity improvement
- optional simplification

Do not inflate stylistic preferences.

---

# 20. Finding Requirements

Each finding must include:

- severity
- section
- issue
- why it matters
- recommended correction

Where helpful, include the exact requirement or criterion being reviewed.

Do not rewrite the entire task unless necessary.

Do not manufacture findings to appear thorough.

---

# 21. False-Positive Control

Before reporting a finding:

1. inspect the repository policy
2. inspect the phase
3. inspect prerequisite tasks
4. inspect accepted ADRs
5. inspect actual repository state when relevant
6. determine whether the issue materially affects execution

Do not flag an item simply because you personally prefer another design.

Task-spec review evaluates quality and consistency, not reviewer taste.

---

# 22. Review Result

Return:

`TASK_SPEC_RESULT: APPROVED`

when:

- no P0/P1 findings remain
- the task is sufficiently clear
- core acceptance criteria are verifiable
- scope matches the phase
- implementation can proceed safely

Return:

`TASK_SPEC_RESULT: REQUEST_CHANGES`

when:

- P0/P1 findings exist
- meaningful task contradictions exist
- core acceptance criteria cannot be verified
- important scope boundaries are unclear
- task requires revision before execution

Return:

`TASK_SPEC_RESULT: BLOCKED`

when:

- critical repository context is unavailable
- phase/prerequisite state cannot be determined
- task identity is fundamentally ambiguous
- required business information is unavailable and cannot be inferred safely

---

# 23. Output Contract

Return:

## Review Summary

Briefly assess the task specification.

## Findings

Order findings by severity:

1. P0
2. P1
3. P2
4. P3

For each finding:

### `<severity> — <short title>`

- **Section:** `<task section>`
- **Issue:** ...
- **Impact:** ...
- **Recommended correction:** ...

If there are no actionable findings:

`No actionable findings.`

## Acceptance Criteria Coverage

Summarize whether acceptance criteria have sufficient verification.

Identify any:

- uncovered criteria
- partially covered criteria

Use `Complete` when coverage is sufficient.

## Scope Assessment

Return:

- `ALIGNED`
- `NEEDS_REVISION`

Briefly explain material scope concerns.

## Prerequisite Assessment

Return:

- `SATISFIED`
- `UNSATISFIED`
- `UNCLEAR`

## Architecture Review

Return exactly one:

`ARCHITECTURE_REVIEW: REQUIRED`

or

`ARCHITECTURE_REVIEW: NOT_REQUIRED`

Briefly explain why.

## Implementation Readiness

Return:

- `READY`
- `NOT_READY`
- `BLOCKED`

## Final Result

Finish with exactly one:

`TASK_SPEC_RESULT: APPROVED`

`TASK_SPEC_RESULT: REQUEST_CHANGES`

or

`TASK_SPEC_RESULT: BLOCKED`

---

# 24. Re-Review

When reviewing a revised task:

1. inspect the complete current specification
2. verify prior blocking findings were actually addressed
3. check whether the revision introduced contradictions
4. re-evaluate acceptance-to-verification coverage
5. re-evaluate whether architecture review is required

Do not automatically carry forward previous approval.

A materially changed task requires fresh review.

---

# 25. Boundaries

This skill does not:

- modify the task
- author requirements
- choose unresolved architecture
- implement code
- install dependencies
- execute task implementation verification
- approve architecture
- update task completion
- update phase status
- commit
- push

Return findings to `task-authoring`.