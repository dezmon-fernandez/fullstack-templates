# Coding Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Naming

### Files and Directories

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | camelCase, `use` prefix | `useAuth.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Types/schemas | camelCase | `user.schema.ts`, `user.types.ts` |
| Constants | camelCase file, UPPER_SNAKE value | `config.ts` → `MAX_RETRIES` |
| Test files | match source + `.test` | `UserProfile.test.tsx` |
| Directories | kebab-case | `user-profile/`, `auth-flow/` |

### Code

| Type | Convention | Example |
|------|-----------|---------|
| Variables/functions | camelCase | `getUserById`, `isActive` |
| Types/interfaces | PascalCase | `UserProfile`, `AuthState` |
| Enums | PascalCase name, PascalCase members | `Role.Admin` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Booleans | `is`/`has`/`should`/`can` prefix | `isLoading`, `hasPermission` |
| Event handlers | `handle` prefix | `handleSubmit`, `handleClick` |
| Async functions | verb that implies async | `fetchUser`, `createOrder` |

### Naming Rules

- Names should describe **what**, not **how**: `getActiveUsers` not `filterUserArrayByStatus`
- Avoid abbreviations except universally known ones (`id`, `url`, `api`)
- Collections are plural: `users`, `orderItems`
- Don't encode types in names: `users` not `userList`, `count` not `countNumber`

## TypeScript

### Strict Mode

All templates use `strict: true`. Non-negotiable settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### Type Rules

- **Never use `any`**. Use `unknown` if the type is truly unknown, then narrow.
- **Prefer `z.infer<typeof schema>`** over manually written types when a Zod schema exists.
- **Explicit return types** on exported functions and all functions longer than one expression.
- **No type assertions (`as`)** unless unavoidable (e.g., Supabase generic params). Add a comment explaining why.
- **Use `satisfies`** for type checking without widening: `const config = { ... } satisfies Config`

### Imports

```typescript
// Prefer named imports
import { createClient } from '@/lib/supabase/server'

// Use `type` imports for types
import type { User } from '@/features/auth'

// Absolute imports via path alias
import { Button } from '@/components/ui/button'
```

## Functions

- **Keep functions short.** If it doesn't fit on screen (~30 lines), extract a helper.
- **Single responsibility.** A function does one thing. If the name has "and", split it.
- **Early returns** over nested conditionals. Guard clauses at the top.
- **Limit parameters to 3.** Use an options object for more.

```typescript
// BAD - deep nesting
function processOrder(order: Order): Result {
  if (order) {
    if (order.items.length > 0) {
      if (order.status === 'pending') {
        // actual logic buried here
      }
    }
  }
}

// GOOD - early returns
function processOrder(order: Order): Result {
  if (!order) throw new NotFoundError('order', order.id)
  if (!order.items.length) return { status: 'empty' }
  if (order.status !== 'pending') return { status: 'skipped' }

  // actual logic at top level
}
```

## Components

[STACK-SPECIFIC: Component patterns — server vs client, when to use 'use client', component file structure, props patterns]

### General Rules

- **One component per file** for anything non-trivial.
- **Props interfaces** defined in the same file, above the component.
- **Destructure props** in the function signature.
- **Handle all states**: loading, error, empty, success.
- **Colocate** — keep components near the feature that uses them, not in a global components folder (except shared UI like shadcn).

## Code Organization

### Vertical Slice Rules

Features are self-contained. A feature owns its components, hooks, schemas, types, and tests.

```
features/
└── orders/
    ├── __tests__/
    │   ├── use-orders.test.ts
    │   └── OrderList.test.tsx
    ├── components/
    │   ├── OrderList.tsx
    │   └── OrderCard.tsx
    ├── hooks/
    │   └── use-orders.ts
    ├── schemas/
    │   └── order.schema.ts
    ├── types/
    │   └── order.types.ts
    └── index.ts          # Public API — only export what routes need
```

### The `index.ts` Barrel

Every feature has an `index.ts` that explicitly exports its public API. Routes import from the barrel, never reach into feature internals.

```typescript
// features/orders/index.ts
export { OrderList } from './components/OrderList'
export { useOrders } from './hooks/use-orders'
export type { Order } from './types/order.types'
```

### Import Rules (Enforced)

| From | Can Import | Cannot Import |
|------|-----------|---------------|
| Routes/pages | Features (via index.ts), Shared | Feature internals |
| Features | Other features, Shared | Routes/pages |
| Shared (lib/, components/ui) | Nothing app-specific | Features, Routes |

## Comments

- **Don't comment what the code does** — the code says that.
- **Do comment why** — business rules, non-obvious constraints, workarounds.
- **TODO format**: `// TODO(username): description — JIRA-123` or just `// TODO: description`
- **Delete commented-out code.** Git has history.

## Dependencies

- **Pin exact versions** in templates (`"react": "19.2.3"` not `"^19.2.3"`). Users can loosen after scaffolding.
- **Minimize dependencies.** Before adding a package: can a 10-line utility do the job?
- **Audit before adding.** Check bundle size, maintenance status, and whether it's still the community standard.

## [STACK-SPECIFIC] Linting and Formatting

> Replace with:
> - Biome/ESLint configuration specifics
> - Auto-fix commands
> - Pre-commit hook setup (if any)
> - IDE integration notes

## [STACK-SPECIFIC] Module Patterns

> Replace with:
> - Server vs client module boundaries
> - Data fetching patterns (loaders, server components, hooks)
> - State management approach
> - Routing conventions
