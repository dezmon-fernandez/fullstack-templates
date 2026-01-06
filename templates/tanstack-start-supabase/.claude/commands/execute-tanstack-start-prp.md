# Execute TanStack Start + Supabase PRP

Implement a PRP phase by phase with validation.

## Input: $ARGUMENTS

Path to PRP file (e.g., `PRPs/my-feature.md`)

## Process

1. **Load PRP** - Read completely, understand all phases

2. **Phase Execution**
   - Announce phase and files to create
   - Implement following vertical slice architecture
   - Validate phase completion
   - Phase 3 creates server functions
   - Phase 7 creates route files with SSR and SEO

3. **Per-Phase Testing (CRITICAL)**

   | Phase | Run Tests? | Command |
   |-------|------------|---------|
   | 1. Database | No | - |
   | 2. Schemas | No | - |
   | 3. Server Functions | **YES** | `pnpm test src/features/[feature]/__tests__/*server*` |
   | 4. Hooks | **YES** | `pnpm test src/features/[feature]/__tests__/use-*` |
   | 5. Components | **YES** | `pnpm test src/features/[feature]/__tests__/` |
   | 6. Public API | No | - |
   | 7. Routes | **YES** | `pnpm build && pnpm test --run` |

   **Do NOT proceed if tests fail.**

   **Phase 7 Route Validation (MANDATORY):**
   Before completing Phase 7, verify EACH route file:
   - [ ] Imports actual feature components from `@/features/[name]`
   - [ ] `loader` calls server functions (not empty/placeholder)
   - [ ] `head` function has title, description, og:tags
   - [ ] Component renders feature components with typed props
   - [ ] NO placeholder comments (`{/* TODO */}`, `{/* Content */}`)
   - [ ] NO TODO text in render output

   **Reject and rewrite routes with placeholders. Incomplete routes = failed validation.**

4. **Final Validation**
   ```bash
   pnpm build            # SSR build must succeed
   pnpm tsc --noEmit     # Type check
   pnpm biome check .    # Lint
   pnpm test --run       # All tests
   ```

5. **SSR Validation**
   ```bash
   pnpm start &          # Start production server
   sleep 3
   curl -s http://localhost:3000/[route] | head -100  # Check for rendered HTML
   # Should see actual content, not empty div
   ```

## Architecture

```
src/
├── routes/                      # TanStack Router file-based routing
│   ├── __root.tsx               # Root layout (HeadContent, Scripts)
│   ├── _authed.tsx              # Auth layout wrapper with middleware
│   └── _authed/                 # Protected routes
│       └── [feature].tsx
├── features/[name]/
│   ├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── schemas/
│   ├── server/                  # Feature server functions
│   ├── types/
│   └── index.ts
├── server/                      # Global server utilities
│   ├── supabase.ts             # Server-side Supabase client
│   └── middleware/             # Auth middleware, etc.
└── shared/                      # UI components, utils
```

**Import Rules:**
- Routes import from `@/features/[name]`
- Features import from `@/shared/*`
- Features can import server functions from `../server/`
- Shared NEVER imports from features
- Server functions import from `@/server/*` for global utilities

## SSR-Specific Implementation Notes

### Server Functions
```typescript
// Always use createServerFn for server-side operations
import { createServerFn } from '@tanstack/react-start'

export const fetchData = createServerFn({ method: 'GET' })
  .handler(async () => {
    // This runs on the server
    return data
  })
```

### Route Loaders
```typescript
// Loaders run on server and provide data to components
export const Route = createFileRoute('/items')({
  loader: async () => {
    return await fetchItems()  // Server function
  },
  component: ItemsPage,
})
```

### Head Configuration for SEO
```typescript
export const Route = createFileRoute('/items/$id')({
  head: ({ loaderData }) => ({
    title: `${loaderData.item.name} | MyApp`,
    meta: [
      { name: 'description', content: loaderData.item.description },
      { property: 'og:title', content: loaderData.item.name },
      { property: 'og:description', content: loaderData.item.description },
    ],
  }),
  loader: async ({ params }) => {
    return { item: await fetchItem({ data: { id: params.id } }) }
  },
  component: ItemPage,
})
```

### Selective SSR
```typescript
// Full SSR (default) - for SEO-critical pages
ssr: true

// Data-only - server fetches data, client renders
ssr: 'data-only'

// Client-only - for browser-dependent features
ssr: false
```

### Auth Middleware
```typescript
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getSupabaseServerClient } from '@/server/supabase'

export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return next({ context: { user } })
  }
)
```

## Validation Checklist

### SSR Validation
- [ ] `pnpm build` succeeds (SSR build)
- [ ] View page source shows rendered HTML content
- [ ] Meta tags appear in page source
- [ ] No hydration mismatch warnings in browser console
- [ ] Data loads without flicker on navigation

### Functionality Validation
- [ ] All tests pass (`pnpm test --run`)
- [ ] TypeScript compiles (`pnpm tsc --noEmit`)
- [ ] Linting passes (`pnpm biome check .`)
- [ ] Auth-protected routes redirect when not logged in
- [ ] Server functions return correct data

### Route Integration Validation (CRITICAL)
- [ ] Every feature has corresponding route(s)
- [ ] Routes import and render feature components (not placeholders)
- [ ] All loader data passed as props to components
- [ ] No `{/* TODO */}` or placeholder comments in route files
- [ ] Route components contain actual JSX, not empty divs

### SEO Validation (for SEO-critical routes)
- [ ] Title tag is dynamic and correct
- [ ] Meta description is present
- [ ] Open Graph tags render correctly
- [ ] Page content is in HTML source (not just JS)
