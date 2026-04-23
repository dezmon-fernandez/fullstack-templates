---
description: Research and create implementation plan for a React SPA + Supabase feature
---

# Generate React + Supabase Plan

Generate a comprehensive, well-researched plan for a React 19 + Supabase project.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-plan "add dark mode toggle"`
- **New App**: `/generate-plan .agents/plans/INITIAL.md`
- **New Feature**: `/generate-plan .agents/plans/FEATURE.md`

## Process

### 1. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages needed
- For features: identify affected slices, database changes, components
- List all technologies/integrations involved

### 2. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 2.1 Core Stack Research
For each technology in the feature, fetch latest documentation:

| Technology | Documentation URL |
|------------|-------------------|
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| TanStack Query v5 | https://tanstack.com/query/latest/docs |
| TanStack Router | https://tanstack.com/router/latest/docs |
| Supabase JS | https://supabase.com/docs/reference/javascript |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

#### 2.2 Feature-Specific Research
- **WebSearch** for: `[feature] react 19 best practices 2024`
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for common gotchas and edge cases
- **WebFetch** relevant documentation pages

#### 2.3 Integration Research (if applicable)
| Integration | Research |
|-------------|----------|
| Stripe | https://docs.stripe.com/payments |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| Supabase Storage | https://supabase.com/docs/guides/storage |
| Supabase Realtime | https://supabase.com/docs/guides/realtime |

#### 2.4 Document Findings
Populate the plan's "Research & Documentation" section with:
- Links to relevant docs consulted
- Key patterns discovered
- Gotchas and edge cases found
- Version-specific considerations

### 3. Generate Plan

Create `.agents/plans/[name].md` using the output format below:

1. **Fill metadata** - Feature name, affected slices, database changes, dependencies
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add research section** - All documentation links and findings
4. **Customize phases** - Adapt code examples to actual feature
5. **Update gotchas** - Add feature-specific warnings discovered
6. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description (e.g., "luxury" → dark + gold + serif, "playful" → rounded + bright colors) or ask user. Include:
   - Theme colors (define in `@theme` block for Tailwind v4)
   - Typography (font families, heading styles)
   - Custom utility classes (glows, gradients, effects)
   - Component styling direction (e.g., "cinematic cards with gold borders")
7. **Route integration for every feature** - For each feature slice created, include a Task in Phase 6 that integrates it into a route. Create a new route file if one doesn't exist for that feature. Routes must import from `@/features/[name]` and compose the feature's exported components.

### 4. Validate Plan Completeness

Before saving, verify:
- [ ] Research section has relevant documentation links
- [ ] All placeholders replaced with actual names
- [ ] Database schema matches data model
- [ ] Test files include feature-specific assertions
- [ ] Gotchas section updated with research findings
- [ ] Visual design section includes theme.css with colors, fonts, and custom utilities

## Output

Created: `.agents/plans/[name].md`

Execute with: `/execute-plan .agents/plans/[name].md`

---

## Research Examples

### Example: Dark Mode Feature
```
WebSearch: "tailwind v4 dark mode toggle react"
WebSearch: "shadcn/ui theme provider dark mode"
WebSearch: "react 19 context theme switching"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Stripe Payments Feature
```
WebSearch: "stripe react integration 2024"
WebSearch: "supabase edge functions stripe webhook"
WebFetch: https://docs.stripe.com/payments/quickstart
WebFetch: https://supabase.com/docs/guides/functions
```

### Example: Real-time Chat Feature
```
WebSearch: "supabase realtime react hooks"
WebSearch: "tanstack query supabase realtime subscription"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
WebFetch: https://tanstack.com/query/latest/docs/framework/react/guides/subscriptions
```

---

## Output Format

Use this skeleton when generating the plan. Replace all `[PLACEHOLDERS]` with actual feature details.

# Plan: [FEATURE_NAME]

## Metadata
- **Feature**: [FEATURE_NAME]
- **Affected Slices**: [LIST_AFFECTED_FEATURES]
- **Database Changes**: [YES_OR_NO]
- **New Dependencies**: [LIST_OR_NONE]

---

## Technology Stack Reference

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | ^19.2 |
| **Build** | Vite | ^7.3 |
| **Package Manager** | pnpm | 10.x |
| **Routing** | TanStack Router | ^1.160 |
| **Data Fetching** | TanStack Query | ^5.90 |
| **UI Components** | shadcn/ui | Latest |
| **Icons** | Lucide React | Latest |
| **Styling** | Tailwind CSS | ^4 |
| **Forms** | React Hook Form + Zod | ^7.71 / ^4.3 |
| **Backend** | Supabase JS | ^2.97 |
| **Linting** | Biome | 2.4.2 |
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
| Lucide React | https://lucide.dev/guide/packages/lucide-react |
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
  validation: |
    pnpm test src/features/[FEATURE]/__tests__/use-[FEATURE].test.ts
```

### Phase 4: Feature Slice - Components

```yaml
Task 4.1 - List Component:
  file: src/features/[FEATURE]/components/[FEATURE]-list.tsx

Task 4.2 - Form Component:
  file: src/features/[FEATURE]/components/[FEATURE]-form.tsx

Task 4.3 - Component Tests:
  file: src/features/[FEATURE]/__tests__/[FEATURE]-list.test.tsx
  validation: |
    pnpm test src/features/[FEATURE]/__tests__/
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
pnpm test --run
```

### Level 2: Database (if applicable)
```bash
supabase db reset
supabase gen types typescript --local > src/shared/types/database.types.ts
pnpm tsc --noEmit
pnpm test --run
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
