# API Design Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

The API is a contract between your frontend and backend. Whether it's Server Actions, API routes, Edge Functions, or RPC calls — consistency in how data flows across the boundary makes the codebase predictable and debuggable.

## Response Shape

Use a consistent response shape for all server-to-client communication:

### Success

```typescript
{
  data: T        // the requested resource(s)
}
```

### Error

```typescript
{
  error: {
    code: string           // machine-readable: "NOT_FOUND", "VALIDATION_ERROR"
    message: string        // human-readable: "Item not found"
    fields?: Record<string, string[]>  // field-level errors for forms
  }
}
```

### Rules

- **Never mix shapes.** Every endpoint returns `{ data }` or `{ error }`, never both, never neither.
- **Never return raw Supabase errors to the client.** Map them to your error shape.
- **Never return raw exceptions.** Catch, log, and return a structured error.

## [STACK-SPECIFIC] Server Mutations

> Replace with the stack's mutation pattern:
> - Server Actions (Next.js): how to return structured responses from `'use server'` functions
> - Loaders/Actions (TanStack Start, Remix): how data flows through loaders and actions
> - API routes: REST conventions if applicable
> - Edge Functions: request/response patterns

### General Mutation Pattern

```typescript
// 1. Validate input
const result = schema.safeParse(input)
if (!result.success) {
  return { error: { code: 'VALIDATION_ERROR', message: 'Invalid input', fields: result.error.flatten().fieldErrors } }
}

// 2. Authenticate
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }
}

// 3. Execute
const { data, error } = await supabase.from('items').insert({ ...result.data, user_id: user.id }).select().single()
if (error) {
  logger.error('failed to create item', { userId: user.id, error: error.message })
  return { error: { code: 'SERVER_ERROR', message: 'Failed to create item' } }
}

// 4. Return
return { data }
```

The order is always: **validate → authenticate → authorize → execute → return**.

## Data Fetching

### [STACK-SPECIFIC] Query Patterns

> Replace with:
> - Server Components fetching (Next.js)
> - TanStack Query patterns (SPA)
> - Loader patterns (TanStack Start)
> - How to type Supabase queries

### General Rules

- **Fetch only what you need.** Use `.select('id, title, created_at')` not `.select('*')` in production queries.
- **Paginate lists.** Never return unbounded arrays. Use `.range(offset, offset + limit)`.
- **Handle empty states.** An empty array is valid data, not an error.
- **Type your responses.** Use Supabase generated types or Zod schemas to validate API responses.

```typescript
// Pagination pattern
const PAGE_SIZE = 20

const { data, error, count } = await supabase
  .from('items')
  .select('id, title, created_at', { count: 'exact' })
  .order('created_at', { ascending: false })
  .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
```

## Supabase Edge Functions

When the frontend needs server logic beyond CRUD (payment processing, external API calls, complex business logic):

```typescript
// supabase/functions/process-payment/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  // 1. Parse and validate
  const body = await req.json()
  const result = paymentSchema.safeParse(body)
  if (!result.success) {
    return new Response(JSON.stringify({ error: { code: 'VALIDATION_ERROR', message: 'Invalid input' } }), { status: 400 })
  }

  // 2. Authenticate (get user from auth header)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }), { status: 401 })
  }

  // 3. Execute business logic
  // ...

  // 4. Return
  return new Response(JSON.stringify({ data: result }), { status: 200 })
})
```

## Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| Server Actions | `verbNoun` | `createItem`, `updateProfile`, `deleteOrder` |
| API routes | RESTful paths | `/api/items`, `/api/items/[id]` |
| Edge Functions | kebab-case directory | `supabase/functions/process-payment/` |
| Query keys | descriptive arrays | `['items', userId]`, `['item', itemId]` |
| Zod schemas | `nounSchema` | `createItemSchema`, `updateProfileSchema` |

## Versioning

For MVP templates, don't version your API. When you need versioning:
- **URL-based**: `/api/v2/items` (simplest, most explicit)
- **Header-based**: `Accept: application/vnd.myapp.v2+json` (cleaner URLs, harder to test)

Don't add versioning infrastructure until you actually have a breaking change.

## Rate Limiting

- **Supabase**: Built-in rate limiting on auth endpoints. Configure in Supabase dashboard.
- **API routes / Server Actions**: Add rate limiting when you have public-facing endpoints. Not needed for authenticated-only endpoints in MVP phase.
- **Edge Functions**: Use Supabase's built-in invocation limits or add custom logic with a Redis counter.

[STACK-SPECIFIC: How to implement rate limiting in this stack's middleware/API layer]
