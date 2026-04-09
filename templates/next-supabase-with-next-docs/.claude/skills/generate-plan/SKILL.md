---
description: Research and create implementation plan for a Next.js + Supabase + Fumadocs feature
---

# Generate Next.js + Supabase Plan

Generate a comprehensive, well-researched plan for a Next.js App Router + Supabase project with SSR/SEO.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-plan "add user profile with SEO"`
- **New App**: `/generate-plan planning/INITIAL.md`
- **New Feature**: `/generate-plan planning/FEATURE.md`

## Process

### 1. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages, rendering requirements
- For features: identify affected slices, database changes, Server Actions needed
- List all technologies/integrations involved
- Determine rendering strategy per route (SSR/SSG/ISR/dynamic)

### 2. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 2.1 Core Stack Research
For each technology in the feature, fetch latest documentation:

| Technology | Documentation URL |
|------------|-------------------|
| Next.js App Router | https://nextjs.org/docs/app |
| Server Components | https://nextjs.org/docs/app/building-your-application/rendering/server-components |
| Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations |
| Metadata API | https://nextjs.org/docs/app/building-your-application/optimizing/metadata |
| Middleware | https://nextjs.org/docs/app/building-your-application/routing/middleware |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

#### 2.2 SSR/SEO-Specific Research
- **WebSearch** for: `next.js app router [feature] ssr pattern`
- **WebSearch** for: `supabase next.js server components authentication`
- **WebFetch** relevant Next.js docs for Server Components and Server Actions
- **WebFetch** https://nextjs.org/docs/app/building-your-application/data-fetching

#### 2.3 SEO Research (if applicable)
- **WebSearch** for: `[feature type] seo meta tags best practices`
- Research structured data (JSON-LD) if applicable
- **WebFetch** https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **WebSearch** for: `next.js generateMetadata dynamic seo`

#### 2.4 Feature-Specific Research
- **WebSearch** for: `[feature] next.js app router best practices`
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

1. **Fill metadata** - Feature name, affected slices, rendering strategy per route, database changes
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add Server Action definitions** - For data mutations
4. **Include generateMetadata configuration** - For SEO-critical routes
5. **Add research section** - All documentation links and findings
6. **Customize phases** - Include Server Actions phase before components
7. **Update gotchas** - Add feature-specific warnings discovered
8. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description or ask user.
9. **Route integration for every feature (CRITICAL)** - For each feature slice created:
    - Include a dedicated Task in Phase 6 for EACH page
    - Write COMPLETE page content that renders actual feature components
    - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
    - Server Components must fetch data and pass as typed props
    - Include full generateMetadata for SEO-critical pages
    - Include loading.tsx and error.tsx where appropriate
    - Fill in the Route Completeness Checklist at the end of Phase 6

### 4. Validate Plan Completeness

Before saving, verify:

**Server & Data:**
- [ ] Server Actions defined for data mutations
- [ ] Rendering strategy specified for each route (SSR/SSG/ISR/dynamic)
- [ ] Middleware handles auth session refresh
- [ ] Database schema matches data model

**Research & Documentation:**
- [ ] Research section has relevant documentation links
- [ ] Gotchas section updated with research findings

**Route Completeness (CRITICAL):**
- [ ] Every feature slice has corresponding page(s) in Phase 6
- [ ] Each page includes FULL component rendering (no placeholders/TODOs)
- [ ] Each page imports and renders actual feature components
- [ ] Server Components fetch data and pass typed props
- [ ] generateMetadata defined for SEO-critical pages
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
WebSearch: "next.js app router user profile server component"
WebSearch: "supabase user profile server-side next.js"
WebFetch: https://nextjs.org/docs/app/building-your-application/data-fetching
WebFetch: https://supabase.com/docs/guides/auth/server-side/nextjs
```

