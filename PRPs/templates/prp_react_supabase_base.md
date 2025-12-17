# PRP: [FEATURE_NAME]

## Metadata
- **Feature**: [FEATURE_NAME]
- **Affected Slices**: [LIST_AFFECTED_FEATURES]
- **Database Changes**: [YES_OR_NO]
- **New Dependencies**: [LIST_OR_NONE]

---

## Technology Stack Reference

| Layer | Technology | Version |
|-------|------------|---------|
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
| **Payments** | Stripe | Latest |
| **AI** | Vercel AI SDK | 5.x |

---

## Documentation References

| Technology | Documentation |
|------------|---------------|
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| TanStack Query v5 | https://tanstack.com/query/latest/docs/framework/react/overview |
| TanStack Router | https://tanstack.com/router/latest/docs/framework/react/overview |
| Supabase JS v2 | https://supabase.com/docs/reference/javascript/introduction |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs/installation/vite |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev/?id=basic-usage |
| Vitest | https://vitest.dev/guide/ |
| Testing Library | https://testing-library.com/docs/react-testing-library/intro |
| Stripe | https://docs.stripe.com/payments/quickstart |
| Vercel AI SDK | https://sdk.vercel.ai/docs/introduction |

---

## Architecture: Vertical Slices

```
src/
├── routes/           # TanStack Router file-based (thin, composing)
├── features/         # Self-contained vertical slices
│   └── [feature]/
│       ├── __tests__/
│       ├── components/
│       ├── hooks/
│       ├── schemas/
│       ├── types/
│       └── index.ts  # Public API
└── shared/           # UI components, utils (NO business logic)
```

**Import Rules:**
- Routes → Features
- Features → Shared
- Features → Features
- Shared → Features NEVER

**Supabase Client**: `import { supabase } from '@/shared/utils/supabase'`

---

## Requirements

### User Story
[FROM_INITIAL_MD]

### Acceptance Criteria
[FROM_INITIAL_MD]

---

## Research & Documentation

> **Note**: This section is populated by the generate command during research phase.

### Sources Consulted
[LINKS_TO_DOCS_FETCHED_DURING_RESEARCH]

### Key Patterns Discovered
[PATTERNS_FROM_RESEARCH]

### Feature-Specific Gotchas
[GOTCHAS_DISCOVERED_DURING_RESEARCH]

---

## AI Docs Context

> **Note**: This section contains relevant code snippets from official documentation.
> The generate command pastes these during research to provide context for execute.

### [TECHNOLOGY_1] Patterns
```typescript
[PASTE_RELEVANT_CODE_FROM_DOCS]
```

### [TECHNOLOGY_2] Patterns
```typescript
[PASTE_RELEVANT_CODE_FROM_DOCS]
```

---

## Implementation Blueprint

### Phase 1: Database Schema (if needed)

```yaml
Task 1.1 - Migration:
  file: supabase/migrations/[TIMESTAMP]_[NAME].sql
  content: |
    create table public.[TABLE] (
      id uuid primary key default gen_random_uuid(),
      user_id uuid not null references public.profiles(id) on delete cascade,
      [COLUMNS]
      created_at timestamptz default now() not null,
      updated_at timestamptz default now() not null
    );

    create index idx_[TABLE]_user_id on public.[TABLE](user_id);

    alter table public.[TABLE] enable row level security;

    create policy "Users can view own [items]"
      on public.[TABLE] for select using (auth.uid() = user_id);

    create policy "Users can create [items]"
      on public.[TABLE] for insert with check (auth.uid() = user_id);

    create policy "Users can update own [items]"
      on public.[TABLE] for update using (auth.uid() = user_id);

    create policy "Users can delete own [items]"
      on public.[TABLE] for delete using (auth.uid() = user_id);
  validation: supabase db reset succeeds

Task 1.2 - Generate Types:
  commands:
    - supabase gen types typescript --local > src/shared/types/database.types.ts
  validation: pnpm tsc --noEmit passes
```

### Phase 2: Feature Slice - Schemas & Types

