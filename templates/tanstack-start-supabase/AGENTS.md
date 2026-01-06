# TanStack Start + Supabase Full-Stack Template

This file provides guidance to Claude Code when working with TanStack Start + Supabase projects with SSR/SEO capabilities.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Meta-Framework** | TanStack Start | RC |
| **Frontend** | React | 19.x |
| **Build** | Vite | 6.x |
| **Package Manager** | pnpm | 9.x |
| **Routing** | TanStack Router | Latest |
| **Data Fetching** | TanStack Query | v5 |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | v4 |
| **Forms** | React Hook Form + Zod | Latest |
| **Backend** | Supabase | Latest |
| **Linting** | Biome | 2.0+ |
| **Testing** | Vitest + Testing Library | Latest |

## Architecture: Vertical Slices + SSR

```
src/
├── routes/           # TanStack Router file-based routes
│   ├── __root.tsx    # Root layout (HeadContent, Scripts)
│   ├── _authed.tsx   # Auth layout wrapper
│   └── _authed/      # Protected routes
├── features/         # Self-contained vertical slices
│   └── [feature]/
│       ├── __tests__/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── server/   # Feature server functions
│       ├── types/
│       └── index.ts  # Public API
├── server/           # Global server utilities
│   ├── supabase.ts   # Server-side Supabase client
│   └── middleware/   # Auth and other middleware
└── shared/           # UI components, utils (NO business logic)
```

**Import Rules:**
- Routes -> Features (ONLY from feature's `index.ts` public API)
- Features -> Shared
- Features -> Features
- Shared -> Features NEVER
- Server functions -> Server utilities

**Route Responsibility:**
- Routes are THIN - they compose feature exports, not implement logic
- Loaders call feature server functions, not Supabase directly
- Components use feature components, not inline JSX
- Types imported from features, not defined in routes

## Development Commands

```bash
# Development
pnpm dev              # Start dev server with SSR
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
supabase gen types typescript --local > src/shared/types/database.types.ts
```

## SSR Patterns

### Server Functions
```typescript
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/server/supabase'

export const fetchItems = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from('items').select('*')
    if (error) throw error
    return data
  })
```

### Data Flow Pattern (CRITICAL)

Loader calls server functions → Component gets data via `useLoaderData()` → Mutations call server fn + `router.invalidate()`

```typescript
// Route - loader calls server function directly
import { fetchItems, ItemList } from '@/features/items'

export const Route = createFileRoute('/items')({
  loader: () => fetchItems(),  // Direct call to server function
  component: ItemsPage,
})

function ItemsPage() {
  const items = Route.useLoaderData()  // Get data from loader
  return <ItemList items={items} />    // Pass as typed props
}

// Component - receives props, mutations invalidate router
import { useRouter } from '@tanstack/react-router'
import { deleteItem } from '../server/items.server'

export function ItemList({ items }: { items: Item[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await deleteItem({ data: { id } })
    router.invalidate()  // Refetch loader data
  }
  // ...
}
```

### SEO Head Management
```typescript
export const Route = createFileRoute('/items/$id')({
  head: ({ loaderData }) => ({
    title: `${loaderData.item.name} | MyApp`,
    meta: [
      { name: 'description', content: loaderData.item.description },
      { property: 'og:title', content: loaderData.item.name },
    ],
  }),
  loader: async ({ params }) => ({ item: await fetchItem({ data: params }) }),
  component: ItemPage,
})
```

### Auth Middleware
```typescript
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { user } })
  }
)
```

### Selective SSR
```typescript
// Full SSR (default)
export const Route = createFileRoute('/seo-page')({
  ssr: true,  // Loader + render on server
})

// Data-only (server data, client render)
export const Route = createFileRoute('/dashboard')({
  ssr: 'data-only',  // Loader on server, render on client
})

// Client-only (no SSR)
export const Route = createFileRoute('/canvas-app')({
  ssr: false,  // Everything on client
})
```

## Code Patterns

### React 19
```typescript
import { type ReactElement } from 'react';

// Use ReactElement, not JSX.Element
function Component(): ReactElement {
  return <div>...</div>;
}

// Don't manually memoize - React Compiler handles it
```

### TanStack Query (Optional)

Router has built-in caching and SWR. **Only add Query when you need:**
- Polling (`refetchInterval`)
- Window focus refetch (`refetchOnWindowFocus`)
- Optimistic updates (`onMutate`)
- Granular cache invalidation (specific query keys)

For most features, use the default pattern:
```typescript
// Loader fetches, component uses data, mutations invalidate router
const items = Route.useLoaderData()
await deleteItem({ data: { id } })
router.invalidate()
```

### Supabase
```typescript
// Server-side (in server functions)
import { getSupabaseServerClient } from '@/server/supabase'

// Client-side (in components for real-time, etc.)
import { supabase } from '@/shared/utils/supabase'
```

## PRP Workflow

**New App**: Edit `PRPs/INITIAL.md` -> `/generate-tanstack-start-prp PRPs/INITIAL.md`

**New Feature**: Edit `PRPs/FEATURE.md` -> `/generate-tanstack-start-prp PRPs/FEATURE.md`

**Quick Feature**: `/generate-tanstack-start-prp "add dark mode toggle with SSR"`

Then execute: `/execute-tanstack-start-prp PRPs/[generated-file].md`

## Common Gotchas

### TanStack Start
- **SSR Mode**: Default is `ssr: true`. Use `ssr: false` for browser-only APIs
- **Server Functions**: Must use `createServerFn`, not regular async functions
- **Middleware**: Use `createMiddleware` for auth, logging, etc.
- **Head Tags**: Use `head` route option, not react-helmet

### TanStack Query v5 (if using)
- **Usually not needed** - Router has built-in caching/SWR
- Only add for: polling, window focus refetch, optimistic updates
- Status: `isLoading` -> `isPending`
- Time: `cacheTime` -> `gcTime`

### TanStack Router
- Dynamic params use `$` prefix: `$itemId.tsx`
- Run `pnpm dev` to generate `routeTree.gen.ts`
- Search params need Zod schemas for type safety

### Supabase
- **Server**: Use `getSupabaseServerClient()` in server functions
- **Client**: Use `supabase` from shared for real-time subscriptions
- RLS returns empty array (not error) when blocking
- Run `supabase gen types` after EVERY migration

### Deployment
- **Vercel**: Works out of the box with Nitro preset
- **Netlify**: Add `@netlify/vite-plugin-tanstack-start`
- **Cloudflare**: Use `cloudflare-module` preset

## Environment Variables

### Client (.env.local)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=
```

### Server (Edge Functions / Server)
```
STRIPE_SECRET_KEY=
OPENAI_API_KEY=
```
