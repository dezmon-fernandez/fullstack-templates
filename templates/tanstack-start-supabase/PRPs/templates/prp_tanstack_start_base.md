# PRP: [FEATURE_NAME]

## Metadata
- **Feature**: [FEATURE_NAME]
- **Affected Slices**: [LIST_AFFECTED_FEATURES]
- **Database Changes**: [YES_OR_NO]
- **SSR Mode**: [FULL/DATA_ONLY/CLIENT_ONLY]
- **SEO Required**: [YES_OR_NO]
- **New Dependencies**: [LIST_OR_NONE]

---

## Technology Stack Reference

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

---

## Documentation References

| Technology | Documentation |
|------------|---------------|
| TanStack Start | https://tanstack.com/start/latest/docs/framework/react/overview |
| Server Functions | https://tanstack.com/start/latest/docs/framework/react/guide/server-functions |
| Middleware | https://tanstack.com/start/latest/docs/framework/react/guide/middleware |
| Selective SSR | https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr |
| Head Management | https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management |
| TanStack Query v5 | https://tanstack.com/query/latest/docs/framework/react/overview |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side |
| shadcn/ui | https://ui.shadcn.com/docs |

---

## Research & Documentation

### Docs Consulted
- [LIST_DOCS_RESEARCHED]

### Key Patterns Discovered
- [PATTERN_1]
- [PATTERN_2]

### Gotchas Found
- [GOTCHA_1]
- [GOTCHA_2]

---

## Architecture: Vertical Slices + SSR

```
src/
├── routes/           # TanStack Router file-based
│   ├── __root.tsx    # Root layout (HeadContent, Scripts)
│   ├── _authed.tsx   # Auth layout with middleware
│   └── _authed/      # Protected routes
├── features/         # Self-contained vertical slices
│   └── [FEATURE]/
│       ├── __tests__/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── server/   # Feature-specific server functions
│       ├── types/
│       └── index.ts  # Public API
├── server/           # Global server utilities
│   ├── supabase.ts   # Server-side Supabase
│   └── middleware/   # Global middleware
└── shared/           # UI components, utils
```

---

## Requirements

### Functional Requirements
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

### Non-Functional Requirements
- SSR Mode: [FULL/DATA_ONLY/CLIENT_ONLY] for [REASON]
- SEO: [DESCRIBE_SEO_REQUIREMENTS]
- Performance: [DESCRIBE_PERFORMANCE_REQUIREMENTS]

---

## Implementation Blueprint

### Implementation Rules

> **TanStack Start Data Flow (Default Pattern)**

Server functions + loaders handle most data needs. Router has built-in caching and SWR.

```typescript
// 1. Loader calls server function (runs on server, auto-hydrates to client)
export const Route = createFileRoute('/items')({
  loader: () => fetchItems(),
  component: Page,
})

// 2. Component gets data via useLoaderData, passes as typed props
function Page() {
  const items = Route.useLoaderData()
  return <ItemList items={items} />
}

// 3. Mutations: call server function + router.invalidate()
function ItemList({ items }: { items: Item[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await deleteItem({ data: { id } })
    router.invalidate()  // Refetch all active loaders
  }
  // ...
}
```

**Simple routes** can inline logic. **Complex features** extract to `src/features/`.

---

> **TanStack Query (Optional Add-on)**

Only add Query when you need capabilities Router doesn't provide:

| Need | Router Has It? | Query Required? |
|------|---------------|-----------------|
| SSR + hydration | ✅ Built-in | No |
| Caching | ✅ Built-in | No |
| SWR background refetch | ✅ On navigation | No |
| Refetch after mutation | ✅ `router.invalidate()` | No |
| **Polling interval** | ❌ | Yes - `refetchInterval` |
| **Window focus refetch** | ❌ | Yes - `refetchOnWindowFocus` |
| **Optimistic updates** | ❌ | Yes - `onMutate` |
| **Granular invalidation** | ❌ | Yes - specific query keys |

If you need Query, add the provider setup and hydration at that point - not upfront.

---

### Phase 0: Project Scaffolding (if new project)

> Skip if `package.json` exists