```yaml
Task 2.1 - Schema:
  file: src/features/[FEATURE]/schemas/[FEATURE].schema.ts
  content: |
    import { z } from 'zod';

    export const [item]Schema = z.object({
      id: z.string().uuid(),
      user_id: z.string().uuid(),
      [FIELDS]
      created_at: z.string().datetime(),
      updated_at: z.string().datetime(),
    });

    export const create[Item]Schema = [item]Schema.omit({
      id: true,
      user_id: true,
      created_at: true,
      updated_at: true,
    });

    export type [Item] = z.infer<typeof [item]Schema>;
    export type Create[Item]Input = z.infer<typeof create[Item]Schema>;

Task 2.2 - Types:
  file: src/features/[FEATURE]/types/[FEATURE].types.ts
  content: |
    export type { [Item], Create[Item]Input } from '../schemas/[FEATURE].schema';

    // Additional types specific to this feature
```

### Phase 3: Feature Slice - Hooks (TanStack Query v5)

```yaml
Task 3.1 - Query Hooks:
  file: src/features/[FEATURE]/hooks/use-[FEATURE].ts
  content: |
    import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
    import { supabase } from '@/shared/utils/supabase';
    import { [item]Schema, type [Item], type Create[Item]Input } from '../schemas/[FEATURE].schema';

    export const [FEATURE]Keys = {
      all: ['[FEATURE]'] as const,
      list: () => [...[FEATURE]Keys.all, 'list'] as const,
      detail: (id: string) => [...[FEATURE]Keys.all, 'detail', id] as const,
    };

    export function use[Items]() {
      return useQuery({
        queryKey: [FEATURE]Keys.list(),
        queryFn: async (): Promise<[Item][]> => {
          const { data, error } = await supabase
            .from('[TABLE]')
            .select('*')
            .order('created_at', { ascending: false });
          if (error) throw error;
          return [item]Schema.array().parse(data);
        },
      });
    }

    export function use[Item](id: string) {
      return useQuery({
        queryKey: [FEATURE]Keys.detail(id),
        queryFn: async (): Promise<[Item]> => {
          const { data, error } = await supabase
            .from('[TABLE]')
            .select('*')
            .eq('id', id)
            .single();
          if (error) throw error;
          return [item]Schema.parse(data);
        },
        enabled: !!id,
      });
    }

    export function useCreate[Item]() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (input: Create[Item]Input): Promise<[Item]> => {
          const { data, error } = await supabase
            .from('[TABLE]')
            .insert(input)
            .select()
            .single();
          if (error) throw error;
          return [item]Schema.parse(data);
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [FEATURE]Keys.all });
        },
      });
    }

    export function useDelete[Item]() {
      const queryClient = useQueryClient();
      return useMutation({
        mutationFn: async (id: string): Promise<void> => {
          const { error } = await supabase.from('[TABLE]').delete().eq('id', id);
          if (error) throw error;
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [FEATURE]Keys.all });
        },
      });
    }
  validation: Hooks compile and return data

Task 3.2 - Hook Tests:
  file: src/features/[FEATURE]/__tests__/use-[FEATURE].test.ts
  content: |
    import { describe, it, expect, vi, beforeEach } from 'vitest';
    import { renderHook, waitFor } from '@testing-library/react';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { use[Items], useCreate[Item], useDelete[Item] } from '../hooks/use-[FEATURE]';

    // Mock Supabase
    vi.mock('@/shared/utils/supabase', () => ({
      supabase: {
        from: vi.fn(() => ({
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: [], error: null })),
            eq: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: null, error: null })),
            })),
          })),
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(() => Promise.resolve({ data: { id: '1' }, error: null })),
            })),
          })),
          delete: vi.fn(() => ({
            eq: vi.fn(() => Promise.resolve({ error: null })),
          })),
        })),
      },
    }));

    const createWrapper = () => {
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
    };

    describe('use[Items]', () => {
      it('returns empty array initially', async () => {
        const { result } = renderHook(() => use[Items](), { wrapper: createWrapper() });

        expect(result.current.isPending).toBe(true);
        await waitFor(() => expect(result.current.isPending).toBe(false));
        expect(result.current.data).toEqual([]);
      });
    });

    describe('useCreate[Item]', () => {
      it('provides mutate function', () => {
        const { result } = renderHook(() => useCreate[Item](), { wrapper: createWrapper() });
        expect(result.current.mutateAsync).toBeDefined();
      });
    });

    describe('useDelete[Item]', () => {
      it('provides mutate function', () => {
        const { result } = renderHook(() => useDelete[Item](), { wrapper: createWrapper() });
        expect(result.current.mutateAsync).toBeDefined();
      });
    });
  validation: |
    pnpm test src/features/[FEATURE]/__tests__/use-[FEATURE].test.ts
    # Must pass before proceeding to Phase 4
```

