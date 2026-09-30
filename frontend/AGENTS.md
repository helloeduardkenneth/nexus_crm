# Frontend Agent Instructions

## Stack

Use:

- React
- TypeScript
- Vite
- React Router
- Zustand
- React Hook Form
- Tailwind CSS
- Vitest
- React Testing Library
- Oxlint

## Package Manager

Use pnpm exclusively.

Allowed examples:

- `pnpm install`
- `pnpm add <package>`
- `pnpm add -D <package>`
- `pnpm remove <package>`
- `pnpm dev`
- `pnpm build`
- `pnpm test`
- `pnpm lint`

Do not use:

- npm
- Yarn
- Bun

The canonical frontend lockfile is:

`pnpm-lock.yaml`

Do not create:

- `package-lock.json`
- `yarn.lock`
- `bun.lock`
- `bun.lockb`

## Linting

Use Oxlint as the primary frontend linter.

Do not introduce ESLint unless explicitly required by an approved
architectural decision.

Do not disable lint rules merely to make verification pass.

## TypeScript

Use TypeScript strict mode.

Do not use `any` merely to silence TypeScript errors.

Avoid TypeScript suppression comments unless there is a documented
reason for them.

## State Management

Use Zustand for global client-side state.

Do not automatically place all state in Zustand.

Prefer:

- React local state for component-local state
- React Hook Form for form state
- URL/search parameters for navigational state
- Zustand for genuinely shared client-side state

Do not duplicate server data in Zustand without a clear architectural
reason.

## Verification

For frontend changes, run the applicable verification commands:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

Do not report a frontend task as complete if a required verification
command fails.

If a command cannot be executed, report:

- which command was not executed
- why it could not be executed
- whether this affects task completion

Do not hide or ignore verification failures.