```yaml
Task 0.1 - Initialize TanStack Start:
  commands:
    - pnpm create @tanstack/start@latest
    - cd [PROJECT_NAME]
    - pnpm install

Task 0.2 - Install Dependencies:
  commands:
    - pnpm add @supabase/ssr @supabase/supabase-js
    - pnpm add @tanstack/react-query zod react-hook-form @hookform/resolvers
    - pnpm add -D @biomejs/biome vitest @testing-library/react @testing-library/dom jsdom

Task 0.3 - Setup shadcn/ui:
  commands:
    - pnpm dlx shadcn@latest init
    - pnpm dlx shadcn@latest add button input card form toast

Task 0.4 - Configure Environment:
  file: .env.local
  content: |
    VITE_SUPABASE_URL=your-supabase-url
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key

Task 0.5 - Setup Server Supabase Client:
  file: src/server/supabase.ts
  content: |
    import { createServerClient } from '@supabase/ssr'
    import { getWebRequest } from '@tanstack/react-start/server'

    function parseCookies(cookieHeader: string): Record<string, string> {
      return Object.fromEntries(
        cookieHeader.split(';').map(cookie => {
          const [name, ...rest] = cookie.trim().split('=')
          return [name, rest.join('=')]
        })
      )
    }

    export function getSupabaseServerClient() {
      const request = getWebRequest()
      const cookies = parseCookies(request.headers.get('cookie') || '')

      return createServerClient(
        process.env.VITE_SUPABASE_URL!,
        process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
          cookies: {
            get(name) {
              return cookies[name]
            },
            set() {},
            remove() {},
          },
        }
      )
    }
```

### Phase 1: Database Schema (if needed)

```yaml
Task 1.1 - Create Migration:
  file: supabase/migrations/[TIMESTAMP]_create_[TABLE].sql
  content: |
    CREATE TABLE [TABLE] (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      [COLUMNS]
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE [TABLE] ENABLE ROW LEVEL SECURITY;

    -- RLS Policies
    CREATE POLICY "[TABLE]_select_own" ON [TABLE]
      FOR SELECT USING (auth.uid() = user_id);

    CREATE POLICY "[TABLE]_insert_own" ON [TABLE]
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "[TABLE]_update_own" ON [TABLE]
      FOR UPDATE USING (auth.uid() = user_id);

    CREATE POLICY "[TABLE]_delete_own" ON [TABLE]
      FOR DELETE USING (auth.uid() = user_id);

Task 1.2 - Apply Migration:
  commands:
    - supabase db reset
    - supabase gen types typescript --local > src/shared/types/database.types.ts
```

### Phase 2: Feature Slice - Schemas & Types

```yaml
Task 2.1 - Zod Schemas:
  file: src/features/[FEATURE]/schemas/[FEATURE].schema.ts
  content: |
    import { z } from 'zod'

    export const [item]Schema = z.object({
      id: z.string().uuid(),
      user_id: z.string().uuid(),
      [FIELDS]
      created_at: z.string().datetime(),
      updated_at: z.string().datetime(),
    })

    export const create[Item]Schema = [item]Schema.omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    })

    export const update[Item]Schema = create[Item]Schema.partial()

    export type [Item] = z.infer<typeof [item]Schema>
    export type Create[Item]Input = z.infer<typeof create[Item]Schema>
    export type Update[Item]Input = z.infer<typeof update[Item]Schema>
```

### Phase 3: Feature Slice - Server Functions

```yaml
Task 3.1 - Server Functions:
  file: src/features/[FEATURE]/server/[FEATURE].server.ts
  content: |
    import { createServerFn } from '@tanstack/react-start'
    import { getSupabaseServerClient } from '@/server/supabase'
    import { authMiddleware } from '@/server/middleware/auth'
    import {
      [item]Schema,
      create[Item]Schema,
      type [Item],
      type Create[Item]Input,
    } from '../schemas/[FEATURE].schema'

    // Public: No auth required
    export const fetch[Items] = createServerFn({ method: 'GET' })
      .handler(async (): Promise<[Item][]> => {
        const supabase = getSupabaseServerClient()
        const { data, error } = await supabase
          .from('[TABLE]')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        return [item]Schema.array().parse(data)
      })

    export const fetch[Item] = createServerFn({ method: 'GET' })
      .validator((data: { id: string }) => data)
      .handler(async ({ data }): Promise<[Item]> => {
        const supabase = getSupabaseServerClient()
        const { data: item, error } = await supabase
          .from('[TABLE]')
          .select('*')
          .eq('id', data.id)
          .single()

        if (error) throw error
        return [item]Schema.parse(item)
      })

    // Protected: Auth required
    export const create[Item] = createServerFn({ method: 'POST' })
      .middleware([authMiddleware])
      .validator((data: Create[Item]Input) => create[Item]Schema.parse(data))
      .handler(async ({ data, context }): Promise<[Item]> => {
        const supabase = getSupabaseServerClient()
        const { data: item, error } = await supabase
          .from('[TABLE]')
          .insert({ ...data, user_id: context.user.id })
          .select()
          .single()

        if (error) throw error
        return [item]Schema.parse(item)
      })

    export const delete[Item] = createServerFn({ method: 'POST' })
      .middleware([authMiddleware])
      .validator((data: { id: string }) => data)
      .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient()
        const { error } = await supabase
          .from('[TABLE]')
          .delete()
          .eq('id', data.id)

        if (error) throw error
      })
```