### Example: Dark Mode Feature
```
WebSearch: "tailwind v4 dark mode toggle next.js app router"
WebSearch: "shadcn/ui theme provider dark mode"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Blog with SEO
```
WebSearch: "next.js generateMetadata blog seo"
WebSearch: "next.js generateStaticParams blog"
WebFetch: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
WebFetch: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
```

### Example: Real-time Chat Feature
```
WebSearch: "supabase realtime next.js app router"
WebSearch: "next.js client component supabase subscription"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
# Note: Real-time features use 'use client' components
```

---

## Output Format

Use this skeleton when generating the plan. Replace all `[PLACEHOLDERS]` with actual feature details.

# Plan: [FEATURE_NAME]

## Metadata
- **Feature**: [FEATURE_NAME]
- **Affected Slices**: [LIST_AFFECTED_FEATURES]
- **Database Changes**: [YES_OR_NO]
- **Rendering**: [SSG/SSR/ISR/DYNAMIC]
- **SEO Required**: [YES_OR_NO]
- **New Dependencies**: [LIST_OR_NONE]

---

## Technology Stack Reference

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 16.1.6 |
| **Frontend** | React | 19.2.3 |
| **Language** | TypeScript | 5.x (strict) |
| **Package Manager** | pnpm | 10.x |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | 4.x |
| **Forms** | React Hook Form + Zod | 7.71.x + 4.3.x |
| **Backend** | Supabase | 2.95.x |
| **Linting** | Biome | 2.2.0 |
| **Testing** | Vitest + Testing Library | 4.x + 16.x |

---

## Documentation References

### Local Docs (version-accurate for Next.js 16.1.6 — read these first)

| Topic | Local Path |
|-------|-----------|
| Server & Client Components | `.next-docs/01-app/01-getting-started/05-server-and-client-components.mdx` |
| Fetching Data | `.next-docs/01-app/01-getting-started/07-fetching-data.mdx` |
| Updating Data (Server Actions) | `.next-docs/01-app/01-getting-started/08-updating-data.mdx` |
| Caching & Revalidating | `.next-docs/01-app/01-getting-started/09-caching-and-revalidating.mdx` |
| Metadata & OG Images | `.next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx` |
| Layouts & Pages | `.next-docs/01-app/01-getting-started/03-layouts-and-pages.mdx` |
| Error Handling | `.next-docs/01-app/01-getting-started/10-error-handling.mdx` |
| Route Handlers | `.next-docs/01-app/01-getting-started/15-route-handlers.mdx` |
| Forms | `.next-docs/01-app/02-guides/forms.mdx` |
| Authentication | `.next-docs/01-app/02-guides/authentication.mdx` |
| JSON-LD | `.next-docs/01-app/02-guides/json-ld.mdx` |
| ISR | `.next-docs/01-app/02-guides/incremental-static-regeneration.mdx` |
| Vitest Testing | `.next-docs/01-app/02-guides/testing/vitest.mdx` |
| generateMetadata API | `.next-docs/01-app/03-api-reference/04-functions/generate-metadata.mdx` |
| generateStaticParams | `.next-docs/01-app/03-api-reference/04-functions/generate-static-params.mdx` |
| revalidatePath | `.next-docs/01-app/03-api-reference/04-functions/revalidatePath.mdx` |
| File conventions | `.next-docs/01-app/03-api-reference/03-file-conventions/` |
| `'use server'` | `.next-docs/01-app/03-api-reference/01-directives/use-server.mdx` |
| `'use client'` | `.next-docs/01-app/03-api-reference/01-directives/use-client.mdx` |

If `.next-docs/` is missing, run: `npx @next/codemod agents-md --output CLAUDE.md`

### External Docs (non-Next.js technologies)

| Technology | Documentation |
|------------|---------------|
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |

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

## Architecture: Vertical Slices + App Router

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth route group
│   ├── (marketing)/      # Public pages
│   ├── (dashboard)/      # Protected pages
│   │   └── layout.tsx    # Auth-protected layout
│   ├── layout.tsx        # Root layout
│   ├── loading.tsx       # Global loading
│   ├── error.tsx         # Global error
│   └── not-found.tsx     # Global 404
├── features/             # Vertical slices
│   └── [FEATURE]/
│       ├── __tests__/
│       ├── components/   # Server + Client Components
│       ├── actions/      # Server Actions ('use server')
│       ├── schemas/      # Zod validation
│       ├── types/
│       └── index.ts      # Public API
├── lib/                  # Shared utilities
│   ├── supabase/
│   │   ├── server.ts     # Server-side client
│   │   └── client.ts     # Browser-side client
│   └── utils.ts
├── components/           # Shared UI (shadcn/ui)
│   └── ui/
└── middleware.ts          # Auth session refresh
```

