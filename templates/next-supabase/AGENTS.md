# Next.js 16 + Supabase Full-Stack Template

This file provides guidance to Claude Code when working with Next.js App Router + Supabase projects with SSR/SEO capabilities.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 16.x |
| **Frontend** | React | 19.x |
| **Language** | TypeScript | 5.x (strict) |
| **Package Manager** | pnpm | 9.x |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | v4 |
| **Forms** | React Hook Form + Zod | Latest |
| **Backend** | Supabase | Latest |
| **Linting** | Biome | 2.0+ |
| **Testing** | Vitest + Testing Library | Latest |

## Architecture: Vertical Slices + App Router

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth route group (login, signup)
│   ├── (marketing)/      # Public pages (landing, about)
│   ├── (dashboard)/      # Protected pages
│   │   └── layout.tsx    # Auth-protected layout
│   ├── layout.tsx        # Root layout (<html>, <body>)
│   ├── loading.tsx       # Global loading UI
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # Global 404
├── features/             # Self-contained vertical slices
│   └── [feature]/
│       ├── __tests__/
│       ├── components/   # Feature UI (Server + Client Components)
│       ├── actions/      # Server Actions ('use server')
│       ├── schemas/      # Zod validation schemas
│       ├── types/
│       └── index.ts      # Public API
├── lib/                  # Shared utilities
│   ├── supabase/
│   │   ├── server.ts     # Server-side Supabase client
│   │   └── client.ts     # Browser-side Supabase client
│   └── utils.ts
├── components/           # Shared UI (shadcn/ui, layout)
│   └── ui/
└── middleware.ts          # Auth session refresh
```

**Import Rules:**
- Pages (app/) → Features (ONLY from feature's `index.ts` public API)
- Features → Shared (lib/, components/)
- Features → Features
- Shared → Features NEVER
- Server Actions → lib/ for Supabase clients

**Page Responsibility:**
- Pages are THIN - they compose feature exports, not implement logic
- Server Components fetch data via feature actions or Supabase directly
- Client Components use feature components, not inline JSX
- Types imported from features, not defined in pages

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm biome check .    # Lint and format
pnpm tsc --noEmit     # Type check

# Testing
pnpm test             # Run tests (watch)
pnpm test --run       # Run once (CI)

# Supabase
supabase start        # Local Supabase
supabase db reset     # Reset with migrations
supabase gen types typescript --local > src/lib/types/database.types.ts
```

## Next.js Patterns

### Server Components (Default)

All components are Server Components by default. Use them for:
- Fetching data directly from Supabase
- Keeping secrets on the server
- Reducing client JavaScript bundle

```typescript
// Server Component - no 'use client' directive needed
import { createClient } from '@/lib/supabase/server'

export default async function ItemList() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*')

  return (
    <ul>
      {items?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

### Client Components

Mark with `'use client'` only when you need state, event handlers, or browser APIs:

```typescript
'use client'

import { useState, type ReactElement } from 'react'

export function Counter(): ReactElement {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

### Server Actions

Use `'use server'` for mutations. Replace API routes for most use cases:

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string

  const { error } = await supabase.from('items').insert({ title })
  if (error) throw error

  revalidatePath('/items')
}
```

### Data Flow Pattern (CRITICAL)

Server Components fetch data → pass as props → Client Components handle interactivity → Server Actions mutate → `revalidatePath()` refreshes.

```typescript
// Page (Server Component) - fetches data
import { createClient } from '@/lib/supabase/server'
import { ItemList } from '@/features/items'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*')

  return <ItemList items={items ?? []} />
}

// Client Component - handles interactions
'use client'

import { deleteItem } from '../actions/items'
import type { Item } from '../schemas/items.schema'

export function ItemList({ items }: { items: Item[] }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.title}
          <form action={deleteItem.bind(null, item.id)}>
            <button type="submit">Delete</button>
          </form>
        </li>
      ))}
    </ul>
  )
}
```

### SEO with generateMetadata

```typescript
import type { Metadata } from 'next'

// Static metadata
export const metadata: Metadata = {
  title: 'Items | MyApp',
  description: 'Browse all items',
}

// Dynamic metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id)

  return {
    title: `${item.name} | MyApp`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
      images: [item.imageUrl],
    },
  }
}
```

### File Conventions

```
app/
├── layout.tsx      # Shared UI wrapper (persistent across navigations)
├── page.tsx        # Route UI (unique content)
├── loading.tsx     # Loading UI (auto-wrapped in Suspense)
├── error.tsx       # Error boundary ('use client' required)
├── not-found.tsx   # 404 UI
└── [param]/        # Dynamic route segment
    └── page.tsx
```

### Route Groups

Parentheses organize routes without affecting URLs:

```
app/
├── (auth)/           # /login, /signup (no /auth/ prefix)
│   ├── login/page.tsx
│   └── signup/page.tsx
├── (marketing)/      # /, /about
│   ├── page.tsx
│   └── about/page.tsx
└── (dashboard)/      # /dashboard, /settings
    ├── layout.tsx    # Auth-protected layout
    ├── dashboard/page.tsx
    └── settings/page.tsx
