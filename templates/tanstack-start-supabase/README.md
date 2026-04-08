# TanStack Start + Supabase Full-Stack Template

A context engineering template for building **SSR-enabled React applications** with TanStack Start and Supabase. This template extends the react-supabase-starter-template with server-side rendering, streaming, and SEO optimization.

## Quick Start: Copy Template

```bash
# Copy template to your project
python copy_template.py /path/to/your-project

# Or copy manually
cp -r . /path/to/your-project
```

## Planning Workflow

This template uses a **planning system** for AI-assisted development:

```
Step 1: Define Requirements
   Edit planning/INITIAL.md (new app) or planning/FEATURE.md (add feature)

Step 2: Generate Plan
   /generate-plan planning/INITIAL.md
   # Creates planning/[app-name].md with implementation details

Step 3: Execute Plan
   /execute-plan planning/[app-name].md
   # AI implements the feature with tests and validation
```

## What's Different from react-supabase-starter-template?

| Aspect | react-supabase (SPA) | tanstack-start-supabase (SSR) |
|--------|---------------------|-------------------------------|
| Rendering | Client-only | SSR + Client hydration |
| SEO | Limited | Full meta tags, structured data |
| Data Loading | Client useQuery | Server loaders + useQuery |
| Auth | Client-side only | Server-side session + client |
| Build Output | Static files | Server bundle + static |

## Template Structure

```
tanstack-start-supabase/
├── CLAUDE.md                    # Points to AGENTS.md
├── AGENTS.md                    # Full project guidelines
├── .claude/
│   ├── skills/
│   │   ├── generate-plan/
│   │   ├── execute-plan/
│   │   └── prime-core.md
│   └── settings.local.json
├── planning/
│   ├── templates/
│   │   └── plan_tanstack_start_base.md
│   ├── ai_docs/
│   │   ├── tanstack-start-patterns.md
│   │   ├── supabase-ssr.md
│   │   └── seo-head-management.md
│   ├── INITIAL.md               # New app template
│   └── FEATURE.md               # Add feature template
├── src/
│   └── shared/utils/supabase.ts # Client-side Supabase
├── .env.example
├── .gitignore
├── copy_template.py
└── README.md
```

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Meta-Framework** | TanStack Start | RC |
| **Frontend** | React | 19.x |
| **Build** | Vite | 6.x |
| **Routing** | TanStack Router | Latest |
| **Data Fetching** | TanStack Query | v5 |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | v4 |
| **Backend** | Supabase | Latest |

## Key Features

### Server-Side Rendering (SSR)
- Full SSR for SEO-critical pages
- Selective SSR per route (full/data-only/client)
- Streaming support for optimal performance

### Server Functions
```typescript
import { createServerFn } from '@tanstack/react-start'

export const fetchItems = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = getSupabaseServerClient()
    return await supabase.from('items').select('*')
  })
```

### SEO Head Management
```typescript
export const Route = createFileRoute('/posts/$postId')({
  head: ({ loaderData }) => ({
    title: `${loaderData.post.title} | MyApp`,
    meta: [
      { name: 'description', content: loaderData.post.excerpt },
      { property: 'og:title', content: loaderData.post.title },
    ],
  }),
  loader: async ({ params }) => {
    return { post: await fetchPost({ data: params }) }
  },
})
```

### Auth Middleware
```typescript
export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })
    return next({ context: { user } })
  }
)
```

## Setup After Copying

1. **Run setup** (installs deps, starts Supabase, writes `.env.local`)
   ```bash
   pnpm setup
   ```

2. **Define your app** in `planning/INITIAL.md`

3. **Generate and execute**
   ```bash
   /generate-plan planning/INITIAL.md
   /execute-plan planning/[your-app].md
   ```

## Commands

```bash
# Development
pnpm dev              # Start dev server with SSR
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm biome check .    # Lint and format
pnpm tsc --noEmit     # Type check
pnpm test             # Run tests

# Supabase
supabase start        # Local Supabase
supabase db reset     # Reset database
supabase gen types typescript --local > src/shared/types/database.types.ts
```

## Deployment

### Vercel
Works out of the box with Nitro preset.

### Netlify
```bash
pnpm add -D @netlify/vite-plugin-tanstack-start
```

### Cloudflare Workers
Use `cloudflare-module` preset in `app.config.ts`.

## Documentation

- [TanStack Start](https://tanstack.com/start/latest/docs)
- [TanStack Router](https://tanstack.com/router/latest/docs)
- [TanStack Query](https://tanstack.com/query/latest/docs)
- [Supabase](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)

## Common Gotchas

- **SSR Mode**: Default is `true`. Use `false` for browser-only APIs (canvas, WebRTC)
- **Server Functions**: Must use `createServerFn`, not regular async functions
- **TanStack Query v5**: `isLoading` is now `isPending`, `cacheTime` is now `gcTime`
- **Supabase RLS**: Returns empty array (not error) when blocking access
