
### `.codex/skills/frontend-implementation/SKILL.md`

```md
---
name: frontend-implementation
description: Implement an approved NexusCRM React and TypeScript task under frontend/, including components, screens, forms, routing, client state, API integration, accessibility, responsive behavior, and visual UI implementation.
---

# Frontend Implementation

Use this skill for authorized frontend implementation.

Do not use it for:

- task authoring
- architecture-only analysis
- read-only diagnosis
- independent code review

The active task defines scope.

The root and frontend `AGENTS.md` files define engineering policy.

Accepted ADRs define architecture decisions.

## Objective

Implement the smallest correct frontend change that is:

- strongly typed
- accessible
- maintainable
- responsive where applicable
- consistent with existing UI
- aligned with backend contracts
- appropriately tested

Prefer simple component composition over premature abstraction.

## Procedure

1. Read:
   - root `AGENTS.md`
   - `frontend/AGENTS.md`
   - active task
   - corresponding phase
   - applicable accepted ADRs
   - relevant design/API documentation when present

2. Inspect:
   - affected routes
   - components
   - reusable UI primitives
   - Zustand stores
   - API/client utilities
   - existing tests
   - `package.json`
   - `pnpm-lock.yaml`
   - TypeScript configuration
   - build configuration
   - current Git worktree

3. Preserve developer-authored uncommitted changes.

4. Extract:
   - expected behavior
   - acceptance criteria
   - state ownership
   - API dependencies
   - loading behavior
   - error behavior
   - empty states
   - accessibility requirements
   - responsive requirements
   - visual requirements
   - tests
   - verification

5. Produce the smallest implementation plan.

6. Implement only the authorized task.

7. Add or update behavioral tests where required.

8. Run applicable verification.

9. Perform a self-review.

10. Return implementation to the orchestrator for independent review and QA.

## State Ownership

Before introducing state, determine whether it belongs to:

- component-local state
- URL/router state
- form state
- server-derived state
- genuinely shared application state

Prefer local state for local behavior.

Use URL state when navigation or shareable application state belongs in the
URL.

Use React Hook Form for substantial approved form work.

Use Zustand only for genuinely shared client-side state.

Do not move temporary component state into Zustand merely for convenience.

Do not unnecessarily duplicate server data into global client state.

## Component Design

Prefer:

- focused components
- predictable props
- composition
- established reusable primitives
- clear ownership
- understandable data flow

Avoid:

- giant page components
- premature generic abstractions
- duplicated UI behavior
- unnecessary wrapper components
- abstractions used only once without improving clarity

Extract reusable components only when reuse, ownership, readability, or
testing meaningfully benefits.

## TypeScript

Use strict TypeScript according to project configuration.

Avoid:

- unnecessary `any`
- broad type assertions
- `as unknown as`
- unsafe non-null assertions without justification
- duplicated API models
- types that permit invalid states unnecessarily

Reuse established project types where appropriate.

Do not weaken TypeScript configuration to make code compile.

## Forms

Use established form conventions.

For React Hook Form work:

- validate inputs
- expose field errors
- support backend validation errors
- handle submission state
- prevent accidental duplicate submission where relevant
- make reset behavior intentional
- preserve accessible labels and error associations

Frontend validation improves UX.

Backend validation remains authoritative.

## Routing

For React Router changes:

- follow the established route structure
- preserve expected navigation behavior
- support invalid/missing route data
- avoid routing logic leaking into unrelated components
- preserve deep-link behavior where required

Do not restructure routing architecture without authorization.

## API Integration

For UI that communicates with the backend, handle relevant:

- loading state
- success state
- empty state
- error state
- retry behavior
- request cancellation
- stale requests
- duplicate requests

Do not silently assume backend fields or contracts.

If the required backend contract is undefined or conflicts with repository
documentation, return `BLOCKED` rather than inventing it.

## Accessibility

For interactive behavior, check:

- semantic HTML
- accessible names
- form labels
- keyboard interaction
- focus behavior
- form error association
- buttons versus links
- disabled behavior
- loading behavior

Do not replace semantic controls with clickable generic elements without a
clear reason.

## Visual and UX Work

When the task materially involves:

- visual design
- layout
- interaction design
- responsive behavior
- component polish
- dashboard composition
- forms
- loading/error/empty-state presentation

use applicable installed frontend design skills such as Impeccable.

Use those capabilities to improve:

- visual hierarchy
- spacing
- typography
- responsive behavior
- interaction feedback
- usability
- accessibility
- consistency with NexusCRM's established design language

Do not invoke visual-design skills for purely non-visual work such as:

- type fixes
- state bug fixes
- API wiring
- dependency maintenance
- test-only changes

Design skills must not override:

- task requirements
- accessibility
- repository architecture
- existing design-system constraints
- established NexusCRM patterns

Do not introduce generic AI-generated visual patterns when they conflict with
the product's existing design language.

## Styling

Use Tailwind CSS according to project conventions.

Avoid:

- unnecessary inline styling
- duplicated arbitrary values when project tokens exist
- large repeated class groups where an existing abstraction already exists
- inventing new design tokens without a requirement

Do not introduce another styling framework without architectural approval.

## Package Management

Use pnpm exclusively.

For approved dependency changes:

```bash
pnpm add <package>
pnpm remove <package>