### Phase 4: Feature Slice - Components

```yaml
Task 4.1 - List Component:
  file: src/features/[FEATURE]/components/[FEATURE]-list.tsx
  content: |
    import { type ReactElement } from 'react';
    import { use[Items] } from '../hooks/use-[FEATURE]';
    import { [Item]Card } from './[FEATURE]-card';
    import { Skeleton } from '@/shared/components/skeleton';

    export function [Item]List(): ReactElement {
      const { data: items, isPending, error } = use[Items]();

      if (isPending) {
        return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        );
      }

      if (error) {
        return <div className="text-destructive">Error loading items</div>;
      }

      if (!items?.length) {
        return <div className="text-muted-foreground">No items yet.</div>;
      }

      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <[Item]Card key={item.id} item={item} />
          ))}
        </div>
      );
    }

Task 4.2 - Form Component:
  file: src/features/[FEATURE]/components/[FEATURE]-form.tsx
  content: |
    import { type ReactElement } from 'react';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { Button } from '@/shared/components/button';
    import { Input } from '@/shared/components/input';
    import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/shared/components/form';
    import { create[Item]Schema, type Create[Item]Input } from '../schemas/[FEATURE].schema';
    import { useCreate[Item] } from '../hooks/use-[FEATURE]';

    interface [Item]FormProps {
      onSuccess?: () => void;
    }

    export function [Item]Form({ onSuccess }: [Item]FormProps): ReactElement {
      const createMutation = useCreate[Item]();
      const form = useForm<Create[Item]Input>({
        resolver: zodResolver(create[Item]Schema),
        defaultValues: { [DEFAULT_VALUES] },
      });

      const onSubmit = async (data: Create[Item]Input): Promise<void> => {
        await createMutation.mutateAsync(data);
        form.reset();
        onSuccess?.();
      };

      return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            [FORM_FIELDS]
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </Form>
      );
    }

Task 4.3 - Component Tests:
  file: src/features/[FEATURE]/__tests__/[FEATURE]-list.test.tsx
  content: |
    import { describe, it, expect, vi } from 'vitest';
    import { render, screen } from '@testing-library/react';
    import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
    import { [Item]List } from '../components/[FEATURE]-list';

    // Mock the hook
    vi.mock('../hooks/use-[FEATURE]', () => ({
      use[Items]: vi.fn(),
    }));

    import { use[Items] } from '../hooks/use-[FEATURE]';

    const createWrapper = () => {
      const queryClient = new QueryClient();
      return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
    };

    describe('[Item]List', () => {
      it('shows loading state', () => {
        vi.mocked(use[Items]).mockReturnValue({
          data: undefined,
          isPending: true,
          error: null,
        } as any);

        render(<[Item]List />, { wrapper: createWrapper() });
        // Skeleton loaders should be present
        expect(document.querySelectorAll('[class*="skeleton"]').length).toBeGreaterThan(0);
      });

      it('shows empty state', () => {
        vi.mocked(use[Items]).mockReturnValue({
          data: [],
          isPending: false,
          error: null,
        } as any);

        render(<[Item]List />, { wrapper: createWrapper() });
        expect(screen.getByText(/no items/i)).toBeInTheDocument();
      });

      it('shows error state', () => {
        vi.mocked(use[Items]).mockReturnValue({
          data: undefined,
          isPending: false,
          error: new Error('Failed'),
        } as any);

        render(<[Item]List />, { wrapper: createWrapper() });
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });

      it('renders items when data exists', () => {
        vi.mocked(use[Items]).mockReturnValue({
          data: [{ id: '1', name: 'Test Item' }],
          isPending: false,
          error: null,
        } as any);

        render(<[Item]List />, { wrapper: createWrapper() });
        // Items should render (adjust based on actual component)
        expect(document.querySelector('[class*="grid"]')).toBeInTheDocument();
      });
    });
  validation: |
    pnpm test src/features/[FEATURE]/__tests__/
    # All feature tests must pass before proceeding to Phase 5
```

### Phase 5: Feature Slice - Public API

```yaml
Task 5.1 - Index:
  file: src/features/[FEATURE]/index.ts
  content: |
    // Hooks
    export { use[Items], use[Item], useCreate[Item], useDelete[Item], [FEATURE]Keys } from './hooks/use-[FEATURE]';

    // Components
    export { [Item]List } from './components/[FEATURE]-list';
    export { [Item]Card } from './components/[FEATURE]-card';
    export { [Item]Form } from './components/[FEATURE]-form';

    // Types
    export type { [Item], Create[Item]Input } from './schemas/[FEATURE].schema';
```