### Phase 4: Feature Slice - Hooks (Optional)

> **Most features don't need custom hooks.** Call server functions directly in components + `router.invalidate()`. Only create hooks for reusable mutation logic shared across multiple components. TanStack Query is only needed for polling, window focus refetch, or optimistic updates.

```yaml
Task 4.1 - (Optional) Mutation Hooks:
  description: Only create if you need reusable mutation logic across components
  file: src/features/[FEATURE]/hooks/use-[FEATURE].ts
  content: |
    import { useRouter } from '@tanstack/react-router'
    import { create[Item], delete[Item] } from '../server/[FEATURE].server'
    import type { Create[Item]Input } from '../schemas/[FEATURE].schema'

    // Simple mutation hook - calls server fn, invalidates router
    export function useCreate[Item]() {
      const router = useRouter()

      return async (input: Create[Item]Input) => {
        await create[Item]({ data: input })
        router.invalidate()
      }
    }

    export function useDelete[Item]() {
      const router = useRouter()

      return async (id: string) => {
        await delete[Item]({ data: { id } })
        router.invalidate()
      }
    }
```

### Phase 5: Feature Slice - Components

> Components receive data as typed props. Mutations call server functions + `router.invalidate()`.

```yaml
Task 5.1 - Components:
  description: Create components needed for the feature. Receive data as props.
  pattern: |
    import { type ReactElement } from 'react'
    import { useRouter } from '@tanstack/react-router'
    import { delete[Item] } from '../server/[FEATURE].server'
    import type { [Item] } from '../schemas/[FEATURE].schema'

    interface [Item]ListProps {
      items: [Item][]
    }

    export function [Item]List({ items }: [Item]ListProps): ReactElement {
      const router = useRouter()

      const handleDelete = async (id: string) => {
        await delete[Item]({ data: { id } })
        router.invalidate()
      }

      return (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.[FIELD]}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )
    }
```

### Phase 6: Feature Slice - Public API

```yaml
Task 6.1 - Export Public API:
  file: src/features/[FEATURE]/index.ts
  content: |
    // Server Functions (for route loaders)
    export { fetch[Items], fetch[Item], create[Item], delete[Item] } from './server/[FEATURE].server'

    // Components
    export { [Item]List } from './components/[Item]List'
    // ... other components

    // Types
    export type { [Item], Create[Item]Input } from './schemas/[FEATURE].schema'
```

### Phase 7: Route Integration with SSR

> **CRITICAL**: Each route task MUST include:
> 1. Full import list from feature slices
> 2. Complete loader implementation
> 3. Complete head/SEO implementation with title, description, og:tags
> 4. **Full component JSX** - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
> 5. All props passed from loader data to components
> 6. SSR mode explicitly set

**Anti-pattern (REJECT - incomplete routes will fail validation):**
```tsx
function Page() {
  return <div>{/* Content here */}</div>  // ❌ Placeholder comment
}

function Page() {
  const data = Route.useLoaderData()
  return <div>TODO: Add content</div>  // ❌ TODO placeholder
}
```

**Required pattern:**
```tsx
function Page() {
  const { items, user } = Route.useLoaderData()
  return (
    <div>
      <Header user={user} />
      <ItemList items={items} />  {/* ✅ Actual components with typed props */}
      <CreateItemForm />
    </div>
  )
}
```

