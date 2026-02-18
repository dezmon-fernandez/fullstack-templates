# Next.js App Router Patterns

> Reference documentation for Next.js 16 App Router patterns

## Server Components (Default)

All components in the `app/` directory are Server Components by default. They run on the server and send rendered HTML to the client.

### Basic Server Component

```typescript
// No directive needed - Server Component by default
import { createClient } from '@/lib/supabase/server'

export default async function ItemsPage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <ul>
      {items?.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}
```

### When to Use Server Components

- Fetching data directly from databases or APIs
- Accessing server-only resources (secrets, env vars without `NEXT_PUBLIC_`)
- Keeping large dependencies on the server (reduces client bundle)
- Rendering static or data-driven content

## Client Components

Mark with `'use client'` when you need interactivity.

### Basic Client Component

```typescript
'use client'

import { useState, type ReactElement } from 'react'

export function Counter(): ReactElement {
  const [count, setCount] = useState(0)
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

### When to Use Client Components

- State management (`useState`, `useReducer`)
- Event handlers (`onClick`, `onChange`, `onSubmit`)
- Browser APIs (`localStorage`, `window`, `navigator`)
- Custom hooks that use state or effects
- React 19 `useActionState` for form handling

### Composition Pattern

Pass server-fetched data as props to client components:

```typescript
// Server Component (page.tsx)
import { createClient } from '@/lib/supabase/server'
import { ItemList } from '@/features/items'

export default async function Page() {
  const supabase = await createClient()
  const { data } = await supabase.from('items').select('*')

  return <ItemList items={data ?? []} />  // Server data → Client Component
}

// Client Component (ItemList.tsx)
'use client'

export function ItemList({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState('')
  const filtered = items.filter(i => i.title.includes(filter))

  return (
    <div>
      <input onChange={(e) => setFilter(e.target.value)} />
      <ul>{filtered.map(i => <li key={i.id}>{i.title}</li>)}</ul>
    </div>
  )
}
```

### Server-Only Code Protection

```typescript
import 'server-only'  // Throws error if imported in client component

export async function getSecretData() {
  const apiKey = process.env.SECRET_API_KEY  // Safe, server-only
  return await fetch('...', { headers: { Authorization: apiKey } })
}
```

## Server Actions

Server Actions are async functions that run on the server. They replace most API routes.

### Basic Server Action

```typescript
// src/features/items/actions/items.ts
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

### Server Action with Zod Validation

```typescript
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const createItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
})

export async function createItem(input: unknown) {
  const result = createItemSchema.safeParse(input)
  if (!result.success) {
    return { error: result.error.flatten() }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('items')
    .insert({ ...result.data, user_id: user.id })

  if (error) return { error: error.message }

  revalidatePath('/items')
  return { success: true }
}
```

### Server Action with Auth Check

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function deleteItem(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/items')
}
```

### Using Server Actions in Forms

```typescript
// In Server Component - form action attribute
import { createItem } from '@/features/items'

export default function Page() {
  return (
    <form action={createItem}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}

// In Client Component - with useActionState for loading/error states
'use client'

import { useActionState } from 'react'
import { createItem } from '@/features/items'

export function CreateItemForm() {
  const [state, formAction, pending] = useActionState(createItem, null)

  return (
    <form action={formAction}>
      <input name="title" required />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </button>
    </form>
  )
}

// Binding arguments to Server Actions
import { deleteItem } from '@/features/items'

export function DeleteButton({ id }: { id: string }) {
  const deleteWithId = deleteItem.bind(null, id)
  return (
    <form action={deleteWithId}>
      <button type="submit">Delete</button>
    </form>
  )
}
```

## Route Conventions

### File Hierarchy

```
app/
├── layout.tsx          # Root layout (required, wraps ALL pages)
├── page.tsx            # Home page (/)
├── loading.tsx         # Loading UI for home
├── error.tsx           # Error boundary for home
├── not-found.tsx       # Global 404 page
├── blog/
│   ├── page.tsx        # /blog
│   ├── [slug]/
│   │   ├── page.tsx    # /blog/my-post
│   │   └── loading.tsx
│   └── layout.tsx      # Shared blog layout
└── dashboard/
    ├── page.tsx        # /dashboard
    └── settings/
        └── page.tsx    # /dashboard/settings
```

### Root Layout (Required)

```typescript
// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'MyApp', template: '%s | MyApp' },
  description: 'My application description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Route Groups

Organize routes without affecting the URL structure:

```
app/
├── (marketing)/        # No /marketing/ in URL
│   ├── page.tsx        # /
│   ├── about/page.tsx  # /about
│   └── layout.tsx      # Marketing layout (header, footer)
├── (auth)/             # No /auth/ in URL
│   ├── login/page.tsx  # /login
│   └── signup/page.tsx # /signup
└── (dashboard)/        # No /dashboard/ in URL
    ├── dashboard/page.tsx  # /dashboard
    ├── settings/page.tsx   # /settings
    └── layout.tsx          # Dashboard layout (sidebar, auth check)
```

### Dynamic Routes

```typescript
// app/blog/[slug]/page.tsx
type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params  // Must await in Next.js 16
  const post = await getPost(slug)
  return <article>{post.content}</article>
}
```

### Catch-All Routes

```typescript
// app/docs/[...slug]/page.tsx
type Props = {
  params: Promise<{ slug: string[] }>
}

export default async function DocsPage({ params }: Props) {
  const { slug } = await params
  // slug = ['getting-started', 'installation'] for /docs/getting-started/installation
}
```

## Loading UI

```typescript
// app/dashboard/loading.tsx
// Automatically wrapped in <Suspense> boundary
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
```

### Streaming with Suspense

```typescript
import { Suspense } from 'react'
import { PostFeed } from '@/features/posts'
import { Skeleton } from '@/components/ui/skeleton'

export default function Page() {
  return (
    <main>
      <h1>Posts</h1>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <PostFeed />  {/* Async Server Component */}
      </Suspense>
    </main>
  )
}
```

## Error Handling

```typescript
// app/dashboard/error.tsx
'use client'  // Must be Client Component

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

### Not Found

```typescript
// Trigger from a page
import { notFound } from 'next/navigation'

export default async function Page({ params }: Props) {
  const { id } = await params
  const item = await getItem(id)
  if (!item) notFound()  // Shows closest not-found.tsx
  return <ItemDetail item={item} />
}

// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div>
      <h2>Not Found</h2>
      <Link href="/">Go home</Link>
    </div>
  )
}
```

## Data Fetching

### Request Memoization

React automatically deduplicates `fetch()` calls with the same URL and options within a single render:

```typescript
// Both calls result in only ONE fetch request
async function getItem(id: string) {
  const res = await fetch(`/api/items/${id}`)
  return res.json()
}