### Phase 6: Route Integration

> For each feature slice, integrate into a route - create new or modify existing.

```yaml
# Pattern A: New route
Task 6.1 - [Feature] Route (NEW):
  file: src/routes/[ROUTE_PATH].tsx
  content: |
    import { type ReactElement } from 'react';
    import { createFileRoute } from '@tanstack/react-router';
    import { [COMPONENTS] } from '@/features/[FEATURE]';

    export const Route = createFileRoute('[ROUTE_PATH]')({
      component: [Page],
    });

    function [Page](): ReactElement {
      return (
        [PAGE_LAYOUT_USING_FEATURE_COMPONENTS]
      );
    }

# Pattern B: Modify existing route
Task 6.2 - [Feature] in [Existing] Route (MODIFY):
  file: src/routes/[EXISTING_ROUTE].tsx
  changes:
    - Add import: import { [COMPONENTS] } from '@/features/[FEATURE]';
    - Add to JSX: [WHERE_TO_ADD_FEATURE_COMPONENTS]
```

---

## Validation Gates

### Per-Phase Testing (CRITICAL)
Run tests after each phase that introduces testable code:

| Phase | Run Tests? | Command |
|-------|------------|---------|
| 1. Database | No | - |
| 2. Schemas | No | - |
| 3. Hooks | **YES** | `pnpm test src/features/[FEATURE]/__tests__/use-*` |
| 4. Components | **YES** | `pnpm test src/features/[FEATURE]/__tests__/` |
| 5. Public API | No | - |
| 6. Routes | Verify | `test -f [route-path] && pnpm build` |

### Level 1: Build + Tests
```bash
pnpm build
pnpm tsc --noEmit
pnpm biome check .
pnpm test --run           # Full test suite must pass
```

### Level 2: Database (if applicable)
```bash
supabase db reset
supabase gen types typescript --local > src/shared/types/database.types.ts
pnpm tsc --noEmit
pnpm test --run           # Tests still pass after type changes
```

### Level 3: Runtime
- [ ] Feature loads without console errors
- [ ] Data fetches correctly (check Network tab)
- [ ] Forms validate on submit
- [ ] CRUD operations persist to database
- [ ] Loading states display during fetches
- [ ] Error states handle failures gracefully

---

## Common Gotchas

### Vertical Slice Architecture
- `shared/` NEVER imports from `features/`
- Routes are thin - import and compose from features
- Use `index.ts` as public API - no deep imports
- Co-locate tests in `__tests__/` within features

### React 19
- Use `ReactElement` not `JSX.Element` for return types
- Don't manually add `useMemo`/`useCallback` - compiler handles it
- Actions handle pending state - don't duplicate with useState

### TanStack Query v5
- Status: `loading` -> `pending`, `isLoading` -> `isPending`
- `cacheTime` -> `gcTime`
- Always `invalidateQueries` after mutations
- Query keys must be serializable arrays

### TanStack Router
- Dynamic params use `$` prefix: `$itemId.tsx`
- Run `pnpm dev` to generate `routeTree.gen.ts`
- Search params need Zod schemas for type safety

### Supabase
- RLS returns empty array (not error) when blocking
- Run `supabase gen types` after EVERY migration
- Realtime not working = missing SELECT RLS policy
- Index all RLS policy columns for performance

### React Hook Form
- `defaultValues` don't update - use `reset()` for dynamic data
- File inputs need `Controller` wrapper
- Use `handleSubmit` to prevent page reload

### Testing
- Mock Supabase client in hook tests
- Mock hooks in component tests (test UI states, not data fetching)
- Use `vi.mocked()` for type-safe mock returns
- Wrap components in `QueryClientProvider` for tests
- Test all UI states: loading, error, empty, success
- Run tests after each phase - don't batch to the end

---

## Success Criteria

- [ ] All phases completed
- [ ] Build passes (`pnpm build`)
- [ ] Types pass (`pnpm tsc --noEmit`)
- [ ] Biome passes (`pnpm biome check .`)
- [ ] **Tests pass (`pnpm test --run`)**
- [ ] Database types regenerated (if schema changed)
- [ ] Runtime validation checklist complete
- [ ] Feature is self-contained in vertical slice
- [ ] Public API exports only what routes need
- [ ] **Tests co-located in `__tests__/` folder**
