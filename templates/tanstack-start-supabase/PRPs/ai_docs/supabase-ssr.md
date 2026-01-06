# Supabase SSR Integration

> Reference documentation for Supabase with TanStack Start SSR

## Overview

TanStack Start requires two Supabase clients:
1. **Server Client** - Used in server functions, handles cookies for auth
2. **Browser Client** - Used in components for real-time subscriptions

## Server-Side Supabase Client

```typescript
// src/server/supabase.ts
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
        set(name, value, options) {
          // Cookie setting handled by middleware
        },
        remove(name, options) {
          // Cookie removal handled by middleware
        },
      },
    }
  )
}
```

## Browser-Side Supabase Client

```typescript
// src/shared/utils/supabase.ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
)
```

## Authentication Patterns

### Auth Middleware

```typescript
// src/server/middleware/auth.ts
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getSupabaseServerClient } from '@/server/supabase'

export const authMiddleware = createMiddleware().server(
  async ({ next }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      throw redirect({ to: '/login' })
    }

    return next({
      context: {
        user: {
          id: user.id,
          email: user.email!,
        }
      }
    })
  }
)
```

### Protected Server Function

```typescript
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/server/supabase'
import { authMiddleware } from '@/server/middleware/auth'

export const createItem = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateItemInput) => createItemSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabase = getSupabaseServerClient()

    const { data: item, error } = await supabase
      .from('items')
      .insert({
        ...data,
        user_id: context.user.id, // From middleware
      })
      .select()
      .single()

    if (error) throw error
    return item
  })
```

### Fetching Current User in Root

```typescript
// src/routes/__root.tsx
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/server/supabase'

const fetchUser = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = getSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) return null

    return {
      id: user.id,
      email: user.email,
    }
  })

export const Route = createRootRoute({
  beforeLoad: async () => {
    const user = await fetchUser()
    return { user }
  },
  component: RootLayout,
})

function RootLayout() {
  const { user } = Route.useRouteContext()

  return (
    <html>
      <body>
        <nav>
          {user ? (
            <span>{user.email}</span>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
        <Outlet />
      </body>
    </html>
  )
}
```

## Data Fetching Patterns

### List Query

```typescript
export const fetchItems = createServerFn({ method: 'GET' })
  .handler(async () => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  })
```

### Single Item Query

```typescript
export const fetchItem = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', data.id)
      .single()

    if (error) throw error
    return item
  })
```

### With Relations

```typescript
export const fetchItemWithRelations = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient()

    const { data: item, error } = await supabase
      .from('items')
      .select(`
        *,
        category:categories(*),
        tags:item_tags(tag:tags(*))
      `)
      .eq('id', data.id)
      .single()

    if (error) throw error
    return item
  })
```

## Real-time Subscriptions

Real-time features use the browser client since they need persistent WebSocket connections.

```typescript
// In a component
import { useEffect, useState } from 'react'
import { supabase } from '@/shared/utils/supabase'

function LiveItems({ initialItems }) {
  const [items, setItems] = useState(initialItems)

  useEffect(() => {
    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new, ...prev])
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(i => i.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(i =>
              i.id === payload.new.id ? payload.new : i
            ))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return <ItemList items={items} />
}
```

## Auth UI Components

### Login Form

```typescript
import { supabase } from '@/shared/utils/supabase'
import { useNavigate } from '@tanstack/react-router'

function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      // Handle error
      return
    }

    navigate({ to: '/dashboard' })
  }

  // Form UI...
}
```

### Logout

```typescript
import { supabase } from '@/shared/utils/supabase'

function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/login' })
  }

  return <Button onClick={handleLogout}>Logout</Button>
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

### Always Filter by User

```typescript
// Even with RLS, explicitly filter for clarity
export const fetchUserItems = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const supabase = getSupabaseServerClient()

    const { data, error } = await supabase
      .from('items')
      .select('*')
      .eq('user_id', context.user.id) // Explicit filter
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  })
```

## Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## References

- [Supabase TanStack Start Client](https://supabase.com/ui/docs/tanstack/client)
- [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