---

## Requirements

### Functional Requirements
- [REQUIREMENT_1]
- [REQUIREMENT_2]
- [REQUIREMENT_3]

### Non-Functional Requirements
- Rendering: [SSG/SSR/ISR/DYNAMIC] for [REASON]
- SEO: [DESCRIBE_SEO_REQUIREMENTS]
- Performance: [DESCRIBE_PERFORMANCE_REQUIREMENTS]

---

## Implementation Blueprint

### Implementation Rules

> **Next.js App Router Data Flow (Default Pattern)**

Server Components fetch data directly. Mutations use Server Actions + `revalidatePath()`.

```typescript
// 1. Server Component page fetches data directly
import { createClient } from '@/lib/supabase/server'
import { ItemList, CreateItemForm } from '@/features/items'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*')
  return (
    <main>
      <CreateItemForm />
      <ItemList items={items ?? []} />
    </main>
  )
}

// 2. Client Component handles interactivity
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

// 3. Server Action mutates + revalidates
'use server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('items').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/items')
}
```

**Simple pages** can inline data fetching. **Complex features** extract to `src/features/`.

---

> **When to Use Client Components**

Only mark components with `'use client'` when you need:

| Need | Server Component? | Client Component? |
|------|------------------|-------------------|
| Fetch data | ✅ Direct async | ❌ Needs useEffect |
| Keep secrets | ✅ Server-only | ❌ Exposed to browser |
| State (useState) | ❌ | ✅ Required |
| Event handlers (onClick) | ❌ | ✅ Required |
| Browser APIs (localStorage) | ❌ | ✅ Required |
| Form with useActionState | ❌ | ✅ Required |
| Reduce JS bundle | ✅ Zero JS | ❌ Adds to bundle |

Minimize `'use client'` scope. Pass server-fetched data as props to client components.

---

### Phase 0: Project Setup (if fresh project)

> Skip if `src/components/ui/` exists (shadcn already initialized)
> Assumes `pnpm setup` has already been run (deps installed, Supabase running, `.env.local` written).

```yaml
Task 0.1 - Setup shadcn/ui:
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
    - supabase gen types typescript --local > src/lib/types/database.types.ts
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

### Phase 3: Feature Slice - Server Actions

```yaml
Task 3.1 - Server Actions:
  file: src/features/[FEATURE]/actions/[FEATURE].ts
  content: |
    'use server'

    import { revalidatePath } from 'next/cache'
    import { createClient } from '@/lib/supabase/server'
    import {
      [item]Schema,
      create[Item]Schema,
      type [Item],
      type Create[Item]Input,
    } from '../schemas/[FEATURE].schema'

    export async function fetch[Items](): Promise<[Item][]> {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('[TABLE]')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return [item]Schema.array().parse(data)
    }

    export async function fetch[Item](id: string): Promise<[Item]> {
      const supabase = await createClient()
      const { data, error } = await supabase
        .from('[TABLE]')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return [item]Schema.parse(data)
    }

    export async function create[Item](input: Create[Item]Input): Promise<void> {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const validated = create[Item]Schema.parse(input)
      const { error } = await supabase
        .from('[TABLE]')
        .insert({ ...validated, user_id: user.id })

      if (error) throw error
      revalidatePath('/[ROUTE]')
    }

    export async function delete[Item](id: string): Promise<void> {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('[TABLE]')
        .delete()
        .eq('id', id)

      if (error) throw error
      revalidatePath('/[ROUTE]')
    }
