
### `.codex/skills/qa-validation/SKILL.md`

```md
---
name: qa-validation
description: Independently validate a NexusCRM implementation against task acceptance criteria, runtime behavior, regression checks, security-sensitive behavior, persistence behavior, and completion evidence after implementation and code review.
---

# QA Validation

Use this skill after implementation for independent evidence-based validation.

QA validates whether the resulting system satisfies the task.

Code review asks:

> Is the implementation technically sound?

QA asks:

> Does the resulting behavior actually satisfy the requirement?

This skill is read-only with respect to production implementation and planning
state.

Do not modify:

- production implementation
- tests
- task documentation
- phase documentation

unless a separate explicit instruction authorizes such work.

If QA finds a defect, return it to the orchestrator for repair.

Do not fix it yourself.

## Objective

Validate the implementation using evidence rather than assumptions.

A task must not pass QA merely because:

- the code compiles
- unit tests pass
- code review approved it
- another agent says it works
- the implementation matches the plan

Validate actual requirements.

## Procedure

1. Read:
   - root `AGENTS.md`
   - applicable nested `AGENTS.md`
   - active task
   - corresponding phase
   - applicable accepted ADRs
   - relevant source
   - relevant tests

2. Inspect:
   - current Git state
   - implementation diff
   - untracked files
   - current revision/worktree being validated

3. Record the revision or worktree state.

4. Map every acceptance criterion to:
   - executable verification
   - runtime verification
   - explicit manual verification where automation is not reasonable

5. Distinguish:
   - requirement
   - implementation evidence
   - test evidence
   - manual evidence
   - another agent's assertion

6. Execute required verification.

7. Validate high-risk behavior based on actual task scope.

8. Report failures to the orchestrator.

9. After repairs, rerun affected verification.

Do not invent unrelated requirements.

## Acceptance Criteria Mapping

Every acceptance criterion must end with exactly one state:

- `PASS`
- `FAIL`
- `BLOCKED`

`PASS` means sufficient evidence proves the criterion.

`FAIL` means executed validation demonstrates incorrect behavior.

`BLOCKED` means required validation could not be completed.

Do not mark an untested criterion as PASS.

## Verification

Run:

- task-specific commands
- required compilation
- tests
- lint
- typecheck
- builds
- integration verification
- runtime verification

according to the active task and applicable repository instructions.

Do not assume every project always has the same scripts.

Inspect the repository first.

Useful scope checks include:

```bash
git diff --check
git status --short --untracked-files=all
git diff