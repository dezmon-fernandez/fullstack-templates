# Vertical Slice Architecture — React SPA

## Decision Framework: What Goes Where

```
New code to write?
│
├─ A navigable URL?
│  (page composition, route loaders/guards)
│  └─→ routes/  (thin — compose features, no business logic)
│
├─ Feature-specific?
│  (data hooks, feature components, schemas, types)
│  └─→ Feature slice (features/{feature}/)
│
├─ Used by 3+ features AND identical?
│  (UI primitives, generic utils, the supabase client)
│  └─→ shared/   (NO business logic)
│
└─ Used by 1-2 features?
   └─→ Keep it in the feature. Duplicate at the second. Wait for the third.
```

## Routes — Thin Composition

`routes/` is TanStack Router file-based. A route imports a feature's public API and composes
it — it does not implement data fetching or business logic.

```
src/routes/
├── index.tsx            # /
├── items.tsx            # /items   → composes @/features/items
└── items.$itemId.tsx    # /items/:itemId
```

**Decision rule:** if a route file contains anything other than layout + feature composition
(a `useQuery`, a Supabase call, validation), that logic belongs in a feature slice.

## Feature Slice — Self-Contained Domains

Each slice owns everything needed to understand and modify that feature, behind a single
public API (`index.ts`). Nothing outside the slice deep-imports its internals.

```
src/features/{feature}/
├── __tests__/           # Co-located tests
├── components/          # Feature components (presentational + container)
├── hooks/               # TanStack Query hooks (queries + mutations)
├── schemas/             # Zod schemas (source of truth for shapes)
├── types/               # Types inferred from schemas
└── index.ts             # Public API — the ONLY entry point
```

**Flow:** Route → feature component → hook (TanStack Query) → Supabase → render.

**Rules:**
- **`index.ts` is the contract.** Export only what routes/other features need. No deep imports
  like `@/features/items/hooks/use-items` from outside the slice.
- **Data access lives in hooks**, not components. Components consume hooks.
- **Zod schemas are the source of truth**; types are `z.infer`-ed from them, never hand-declared.
- **Tests co-locate** in the slice's `__tests__/`.

## Shared — The Three-Feature Rule

Code moves to `shared/` only when **three or more** slices use it identically.

```
src/shared/
├── components/   # UI primitives (often shadcn/ui wrappers) — no business logic
├── utils/        # Generic helpers, the supabase client singleton
└── types/        # database.types.ts (generated), cross-cutting types
```

**Process:** first slice writes it inline → second slice duplicates (`// TODO: extract if used a
third time`) → third slice extracts to `shared/` and refactors all three.

**Why three?** One is feature-specific, two might be coincidence, three is a proven pattern.

## Import Rules

| From → To | Allowed? |
|-----------|----------|
| Routes → Features | ✅ |
| Features → Shared | ✅ |
| Features → Features (via public `index.ts`) | ✅ |
| Shared → Features | ❌ NEVER |

`shared/` knowing about a feature inverts the dependency graph and turns "shared" into a hidden
god-module. If shared needs feature data, the feature is miscategorized.

## Adding a New Feature — Checklist

1. Create `src/features/{feature}/`
2. `schemas/` — Zod schema(s); `types/` — `z.infer` types
3. `hooks/` — TanStack Query hooks (query keys factory + queries + mutations with invalidation)
4. `components/` — feature components consuming the hooks
5. `index.ts` — export the public API (hooks, components, types routes need)
6. Add a `routes/` file that imports from `@/features/{feature}` and composes it
7. Co-locate tests in `__tests__/`
8. `pnpm test --run && pnpm build && pnpm tsc --noEmit && pnpm biome check .` — MUST pass