```

### Phase 4: Feature Slice - Components

> Server Components receive data as typed props. Client Components handle interactivity.
> Mark with `'use client'` ONLY when the component needs state, events, or browser APIs.

```yaml
Task 4.1 - Components:
  description: Create components needed for the feature.
  pattern_server_component: |
    import type { [Item] } from '../schemas/[FEATURE].schema'

    interface [Item]CardProps {
      item: [Item]
    }

    export function [Item]Card({ item }: [Item]CardProps) {
      return (
        <div>
          <h3>{item.[FIELD]}</h3>
          <p>{item.[FIELD]}</p>
        </div>
      )
    }

  pattern_client_component: |
    'use client'

    import { type ReactElement } from 'react'
    import { delete[Item] } from '../actions/[FEATURE]'
    import type { [Item] } from '../schemas/[FEATURE].schema'

    interface [Item]ListProps {
      items: [Item][]
    }

    export function [Item]List({ items }: [Item]ListProps): ReactElement {
      if (!items.length) {
        return <div>No items yet.</div>
      }

      return (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.[FIELD]}
              <form action={delete[Item].bind(null, item.id)}>
                <button type="submit">Delete</button>
              </form>
            </li>
          ))}
        </ul>
      )
    }

  pattern_form_component: |
    'use client'

    import { type ReactElement } from 'react'
    import { useForm } from 'react-hook-form'
    import { zodResolver } from '@hookform/resolvers/zod'
    import { create[Item] } from '../actions/[FEATURE]'
    import { create[Item]Schema, type Create[Item]Input } from '../schemas/[FEATURE].schema'

    export function [Item]Form(): ReactElement {
      const form = useForm<Create[Item]Input>({
        resolver: zodResolver(create[Item]Schema),
        defaultValues: { [FIELD]: '' },
      })

      const onSubmit = async (data: Create[Item]Input) => {
        await create[Item](data)
        form.reset()
      }

      return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <input {...form.register('[FIELD]')} placeholder="[PLACEHOLDER]" />
          {form.formState.errors.[FIELD] && (
            <p>{form.formState.errors.[FIELD]?.message}</p>
          )}
          <button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating...' : 'Create'}
          </button>
        </form>
      )
    }
```

### Phase 5: Feature Slice - Public API

```yaml
Task 5.1 - Export Public API:
  file: src/features/[FEATURE]/index.ts
  content: |
    export { fetch[Items], fetch[Item], create[Item], delete[Item] } from './actions/[FEATURE]'
    export { [Item]List } from './components/[Item]List'
    export { [Item]Form } from './components/[Item]Form'
    export { [Item]Card } from './components/[Item]Card'
    export type { [Item], Create[Item]Input } from './schemas/[FEATURE].schema'
```

### Phase 6: Route Integration with App Router

> **CRITICAL**: Each page task MUST include:
> 1. Full import list from feature slices
> 2. Complete data fetching in Server Component
> 3. Complete generateMetadata with title, description, og:tags (for SEO pages)
> 4. **Full component JSX** - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
> 5. All data passed as typed props to components
> 6. loading.tsx for pages with async data
> 7. error.tsx for pages with data fetching

```yaml
Task 6.X - [Page Name] Page:
  file: src/app/[ROUTE_PATH]/page.tsx
  content: |
    import type { Metadata } from 'next'
    import { createClient } from '@/lib/supabase/server'
    import { [Item]List, [Item]Form } from '@/features/[FEATURE]'

    export const metadata: Metadata = {
      title: '[TITLE] | AppName',
      description: '[DESCRIPTION]',
      openGraph: {
        title: '[OG_TITLE]',
        description: '[OG_DESC]',
      },
    }

    export default async function [Name]Page() {
      const supabase = await createClient()
      const { data: items } = await supabase.from('[TABLE]').select('*')

      return (
        <main className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">[PAGE_HEADING]</h1>
          <[Item]Form />
          <[Item]List items={items ?? []} />
        </main>
      )
    }

