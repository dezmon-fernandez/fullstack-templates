---
description: Research and create implementation plan for a TanStack Start + Supabase feature
---

# Generate TanStack Start + Supabase Plan

Generate a comprehensive, well-researched plan for a TanStack Start + Supabase project with SSR.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-plan "add user profile with SEO"`
- **New App**: `/generate-plan planning/INITIAL.md`
- **New Feature**: `/generate-plan planning/FEATURE.md`

## Process

### 1. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages, SSR requirements
- For features: identify affected slices, database changes, server functions needed
- List all technologies/integrations involved
- Determine SSR mode per route (true/false/'data-only')

### 2. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 2.1 Core Stack Research
For each technology in the feature, fetch latest documentation:

| Technology | Documentation URL |
|------------|-------------------|
| TanStack Start | https://tanstack.com/start/latest/docs |
| TanStack Router | https://tanstack.com/router/latest/docs |
| TanStack Query v5 | https://tanstack.com/query/latest/docs |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side |
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

#### 2.2 SSR-Specific Research
- **WebSearch** for: `tanstack start [feature] ssr pattern`
- **WebSearch** for: `supabase server-side rendering authentication`
- **WebFetch** relevant TanStack Start docs for server functions
- **WebFetch** https://tanstack.com/start/latest/docs/framework/react/guide/server-functions

#### 2.3 SEO Research (if applicable)
- **WebSearch** for: `[feature type] seo meta tags best practices`
- Research structured data (JSON-LD) if applicable
- **WebFetch** https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management

#### 2.4 Feature-Specific Research
- **WebSearch** for: `[feature] react 19 best practices 2024`
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for common gotchas and edge cases

#### 2.5 Document Findings
Populate the plan's "Research & Documentation" section with:
- Links to relevant docs consulted
- Key patterns discovered
- Gotchas and edge cases found
- Version-specific considerations

### 3. Generate Plan

Create `planning/[name].md` using the output format below:

1. **Fill metadata** - Feature name, affected slices, SSR mode per route, database changes
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add server function definitions** - For data fetching and mutations
4. **Include head configuration** - For SEO-critical routes
5. **Add research section** - All documentation links and findings
6. **Customize phases** - Include server function phase (Phase 3) before hooks
7. **Update gotchas** - Add feature-specific warnings discovered
8. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description or ask user.
9. **Route integration for every feature (CRITICAL)** - For each feature slice created:
    - Include a dedicated Task in Phase 7 for EACH route
    - Write COMPLETE component JSX that renders actual feature components
    - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
    - All loader data MUST be passed as typed props to feature components
    - Include full head/SEO configuration
    - Fill in the Route Completeness Checklist at the end of Phase 7

### 4. Validate Plan Completeness

Before saving, verify:

**Server & Data:**
- [ ] Server functions defined for data operations
- [ ] SSR mode specified for each route (true/false/'data-only')
- [ ] Middleware defined if auth required
- [ ] Database schema matches data model

**Research & Documentation:**
- [ ] Research section has relevant documentation links
- [ ] Gotchas section updated with research findings

**Route Completeness (CRITICAL):**
- [ ] Every feature slice has corresponding route(s) in Phase 7
- [ ] Each route task includes FULL component JSX (no placeholders/TODOs)
- [ ] Each route imports and renders actual feature components
- [ ] All loader data passed as typed props to components
- [ ] Head configuration with title, description, og:tags for each route
- [ ] Route completeness checklist filled in

**General:**
- [ ] All placeholders replaced with actual names
- [ ] Test files include feature-specific assertions

## Output

Created: `planning/[name].md`

Execute with: `/execute-plan planning/[name].md`

---

## Research Examples

### Example: User Profile Feature with SSR
```
WebSearch: "tanstack start user profile ssr"
WebSearch: "supabase user profile server-side"
WebFetch: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
WebFetch: https://supabase.com/docs/guides/auth/server-side
```

### Example: Dark Mode Feature
```
WebSearch: "tailwind v4 dark mode toggle react"
WebSearch: "tanstack start theme provider ssr"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Blog with SEO
```
WebSearch: "tanstack start blog seo meta tags"
WebSearch: "supabase blog posts server-side rendering"
WebFetch: https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
WebFetch: https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr
```

### Example: Real-time Chat Feature
```
WebSearch: "supabase realtime tanstack start"
WebSearch: "tanstack query supabase realtime subscription"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
# Note: Real-time features typically use ssr: false or ssr: 'data-only'
```

---

## Output Format

Use this skeleton when generating the plan. Replace all `[PLACEHOLDERS]` with actual feature details.

# Plan: [FEATURE_NAME]

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

> Skip if `src/components/ui/` exists (shadcn already initialized)

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

    ALTER TABLE [TABLE] ENABLE ROW LEVEL SECURITY;

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
      id: true, user_id: true, created_at: true, updated_at: true,
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

> **Most features don't need custom hooks.** Call server functions directly + `router.invalidate()`. Only create hooks for reusable mutation logic shared across components.

### Phase 5: Feature Slice - Components

> Components receive data as typed props. Mutations call server functions + `router.invalidate()`.

```yaml
Task 5.1 - Components:
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
    export { fetch[Items], fetch[Item], create[Item], delete[Item] } from './server/[FEATURE].server'
    export { [Item]List } from './components/[Item]List'
    export type { [Item], Create[Item]Input } from './schemas/[FEATURE].schema'
```

### Phase 7: Route Integration with SSR

> **CRITICAL**: Each route task MUST include:
> 1. Full import list from feature slices
> 2. Complete loader implementation
> 3. Complete head/SEO implementation with title, description, og:tags
> 4. **Full component JSX** - NO placeholder comments
> 5. All props passed from loader data to components
> 6. SSR mode explicitly set

```yaml
Task 7.X - [Route Name] Route:
  file: src/routes/[ROUTE_PATH].tsx
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
```

---

## Route Completeness Checklist

> **MANDATORY**: Before proceeding to validation, verify EVERY route is complete.

For EACH route:

- [ ] Route file exists with complete implementation (no placeholders)
- [ ] Loader fetches ALL required data using server functions
- [ ] Head function includes: title, description, og:title, og:description
- [ ] JSON-LD structured data (if SEO-critical page)
- [ ] Component renders ACTUAL feature components (not comments/placeholders)
- [ ] ALL loader data passed as typed props to child components
- [ ] SSR mode explicitly set (`ssr: true`, `'data-only'`, or `false`)
- [ ] Protected routes use `_authed` layout

**Missing or incomplete routes = incomplete plan. Do not proceed to validation.**

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