```

### Middleware for Auth

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.getUser()
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Streaming with Suspense

```typescript
import { Suspense } from 'react'
import { ItemList } from '@/features/items'
import { Skeleton } from '@/components/ui/skeleton'

export default function ItemsPage() {
  return (
    <main>
      <h1>Items</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ItemList />
      </Suspense>
    </main>
  )
}
```

## Code Patterns

### React 19
```typescript
import { type ReactElement } from 'react'

// Use ReactElement, not JSX.Element
function Component(): ReactElement {
  return <div>...</div>
}

// Don't manually memoize - React Compiler handles it
```

### React 19 Actions with useActionState
```typescript
'use client'

import { useActionState, type ReactElement } from 'react'

function ContactForm(): ReactElement {
  const [state, submitAction, isPending] = useActionState(
    async (prevState: unknown, formData: FormData) => {
      const result = schema.safeParse(Object.fromEntries(formData))
      if (!result.success) return { error: result.error.flatten() }
      await submitData(result.data)
      return { success: true }
    },
    null
  )

  return (
    <form action={submitAction}>
      <button disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
```

### Zod Validation
```typescript
import { z } from 'zod'

// Validate at system boundaries (API responses, form inputs, URL params)
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
})

type User = z.infer<typeof userSchema>
```

### Component State Handling
```typescript
// Server Component with error handling
export default async function FeaturePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.from('items').select('*')

  if (error) throw error
  if (!data?.length) return <EmptyState />

  return <FeatureContent data={data} />
}
```

### TypeScript
```typescript
// No `any` - use `unknown` if type is truly unknown
// Explicit return types for functions
// Use z.infer<typeof schema> for types from Zod
```

### Supabase
```typescript
// Server-side (in Server Components, Server Actions, Route Handlers)
import { createClient } from '@/lib/supabase/server'

// Client-side (in Client Components for real-time, auth UI)
import { createClient } from '@/lib/supabase/client'
```

## PRP Workflow

**New App**: Edit `PRPs/INITIAL.md` → `/generate-next-supabase-prp PRPs/INITIAL.md`

**New Feature**: Edit `PRPs/FEATURE.md` → `/generate-next-supabase-prp PRPs/FEATURE.md`

**Quick Feature**: `/generate-next-supabase-prp "add dark mode toggle"`

Then execute: `/execute-next-supabase-prp PRPs/[generated-file].md`

## UX Best Practices
- **Leverage shadcn structure** - Don't rewrite components; customize via props and Tailwind
- **Simple component trees** - Prefer flat, readable structures over deep nesting
- **Make aesthetic choices** - Colors, transitions, and typography should feel intentional, not stock
- **Consistent spacing** - Use Tailwind spacing scale consistently (p-4, gap-4, etc.)
- **Loading states** - Show skeletons for async content, disable buttons during submission
- **Error states** - Display inline errors near the problem, not just toasts
- **Mobile first** - Start with mobile layout, add responsive breakpoints as needed
- **Accessible by default** - Use semantic HTML, proper labels, keyboard navigation

## Code Philosophy

- **Don't over-engineer** - Solve the current problem, not hypothetical future ones
- **No premature abstractions** - Duplicate code is fine until a pattern emerges 3+ times
- **Minimal indirection** - Prefer inline logic over layers of helpers and utilities
- **Delete aggressively** - Remove unused code, don't comment it out "just in case"

## Common Gotchas

### Next.js App Router
- **Server vs Client**: Components are Server Components by default. Add `'use client'` only for state/events/browser APIs
- **`'use client'` boundary**: Once a file is marked `'use client'`, ALL its imports become client code. Keep the boundary as low as possible
- **Server Actions**: Must be in files marked `'use server'` or inline with `'use server'` directive
- **Params are Promises**: In Next.js 16, `params` and `searchParams` are `Promise` types - always `await` them
- **Caching**: `fetch()` with `cache: 'force-cache'` for static, `cache: 'no-store'` for dynamic. GET Route Handlers are NOT cached by default
- **revalidatePath**: Call after mutations to refresh cached data
- **Middleware**: Runs at the edge before every matched request. Use for auth session refresh, not heavy logic

### Environment Variables
- **Client-accessible**: Must be prefixed with `NEXT_PUBLIC_`
- **Server-only**: No prefix needed, only available in Server Components/Actions/Route Handlers
- **Never expose secrets**: Stripe secret keys, API keys without `NEXT_PUBLIC_` prefix

### Supabase
- **Server**: Use `createClient()` from `@/lib/supabase/server` (handles cookies)
- **Client**: Use `createClient()` from `@/lib/supabase/client` for real-time subscriptions
- RLS returns empty array (not error) when blocking
- Run `supabase gen types` after EVERY migration
- Always use `getUser()` not `getSession()` for server-side auth verification

### Tailwind v4
- No config file - use `@theme` in CSS
- Utility-first approach

### Testing
- Run tests after each phase, don't batch to the end
- Use `server-only` package to prevent accidental client imports of server code

### Deployment
- **Vercel**: Zero-config, works out of the box
- **Docker**: Use `output: 'standalone'` in next.config.ts
- **Self-hosted**: Requires Node.js runtime

## Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Server (.env.local - no prefix)
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
```
