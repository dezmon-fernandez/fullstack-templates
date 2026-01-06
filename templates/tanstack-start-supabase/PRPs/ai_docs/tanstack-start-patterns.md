# TanStack Start Patterns

> Reference documentation for TanStack Start SSR patterns

## Server Functions

Server functions are the core primitive for server-side logic in TanStack Start. They run exclusively on the server but can be called from anywhere.

### Basic Server Function

```typescript
import { createServerFn } from '@tanstack/react-start'

// Simple GET function
export const getData = createServerFn({ method: 'GET' })
  .handler(async () => {
    return { message: 'Hello from server!' }
  })

// POST function
export const saveData = createServerFn({ method: 'POST' })
  .handler(async () => {
    return { success: true }
  })
```

### Server Function with Validation

```typescript
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

const inputSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
})

export const updateItem = createServerFn({ method: 'POST' })
  .validator((data: z.infer<typeof inputSchema>) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    // data is typed as { id: string, title: string }
    return updateItemInDb(data.id, data.title)
  })
```

### Server Function with Middleware

```typescript
import { createServerFn } from '@tanstack/react-start'
import { authMiddleware } from '@/server/middleware/auth'

export const createItem = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateItemInput) => createItemSchema.parse(data))
  .handler(async ({ data, context }) => {
    // context.user is available from authMiddleware
    return createItemInDb({ ...data, userId: context.user.id })
  })
```

## Middleware

Middleware allows you to run code before server functions and inject context.

### Auth Middleware

```typescript
import { createMiddleware } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { getSupabaseServerClient } from '@/server/supabase'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const supabase = getSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    return next({
      context: { user }
    })
  }
)
```

### Logging Middleware

```typescript
export const loggingMiddleware = createMiddleware().server(
  async ({ next }) => {
    const start = Date.now()
    const result = await next()
    console.log(`Request took ${Date.now() - start}ms`)
    return result
  }
)
```

## Route Loaders

Route loaders fetch data on the server before rendering the component.

### Basic Loader

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { fetchItems } from '@/features/items'

export const Route = createFileRoute('/items')({
  loader: async () => {
    const items = await fetchItems()
    return { items }
  },
  component: ItemsPage,
})

function ItemsPage() {
  const { items } = Route.useLoaderData()
  return <ItemList items={items} />
}
```

### Loader with Parameters

```typescript
export const Route = createFileRoute('/items/$itemId')({
  loader: async ({ params }) => {
    const item = await fetchItem({ data: { id: params.itemId } })
    return { item }
  },
  component: ItemDetailPage,
})
```

### Loader with Search Params

```typescript
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().default(1),
  sort: z.enum(['asc', 'desc']).default('desc'),
})

export const Route = createFileRoute('/items')({
  validateSearch: searchSchema,
  loader: async ({ search }) => {
    const items = await fetchItems({
      data: { page: search.page, sort: search.sort }
    })
    return { items }
  },
})
```

## Selective SSR

Control SSR behavior per route.

### Full SSR (Default)

```typescript
export const Route = createFileRoute('/blog/$slug')({
  ssr: true, // Default - loader runs on server, component renders on server
  loader: async ({ params }) => fetchPost(params.slug),
  component: BlogPost,
})
```

### Data-Only SSR

```typescript
export const Route = createFileRoute('/dashboard')({
  ssr: 'data-only', // Loader runs on server, component renders on client
  loader: async () => fetchDashboardData(),
  component: Dashboard,
})
```

### Client-Only (SPA Mode)

```typescript
export const Route = createFileRoute('/canvas-editor')({
  ssr: false, // Everything runs on client
  component: CanvasEditor,
})
```

## Using Server Functions in Components

### Direct Call

```typescript
import { fetchItems } from '@/features/items'

function ItemsPage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    fetchItems().then(setItems)
  }, [])
}
```

### With TanStack Query

```typescript
import { useQuery } from '@tanstack/react-query'
import { fetchItems } from '@/features/items'

function ItemsPage() {
  const { data: items, isPending } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  })
}
```

### With useServerFn for Mutations

```typescript
import { useMutation } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { createItem } from '@/features/items'

function CreateItemForm() {
  const serverFn = useServerFn(createItem)

  const mutation = useMutation({
    mutationFn: (data: CreateItemInput) => serverFn({ data }),
  })
}
```

## Error Handling

### Throwing Errors

```typescript
export const fetchItem = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const item = await db.findItem(data.id)
    if (!item) {
      throw new Error('Item not found')
    }
    return item
  })
```

### Redirects

```typescript
import { redirect } from '@tanstack/react-router'

export const requireAuth = createServerFn({ method: 'GET' })
  .handler(async () => {
    const user = await getUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }
    return user
  })
```

### Not Found

```typescript
import { notFound } from '@tanstack/react-router'

export const fetchItem = createServerFn({ method: 'GET' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const item = await db.findItem(data.id)
    if (!item) {
      throw notFound()
    }
    return item
  })
```

## File Organization

```
src/
├── features/
│   └── items/
│       ├── server/
│       │   └── items.server.ts    # Server functions
│       ├── hooks/
│       │   └── use-items.ts       # Query hooks
│       ├── components/
│       │   └── ItemList.tsx       # UI components
│       └── index.ts               # Public exports
├── server/
│   ├── supabase.ts               # Server Supabase client
│   └── middleware/
│       └── auth.ts               # Auth middleware
└── routes/
    └── _authed/
        └── items.tsx             # Route with loader
```

## References

- [TanStack Start Server Functions](https://tanstack.com/start/latest/docs/framework/react/guide/server-functions)
- [TanStack Start Middleware](https://tanstack.com/start/latest/docs/framework/react/guide/middleware)
- [TanStack Start Selective SSR](https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr)
