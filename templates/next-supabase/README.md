# Next.js + Supabase Full-Stack Template

> A context engineering template for building **SSR-enabled React applications** with Next.js App Router and Supabase. Optimized for SEO, server-side rendering, and rapid AI-assisted development.

## Quick Start: Copy Template

```bash
# Copy template to your project
python quickstart.py next-supabase /path/to/your-project

# Or copy manually
cp -r . /path/to/your-project
```

## PRP Framework Workflow

This template uses the **PRP (Product Requirement Prompt)** framework for AI-assisted development:

```
Step 1: Define Requirements
   Edit PRPs/INITIAL.md (new app) or PRPs/FEATURE.md (add feature)

Step 2: Generate PRP
   /generate-next-supabase-prp PRPs/INITIAL.md
   # Creates PRPs/[app-name].md with implementation details

Step 3: Execute PRP
   /execute-next-supabase-prp PRPs/[app-name].md
   # AI implements the feature with tests and validation
```

## What's Different from Other Templates?

| Aspect | react-supabase (SPA) | tanstack-start (SSR) | next-supabase (SSR) |
|--------|---------------------|-------------------------------|-------------------------------|
| Framework | Vite + TanStack Router | TanStack Start | Next.js App Router |
| Rendering | Client-only | SSR + Client hydration | SSR/SSG/ISR + Client hydration |
| SEO | Limited | Meta via head option | generateMetadata + structured data |
| Data Loading | Client useQuery | Server loaders | Server Components + Server Actions |
| Auth | Client-side only | Server middleware | Middleware + Server Components |
| Build Output | Static files | Server bundle | Standalone Node.js server |
| Mutations | Client hooks | Server functions | Server Actions ('use server') |

## Template Structure

```
next-supabase/
├── CLAUDE.md                    # Points to AGENTS.md
├── AGENTS.md                    # Full project guidelines
├── .claude/
│   ├── commands/
│   │   ├── generate-next-supabase-prp.md
│   │   ├── execute-next-supabase-prp.md
│   │   └── prime-core.md
│   └── settings.json
├── PRPs/
│   ├── templates/
│   │   └── prp_next_supabase_base.md
│   ├── ai_docs/
│   │   ├── nextjs-app-router-patterns.md
│   │   ├── supabase-nextjs-ssr.md
│   │   └── nextjs-seo-metadata.md
│   ├── examples/
│   │   └── notes-feature-nextjs-example.md
│   ├── INITIAL.md               # New app template
│   └── FEATURE.md               # Add feature template
├── src/
│   ├── lib/supabase/
│   │   ├── server.ts            # Server-side Supabase client
│   │   └── client.ts            # Browser-side Supabase client
│   └── middleware.ts            # Auth session refresh
├── .env.example
├── .gitignore
└── README.md
```

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 16.x |
| **Frontend** | React | 19.x |
| **Language** | TypeScript | 5.x |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | v4 |
| **Backend** | Supabase | Latest |

## Key Features

### Server Components (Default)
All components are Server Components by default — fetch data directly, keep secrets safe, send less JavaScript.

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase.from('items').select('*')
  return <ItemList items={items ?? []} />
}
```

### Server Actions for Mutations
```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  await supabase.from('items').insert({ title: formData.get('title') })
  revalidatePath('/items')
}
```

### SEO with generateMetadata
```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const item = await getItem(id)
  return {
    title: `${item.name} | MyApp`,
    openGraph: { title: item.name, images: [item.imageUrl] },
  }
}
```

### Auth Middleware
```typescript
// src/middleware.ts - refreshes Supabase auth session on every request
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* cookie config */)
  await supabase.auth.getUser()
  return response
}
```

## Setup After Copying

1. **Copy environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Add Supabase credentials** to `.env.local`
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Define your app** in `PRPs/INITIAL.md`

4. **Generate and execute**
   ```bash
   /generate-next-supabase-prp PRPs/INITIAL.md
   /execute-next-supabase-prp PRPs/[your-app].md
   ```

## Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm biome check .    # Lint and format
pnpm tsc --noEmit     # Type check
pnpm test             # Run tests

# Supabase
supabase start        # Local Supabase
supabase db reset     # Reset database
supabase gen types typescript --local > src/lib/types/database.types.ts
```

## Deployment

### Vercel
Works out of the box with zero configuration.

### Docker
Add `output: 'standalone'` to `next.config.ts`, then use the [Next.js Docker example](https://github.com/vercel/next.js/tree/canary/examples/with-docker).

### Node.js Server
```bash
pnpm build && pnpm start
```

## Documentation

- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/docs)

## Common Gotchas

- **Server vs Client Components**: Default is Server. Add `'use client'` only for state/events/browser APIs
- **Params are Promises**: In Next.js 16, always `await params` and `await searchParams`
- **Environment variables**: Client-side must use `NEXT_PUBLIC_` prefix
- **Supabase Auth**: Use `getUser()` not `getSession()` for server-side verification
- **Supabase RLS**: Returns empty array (not error) when blocking access
