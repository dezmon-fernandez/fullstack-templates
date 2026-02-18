# Execute Next.js + Supabase PRP

Implement a PRP phase by phase with validation.

## Input: $ARGUMENTS

Path to PRP file (e.g., `PRPs/my-feature.md`)

## Process

1. **Load PRP** - Read completely, understand all phases

2. **Phase Execution**
   - Announce phase and files to create
   - Implement following vertical slice architecture
   - Validate phase completion
   - Phase 3 creates Server Actions
   - Phase 6 creates App Router pages with generateMetadata and SEO

3. **Per-Phase Testing (CRITICAL)**

   | Phase | Run Tests? | Command |
   |-------|------------|---------|
   | 1. Database | No | `supabase db reset` |
   | 2. Schemas | No | - |
   | 3. Server Actions | **YES** | `pnpm test src/features/[feature]/__tests__/*action*` |
   | 4. Components | **YES** | `pnpm test src/features/[feature]/__tests__/` |
   | 5. Public API | No | - |
   | 6. Pages | **YES** | `pnpm build && pnpm test --run` |

   **Do NOT proceed if tests fail.**

   **Phase 6 Page Validation (MANDATORY):**
   Before completing Phase 6, verify EACH page file:
   - [ ] Imports actual feature components from `@/features/[name]`
   - [ ] Server Components fetch data (not empty/placeholder)
   - [ ] `generateMetadata` has title, description, og:tags for SEO pages
   - [ ] Component renders feature components with typed props
   - [ ] NO placeholder comments (`{/* TODO */}`, `{/* Content */}`)
   - [ ] NO TODO text in render output
   - [ ] `loading.tsx` exists for async pages
   - [ ] `error.tsx` exists for pages with data fetching

   **Reject and rewrite pages with placeholders. Incomplete pages = failed validation.**

4. **Final Validation**
   ```bash
   pnpm build            # Next.js build must succeed
   pnpm tsc --noEmit     # Type check
   pnpm biome check .    # Lint
   pnpm test --run       # All tests
   ```

5. **SSR Validation**
   ```bash
   pnpm build && pnpm start &
   sleep 3
   curl -s http://localhost:3000/[route] | head -100  # Check for rendered HTML
   # Should see actual content, not empty div
   ```

## Architecture

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout (<html>, <body>)
│   ├── (auth)/                  # Auth route group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/             # Protected route group
│   │   ├── layout.tsx           # Auth-protected layout
│   │   └── [feature]/
│   │       ├── page.tsx
│   │       ├── [id]/page.tsx
│   │       ├── loading.tsx
│   │       └── error.tsx
│   └── (marketing)/             # Public pages
│       └── page.tsx
├── features/[name]/
│   ├── __tests__/
│   ├── components/              # Server + Client Components
│   ├── actions/                 # Server Actions ('use server')
│   ├── schemas/
│   ├── types/
│   └── index.ts
├── lib/
│   └── supabase/
│       ├── server.ts            # Server-side Supabase client
│       └── client.ts            # Browser-side Supabase client
├── components/                  # Shared UI (shadcn/ui)
│   └── ui/
└── middleware.ts                # Auth session refresh
```

**Import Rules:**
- Pages import from `@/features/[name]`
- Features import from `@/lib/*` and `@/components/*`
- Features can import Server Actions from `../actions/`
- Shared NEVER imports from features
- Server Actions import from `@/lib/*` for Supabase clients

## Next.js-Specific Implementation Notes

### Server Components (Default)
```typescript
// Pages are Server Components by default - fetch data directly
import { createClient } from '@/lib/supabase/server'
import { ItemList } from '@/features/items'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*')
  return <ItemList items={items ?? []} />
}
```

### Server Actions
```typescript
// src/features/items/actions/items.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  const { error } = await supabase.from('items').insert({
    title: formData.get('title') as string,
  })
  if (error) throw error
  revalidatePath('/items')
}
```

### generateMetadata for SEO
```typescript
import type { Metadata } from 'next'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id)
  return {
    title: `${item.name} | MyApp`,
    description: item.description,
    openGraph: {
      title: item.name,
      description: item.description,
    },
  }
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params
  const item = await getItem(id)
  return <ItemDetail item={item} />
}
```

### Loading and Error UI
```typescript
// loading.tsx - shows while page data loads
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return <Skeleton className="h-64 w-full" />
}

// error.tsx - shows when page throws
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Protected Layout
```typescript
// src/app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <>{children}</>
}
```

## Validation Checklist

### SSR Validation
- [ ] `pnpm build` succeeds
- [ ] View page source shows rendered HTML content
- [ ] Meta tags appear in page source
- [ ] No hydration mismatch warnings in browser console
- [ ] Data loads without flicker on navigation

### Functionality Validation
- [ ] All tests pass (`pnpm test --run`)
- [ ] TypeScript compiles (`pnpm tsc --noEmit`)
- [ ] Linting passes (`pnpm biome check .`)
- [ ] Auth-protected pages redirect when not logged in
- [ ] Server Actions return correct data

### Page Integration Validation (CRITICAL)
- [ ] Every feature has corresponding page(s)
- [ ] Pages import and render feature components (not placeholders)
- [ ] Server Components fetch data and pass typed props
- [ ] No `{/* TODO */}` or placeholder comments in page files
- [ ] Page components contain actual JSX, not empty divs

### SEO Validation (for SEO-critical pages)
- [ ] Title tag is dynamic and correct
- [ ] Meta description is present
- [ ] Open Graph tags render correctly
- [ ] Page content is in HTML source (not just JS)
