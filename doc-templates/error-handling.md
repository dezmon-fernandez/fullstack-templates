# Error Handling Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Errors are either **expected** (validation failures, not-found, auth denied) or **unexpected** (null ref, network timeout, bug). Handle them differently:

- **Expected**: Return structured feedback to the user. Don't log as error.
- **Unexpected**: Log with full context, show generic message to user, fix the underlying issue.

## Error Categories

| Category | HTTP Status | Log Level | User Message |
|----------|-------------|-----------|-------------|
| Validation | 400 | debug/none | Field-specific messages |
| Authentication | 401 | warn (if suspicious) | "Please sign in" |
| Authorization | 403 | warn | "You don't have access" |
| Not Found | 404 | debug/none | "Not found" or redirect |
| Rate Limited | 429 | warn | "Too many requests, try again" |
| Server Error | 500 | error | "Something went wrong" |
| External Service | 502/503 | error | "Temporarily unavailable" |

## Rules

1. **Don't swallow errors silently.** Every catch block must either handle the error meaningfully or re-throw it.
2. **Don't expose internals.** Stack traces, SQL errors, and internal IDs never reach the client in production.
3. **Fail fast on startup.** Missing env vars, bad config, unreachable databases — crash immediately with a clear message, don't limp along.
4. **Validate at boundaries only.** Validate user input, API responses, and URL params. Don't re-validate data flowing between internal functions.
5. **Use typed errors for control flow.** Distinguish "not found" from "server error" in the type system, not by parsing message strings.

## Error Types

Define a small set of application error types. Don't create one per feature — keep it minimal.

```typescript
// Base application error
class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// Common subtypes
class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, 'NOT_FOUND', 404)
  }
}

class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly fields: Record<string, string[]>,
  ) {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403)
  }
}
```

You don't need these from day one. Start with raw errors, extract types when you find yourself checking `error.message` strings.

## [STACK-SPECIFIC] Error Boundaries

> Replace with the stack's error boundary pattern:
> - React error boundaries (error.tsx in App Router, ErrorBoundary component in SPA)
> - How to display user-facing error states
> - How to recover (retry, redirect, reset)
> - Nested vs global error boundaries

## [STACK-SPECIFIC] Server-Side Error Handling

> Replace with:
> - How server errors are caught and returned (Server Actions, API routes, loaders)
> - How to return structured errors to the client
> - Middleware-level error handling
> - Database/Supabase error patterns (RLS empty arrays vs real errors)

## [STACK-SPECIFIC] Form and Mutation Errors

> Replace with:
> - How validation errors flow from server to form UI
> - Integration with form library (React Hook Form + Zod)
> - Optimistic update rollback patterns
> - Toast/notification patterns for mutation failures

## Supabase Error Patterns

These apply across all Supabase-backed templates:

```typescript
// RLS returns empty array, not an error — check both
const { data, error } = await supabase.from('items').select('*')
if (error) throw error           // actual database/network error
if (!data?.length) return []     // might be RLS blocking, or just empty

// Auth errors
const { data, error } = await supabase.auth.getUser()
if (error || !data.user) {
  // Not authenticated — redirect or return 401
}

// Mutations — always check error
const { error } = await supabase.from('items').insert({ title })
if (error) {
  if (error.code === '23505') {
    // unique constraint violation — return validation error
  }
  throw error // unexpected — let error boundary handle
}
```

## Anti-Patterns

- `catch (e) { console.log(e) }` — swallowed error, no handling
- `catch (e) { return null }` — hides failure, caller can't distinguish "no data" from "broken"
- `catch (e) { throw new Error("Something went wrong") }` — destroys context
- Wrapping every function call in try/catch — let errors propagate to boundaries
- Checking `typeof error === 'string'` — normalize at the catch site, not everywhere