// Called in generateMetadata AND Page - only fetches once
export async function generateMetadata({ params }) { /* uses getItem */ }
export default async function Page({ params }) { /* uses getItem */ }
```

### React.cache for Non-fetch Deduplication

```typescript
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

export const getItem = cache(async (id: string) => {
  const supabase = await createClient()
  const { data } = await supabase.from('items').select('*').eq('id', id).single()
  return data
})
```

### Caching Options

```typescript
// Static (default) - cached at build time
fetch('/api/data', { cache: 'force-cache' })

// Dynamic - fresh on every request
fetch('/api/data', { cache: 'no-store' })

// ISR - revalidate every 60 seconds
fetch('/api/data', { next: { revalidate: 60 } })
```

### Route Segment Config

```typescript
// Force dynamic rendering for the entire route
export const dynamic = 'force-dynamic'

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

// Force static generation
export const dynamic = 'force-static'
```

## Middleware

```typescript
// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add custom headers
  const response = NextResponse.next()
  response.headers.set('x-pathname', request.nextUrl.pathname)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
```

### Redirect Pattern

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

## File Organization

```
src/
├── app/                    # Routes and pages
├── features/               # Vertical slices
│   └── items/
│       ├── actions/        # Server Actions
│       │   └── items.ts
│       ├── components/     # UI components
│       │   ├── ItemList.tsx     # Client Component
│       │   └── ItemCard.tsx     # Server Component
│       ├── schemas/        # Zod schemas
│       │   └── items.schema.ts
│       ├── __tests__/
│       └── index.ts        # Public API
├── lib/                    # Shared utilities
│   └── supabase/
│       ├── server.ts
│       └── client.ts
├── components/             # Shared UI
│   └── ui/                 # shadcn/ui components
└── middleware.ts
```

## References

- [Next.js App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
- [Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
