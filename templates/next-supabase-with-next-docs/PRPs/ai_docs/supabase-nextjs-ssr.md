# Supabase + Next.js SSR Integration

> Reference documentation for Supabase with Next.js App Router

## Overview

Next.js App Router requires two Supabase clients:
1. **Server Client** - Used in Server Components, Server Actions, and Route Handlers. Handles cookies for auth.
2. **Browser Client** - Used in Client Components for real-time subscriptions and client-side auth UI.

## Server-Side Supabase Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method is called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  )
}
```

## Browser-Side Supabase Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

## Middleware for Session Refresh

The middleware refreshes the Supabase auth session on every request by exchanging cookies.

```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not use getSession() - it reads from storage without validation.
  // Use getUser() which validates the JWT against the Supabase Auth server.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## Authentication Patterns

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
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return <>{children}</>
}
```

### Protected Server Action

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('items')
    .insert({
      title: formData.get('title') as string,
      user_id: user.id,
    })

  if (error) throw error
  revalidatePath('/items')
}
```

### Fetching Current User in Layout

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

  return (
    <div>
      <nav>
        <span>{user.email}</span>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

## Data Fetching Patterns

### List Query

```typescript
// In a Server Component or Server Action
import { createClient } from '@/lib/supabase/server'

export default async function ItemsPage() {
  const supabase = await createClient()

  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return <ItemList items={items} />
}
```

### Single Item Query

```typescript
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ id: string }>
}

export default async function ItemPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: item, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) notFound()

  return <ItemDetail item={item} />
}
```

### Query with Relations

```typescript
const { data: item } = await supabase
  .from('items')
  .select(`
    *,
    category:categories(*),
    tags:item_tags(tag:tags(*))
  `)
  .eq('id', id)
  .single()
```

### User-Scoped Query

```typescript
export default async function MyItemsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: items } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', user.id)  // Explicit filter even with RLS
    .order('created_at', { ascending: false })

  return <ItemList items={items ?? []} />
}
```

## Real-time Subscriptions

Real-time features use the browser client (Client Components) since they need persistent WebSocket connections.

```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Item } from '../schemas/items.schema'

interface LiveItemsProps {
  initialItems: Item[]
}

export function LiveItems({ initialItems }: LiveItemsProps) {
  const [items, setItems] = useState(initialItems)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems((prev) => [payload.new as Item, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setItems((prev) => prev.filter((i) => i.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setItems((prev) =>
              prev.map((i) =>
                i.id === payload.new.id ? (payload.new as Item) : i
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return <ItemList items={items} />
}
```

## Auth UI Components

### Login Form

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (formData: FormData) => {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle error
      return
    }

    router.push('/dashboard')
    router.refresh()  // Refresh server data
  }

  return (
    <form action={handleLogin}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

### Logout

```typescript
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

## RLS Considerations

### RLS Returns Empty, Not Error

```typescript
// If RLS blocks a query, you get empty results, not an error
const { data, error } = await supabase
  .from('items')
  .select('*')
  .eq('id', 'some-id')
  .single()

// data will be null, error will be a "not found" error
// This is expected behavior when RLS blocks access
```

### Always Filter by User (Even with RLS)

```typescript
// Explicit filter for clarity, even though RLS handles it
const { data } = await supabase
  .from('items')
  .select('*')
  .eq('user_id', user.id)  // Explicit filter
  .order('created_at', { ascending: false })
```

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Important**: Use `NEXT_PUBLIC_` prefix for variables needed in client components. Server-only variables don't need the prefix.

## References

- [Supabase Next.js SSR Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase SSR Package](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