```yaml
Task 7.X - [Route Name] Route:
  file: src/routes/[ROUTE_PATH].tsx
  imports:
    - createFileRoute from '@tanstack/react-router'
    - [LIST_ALL_SERVER_FNS] from '@/features/[FEATURE]'
    - [LIST_ALL_COMPONENTS] from '@/features/[FEATURE]'
  loader:
    calls: [SERVER_FN]({ data: params })
    returns: { [TYPED_DATA] }
  head:
    title: '[PAGE_TITLE] | AppName'
    meta:
      - { name: 'description', content: '[DESCRIPTION]' }
      - { property: 'og:title', content: '[OG_TITLE]' }
      - { property: 'og:description', content: '[OG_DESC]' }
    scripts: [JSON-LD if needed]
  ssr: true | 'data-only' | false
  component:
    renders:
      - [Component1] with props: { [PROP]: loaderData.[FIELD] }
      - [Component2] with props: { [PROP]: loaderData.[FIELD] }
  content: |
    import { createFileRoute } from '@tanstack/react-router'
    import { fetch[Items], [Item]List, [Item]Form } from '@/features/[FEATURE]'

    export const Route = createFileRoute('[ROUTE_PATH]')({
      head: ({ loaderData }) => ({
        title: `[TITLE] | AppName`,
        meta: [
          { name: 'description', content: '[DESCRIPTION]' },
          { property: 'og:title', content: '[OG_TITLE]' },
        ],
      }),
      ssr: true,
      loader: () => fetch[Items](),
      component: [Name]Page,
    })

    function [Name]Page() {
      const items = Route.useLoaderData()
      return (
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">[PAGE_HEADING]</h1>
          <[Item]Form />
          <[Item]List items={items} />
        </main>
      )
    }

# List ALL routes from requirements:
routes_needed:
  - path: /[ROUTE1]
    layout: _authed (if protected)
    components: [COMPONENT_LIST]
  - path: /[ROUTE2]/$id
    layout: _authed
    components: [COMPONENT_LIST]
```

---

## Route Completeness Checklist

> **MANDATORY**: Before proceeding to validation, verify EVERY route from the architecture diagram is complete.

For EACH route in `routes_needed`:

- [ ] Route file exists with complete implementation (no placeholders)
- [ ] Loader fetches ALL required data using server functions
- [ ] Head function includes: title, description, og:title, og:description
- [ ] JSON-LD structured data (if SEO-critical page)
- [ ] Component renders ACTUAL feature components (not comments/placeholders)
- [ ] ALL loader data passed as typed props to child components
- [ ] SSR mode explicitly set (`ssr: true`, `'data-only'`, or `false`)
- [ ] Protected routes use `_authed` layout

**Missing or incomplete routes = incomplete PRP. Do not proceed to validation.**

---

## Validation Gates

### Per-Phase Testing
| Phase | Run Tests? | Command |
|-------|------------|---------|
| 0. Scaffolding | No | - |
| 1. Database | No | `supabase db reset` |
| 2. Schemas | No | - |
| 3. Server Functions | **YES** | `pnpm test src/features/[FEATURE]/__tests__/*server*` |
| 4. Hooks | **YES** | `pnpm test src/features/[FEATURE]/__tests__/use-*` |
| 5. Components | **YES** | `pnpm test src/features/[FEATURE]/__tests__/` |
| 6. Public API | No | - |
| 7. Routes | **YES** | `pnpm build && pnpm test --run` |

### Final Validation
```bash
pnpm build            # SSR build must succeed
pnpm tsc --noEmit     # Type check
pnpm biome check .    # Lint
pnpm test --run       # All tests
```

### SSR Validation
- [ ] `pnpm build` succeeds
- [ ] View page source shows rendered HTML (not empty div)
- [ ] Meta tags appear in page source
- [ ] No hydration mismatch warnings in console
- [ ] Data loads without flicker on navigation

---

## Common Gotchas

### TanStack Start
- **Server Functions**: Must be in separate files or use `createServerFn`
- **Middleware**: Use `createMiddleware().server()` for auth
- **SSR Mode**: Default is `true`, use `false` for browser-only APIs
- **Validators**: Use `.validator()` not `.inputValidator()` (renamed in RC)

### TanStack Query v5
- Status: `isLoading` -> `isPending`
- Time: `cacheTime` -> `gcTime`
- SSR: Use route loader for initial data, Query for client refetch

### Supabase SSR
- **Server**: Use `getSupabaseServerClient()` (handles cookies)
- **Client**: Use `supabase` from shared for subscriptions
- Auth state available in middleware via `getUser()`
- RLS returns empty array (not error) when blocking

### SEO
- Use `head` route option, not external library
- Loader data available in `head` function
- Child routes override parent head tags

---

## Success Criteria

- [ ] All phases completed
- [ ] Build passes (`pnpm build`)
- [ ] SSR works (view page source shows content)
- [ ] Meta tags render correctly
- [ ] Tests pass (`pnpm test --run`)
- [ ] No hydration mismatches
- [ ] TypeScript compiles (`pnpm tsc --noEmit`)
- [ ] Lint passes (`pnpm biome check .`)
