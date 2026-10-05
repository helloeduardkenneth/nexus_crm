---
name: nexuscrm-pull-request-review
description: Perform an independent, read-only review of a NexusCRM pull request, classify findings by severity, and return a deterministic merge recommendation.
---

# NexusCRM Pull Request Review

Use this skill when asked to:

- review a pull request
- re-review a pull request after new commits
- validate whether a pull request is safe to merge
- perform an independent code review
- produce structured review findings for GitHub Actions

This skill is strictly read-only.

Do not modify implementation files.

Do not modify tests.

Do not update planning documents.

Do not commit, push, merge, or amend Git history.

The purpose of this skill is independent verification.

---

## Review Objective

Determine whether the pull request:

1. satisfies its intended task
2. preserves NexusCRM architecture
3. introduces no blocking correctness or security issues
4. contains adequate tests
5. avoids unrelated changes
6. is safe to merge from a code-quality perspective

Do not approve a pull request merely because:

- it compiles
- tests pass
- the implementation agent says it is correct
- the diff is small
- the implementation matches the original plan

Review the actual repository state.

---

# 1. Load Repository Context

Before reviewing the diff, read:

1. root `AGENTS.md`
2. applicable nested `AGENTS.md`
3. active or referenced task specification
4. relevant phase document
5. applicable ADRs
6. relevant existing implementation
7. relevant tests

Use repository instructions as the review policy.

If the pull request references a task ID, use that task as the primary source of acceptance criteria.

If no task is referenced, infer intended behavior only from:

- pull request title
- pull request description
- changed code
- repository documentation

Do not invent undocumented requirements.

---

# 2. Establish Review Range

Determine:

- base SHA
- head SHA
- changed files
- complete pull request diff

Review the changes introduced between the base and head revisions.

Do not review unrelated historical changes unless surrounding code is necessary to understand the pull request.

Record the reviewed head SHA.

All review conclusions apply only to that exact head revision.

If the head SHA changes, the previous approval is stale and a new review is required.

---

# 3. Inspect the Diff

Inspect:

- every changed production file
- every changed test file
- migrations
- configuration changes
- dependency changes
- build configuration
- documentation relevant to behavior
- CI or infrastructure changes

Do not review only the patch in isolation.

Read enough surrounding code to understand:

- callers
- dependencies
- data flow
- transaction boundaries
- authorization boundaries
- state ownership
- error handling
- existing conventions

---

# 4. Validate Task Scope

Determine whether the pull request stays within its intended scope.

Flag:

- unrelated refactoring
- unrelated formatting churn
- unrelated dependency updates
- architectural changes not required by the task
- behavior changes not mentioned by the task
- accidental generated files
- unexpected lockfile changes

A pull request should remain focused on one coherent change.

Do not flag necessary supporting changes simply because they touch additional files.

---

# 5. Correctness Review

Look for concrete correctness defects.

Evaluate:

- incorrect conditions
- missing branches
- incorrect state transitions
- null handling
- invalid assumptions
- stale state
- duplicate operations
- partial updates
- incorrect calculations
- off-by-one errors
- lifecycle mistakes
- race conditions
- inconsistent validation
- incorrect exception handling
- broken API contracts

For business workflows, verify that behavior matches the relevant task acceptance criteria.

---

# 6. Backend Review

For backend changes, inspect where applicable:

## Architecture

Check:

- controllers contain no business logic
- domain boundaries remain clear
- services have appropriate responsibilities
- modules do not create inappropriate coupling
- JPA entities are not exposed directly through REST APIs

## Persistence

Check:

- schema changes use Flyway
- entity mappings are correct
- relationships do not introduce unnecessary EAGER loading
- N+1 query risks are considered
- database constraints match business invariants
- indexes are appropriate when required
- migrations preserve existing data unless destructive behavior is explicitly approved

## Transactions

Check:

- transaction boundaries are intentional
- multi-step state changes are atomic when required
- external side effects are not incorrectly coupled to transactions
- failures cannot leave partial state

## Concurrency

Check:

- duplicate requests
- concurrent writes
- lost updates
- double-processing
- race conditions
- idempotency requirements
- optimistic or pessimistic locking needs

Do not invent concurrency requirements where none exist.

## API Design

Check:

- request validation
- response contracts
- status codes
- error behavior
- DTO boundaries
- backward compatibility where required
- pagination or filtering behavior where applicable

## Security

Check:

- authorization is enforced on the backend
- authentication assumptions are correct
- user-controlled identifiers cannot bypass authorization
- mass-assignment risks
- unsafe input handling
- information leakage
- insecure defaults

Frontend permission checks must never be treated as a security boundary.

---

# 7. Frontend Review

For frontend changes, inspect where applicable:

## State Management

Check:

- local state is not unnecessarily global
- Zustand stores do not accumulate unrelated responsibilities
- server state is not incorrectly duplicated into global client state
- stale or inconsistent state cannot occur easily

## React Behavior

Check:

- effect dependencies
- stale closures
- unnecessary effects
- unstable keys
- state derived unnecessarily from props
- rendering loops
- improper memoization
- incorrect asynchronous behavior
- race conditions between requests

## Forms

Check:

- validation matches backend requirements where appropriate
- React Hook Form usage is correct
- server errors are represented properly
- submission cannot accidentally duplicate actions
- loading and disabled states are handled

## Data Fetching

Check:

- loading states
- error states
- empty states
- cancellation or stale requests where relevant
- cache invalidation
- duplicate requests
- incorrect optimistic updates

## Accessibility

Check material UI changes for:

- semantic HTML
- accessible labels
- keyboard interaction
- focus behavior
- form error association
- interactive element semantics

## UX

Flag defects that materially affect behavior.

Do not turn code review into subjective visual preference feedback.

---

# 8. Test Review

Tests must validate behavior, not merely increase coverage.

Check:

- important business rules are tested
- regressions have regression tests when practical
- failure paths are represented
- edge cases are represented when meaningful
- mocks do not make tests meaningless
- assertions validate outcomes rather than implementation details
- persistence-sensitive behavior uses PostgreSQL/Testcontainers when required
- tests would actually fail if the implementation were broken

Flag missing tests only when there is meaningful regression risk.

Do not demand tests for trivial mechanical changes without justification.

---

# 9. Dependency Review

If dependencies changed:

Check:

- whether the dependency is actually necessary
- whether equivalent functionality already exists
- production vs development dependency classification
- version consistency
- lockfile correctness
- architectural impact
- licensing or operational implications when materially relevant

Unexpected dependency additions should be highlighted.

Do not automatically classify every new dependency as blocking.

---

# 10. Infrastructure and CI Review

For Docker, GitHub Actions, build, or infrastructure changes, check:

- reproducibility
- secret handling
- permissions
- destructive commands
- caching correctness
- environment assumptions
- pinned or intentional versions
- build/test behavior
- failure propagation

GitHub Actions must not expose secrets to untrusted pull-request code.

Pay extra attention to workflows using:

- `pull_request_target`
- repository write permissions
- deployment credentials
- API keys
- shell interpolation of user-controlled values

---

# 11. Documentation and Planning Consistency

Check whether behavior-changing implementation requires documentation updates.

For task-completion changes, verify that:

- completion claims match actual implementation
- listed verification matches commands actually executed
- task state matches repository reality
- phase status is not advanced prematurely

Do not block a pull request for missing documentation that the project does not require.

---

# 12. Severity Classification

Every finding must use exactly one severity.

## P0 — Critical

Use for issues such as:

- exploitable critical security vulnerability
- likely data loss or corruption
- catastrophic production failure
- severe authorization bypass

P0 always blocks merge.

## P1 — Must Fix

Use for:

- definite correctness bugs
- meaningful security vulnerabilities
- broken acceptance criteria
- incorrect transaction behavior
- serious concurrency defects
- API-breaking behavior not intended by the task
- missing validation that creates material risk
- implementation that cannot safely ship

P1 blocks merge.

## P2 — Should Fix

Use for:

- meaningful maintainability problems
- limited edge-case defects
- weak test coverage with real regression risk
- avoidable architectural debt
- non-critical performance problems
- implementation concerns that do not make the feature unsafe

P2 does not automatically block merge unless repository policy says otherwise.

## P3 — Optional

Use for:

- minor cleanup
- small readability improvements
- optional simplification
- non-essential polish

Do not inflate minor preferences into P2 or P1.