Task 6.X - [Page Name] Loading:
  file: src/app/[ROUTE_PATH]/loading.tsx
  content: |
    import { Skeleton } from '@/components/ui/skeleton'

    export default function Loading() {
      return (
        <div className="container mx-auto p-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      )
    }

Task 6.X - [Page Name] Error:
  file: src/app/[ROUTE_PATH]/error.tsx
  content: |
    'use client'

    export default function Error({
      error,
      reset,
    }: {
      error: Error & { digest?: string }
      reset: () => void
    }) {
      return (
        <div className="container mx-auto p-4">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Try again
          </button>
        </div>
      )
    }
```

---

## Route Completeness Checklist

> **MANDATORY**: Before proceeding to validation, verify EVERY page from the architecture diagram is complete.

For EACH page in `pages_needed`:

- [ ] Page file exists with complete implementation (no placeholders)
- [ ] Server Component fetches ALL required data
- [ ] `generateMetadata` includes: title, description, og:title, og:description (for SEO pages)
- [ ] JSON-LD structured data (if SEO-critical page)
- [ ] Component renders ACTUAL feature components (not comments/placeholders)
- [ ] ALL data passed as typed props to child components
- [ ] `loading.tsx` exists for async pages
- [ ] `error.tsx` exists for pages with data fetching
- [ ] Protected pages are inside `(dashboard)/` route group with auth layout

**Missing or incomplete pages = incomplete plan. Do not proceed to validation.**

---

## Validation Gates

### Per-Phase Testing
| Phase | Run Tests? | Command |
|-------|------------|---------|
| 0. Setup | No | `pnpm install` |
| 1. Database | No | `supabase db reset` |
| 2. Schemas | No | - |
| 3. Server Actions | **YES** | `pnpm test src/features/[FEATURE]/__tests__/*action*` |
| 4. Components | **YES** | `pnpm test src/features/[FEATURE]/__tests__/` |
| 5. Public API | No | - |
| 6. Pages | **YES** | `pnpm build && pnpm test --run` |

### Final Validation
```bash
pnpm build            # Next.js build must succeed
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

### Next.js App Router
- **Server Components are default**: Don't add `'use client'` unless you need state/events/browser APIs
- **`'use client'` boundary**: Everything imported by a client component becomes client code
- **Params are Promises**: Always `await params` and `await searchParams` in Next.js 16
- **Server Actions**: Must be in files with `'use server'` directive at the top
- **revalidatePath**: Must call after mutations to refresh cached data
- **generateMetadata**: Can be async and access the same data as the page
- **error.tsx**: Must be a Client Component (`'use client'`)
- **loading.tsx**: Automatically wrapped in Suspense boundary

### Supabase SSR
- **Server**: Use `createClient()` from `@/lib/supabase/server` (handles cookies)
- **Client**: Use `createClient()` from `@/lib/supabase/client` for subscriptions
- Auth state verified in middleware (session refresh)
- Use `getUser()` not `getSession()` for server-side auth
- RLS returns empty array (not error) when blocking

### Environment Variables
- Client-side: Must have `NEXT_PUBLIC_` prefix
- Server-side: No prefix needed, only available in Server Components/Actions

### SEO
- Use `generateMetadata` or static `metadata` export, not external libraries
- Dynamic metadata can use the same data-fetching as the page (auto-deduplicated)
- Child routes override parent metadata

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