---

# 13. Finding Quality Requirements

Only report concrete, actionable findings.

Every finding must contain:

- severity
- file
- line or relevant location
- issue
- why it matters
- recommended correction

Prefer precise findings over broad commentary.

Bad:

> This code could be cleaner.

Good:

> P1 — `OrderService.java:142`  
> `processPayment()` checks the current status before the transaction acquires
> any locking protection. Two concurrent requests can both observe `PENDING`
> and create duplicate payments. Make payment processing idempotent or enforce
> an appropriate concurrency control at the persistence boundary.

Do not manufacture findings to make the review appear useful.

If no meaningful issue exists, approve the pull request.

---

# 14. Avoid False Positives

Before reporting a finding:

1. inspect surrounding implementation
2. check whether another layer already handles the concern
3. inspect relevant tests
4. check applicable repository instructions
5. verify that the issue is introduced or materially exposed by this pull request

Do not report hypothetical issues without a credible failure scenario.

Do not report stylistic preferences unless they violate repository rules.

Do not flag pre-existing issues unless the pull request materially worsens them.

If a pre-existing issue is discovered but unrelated to the PR, mention it only
as an optional note when materially useful.

---

# 15. Re-review Behavior

When reviewing a pull request that was previously reviewed:

1. identify the new head SHA
2. inspect changes since the previous reviewed revision when available
3. verify that previously blocking findings were actually resolved
4. review the complete current PR diff for regressions caused by the fix
5. do not assume unchanged findings remain valid without checking
6. do not carry forward stale approval

A fix for one finding may introduce another defect.

Every new head SHA requires a fresh merge recommendation.

---

# 16. Review Result

Return exactly one final result:

`APPROVE`

or

`REQUEST_CHANGES`

Use `REQUEST_CHANGES` when:

- one or more P0 findings exist
- one or more P1 findings exist
- required task behavior is clearly incomplete
- the PR cannot be safely evaluated because critical required context is missing

Otherwise use `APPROVE`.

P2 and P3 findings alone normally do not require `REQUEST_CHANGES`.

---

# 17. Output Format

Use this format:

## Pull Request Review

**Result:** APPROVE | REQUEST_CHANGES  
**Reviewed Head:** `<head-sha>`  
**Base:** `<base-sha>`

### Summary

Briefly describe what the pull request changes and the overall review result.

### Findings

If findings exist:

#### P1 — Short Finding Title

- **File:** `path/to/file`
- **Location:** line or symbol
- **Issue:** concrete defect
- **Impact:** why it matters
- **Recommended correction:** specific direction

Repeat for each finding.

Order findings by severity:

1. P0
2. P1
3. P2
4. P3

If there are no findings:

`No actionable findings.`

### Verification Notes

List relevant evidence inspected, such as:

- tests added or updated
- CI configuration
- migrations
- acceptance criteria
- important surrounding implementation

Do not claim commands were executed unless this review process actually
executed them.

### Final Recommendation

Finish with exactly one machine-readable line:

`REVIEW_RESULT: APPROVE`

or

`REVIEW_RESULT: REQUEST_CHANGES`

---

# 18. Structured Automation Output

When the caller requests structured output, return data equivalent to:

```json
{
  "result": "APPROVE",
  "reviewed_head_sha": "abc123",
  "summary": "Short review summary.",
  "findings": [
    {
      "severity": "P1",
      "file": "backend/src/main/java/example/OrderService.java",
      "line": 142,
      "title": "Duplicate payment race condition",
      "issue": "Two concurrent requests can process the same pending order.",
      "impact": "The customer may be charged twice.",
      "recommendation": "Add idempotency or persistence-level concurrency control."
    }
  ]
}
```

Allowed values for `result`:

- `APPROVE`
- `REQUEST_CHANGES`

Allowed values for `severity`:

- `P0`
- `P1`
- `P2`
- `P3`

An empty findings array is valid.

The structured result must agree with the human-readable recommendation.

---

# 19. Review Boundaries

This review does not:

- modify code
- fix findings
- commit changes
- push branches
- merge pull requests
- update planning state
- approve deployment
- replace required human approval

The implementation orchestrator is responsible for repairing findings.

The review agent is responsible only for detecting and explaining them.