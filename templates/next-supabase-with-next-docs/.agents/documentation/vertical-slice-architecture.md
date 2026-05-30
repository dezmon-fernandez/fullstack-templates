# Vertical Slice Architecture — Next.js App Router

## Decision Framework: What Goes Where

```
New code to write?
│
├─ A URL / page composition?
│  (route groups, layouts, loading/error/not-found, generateMetadata)
│  └─→ app/   (thin — compose feature exports, no business logic)
│
├─ Feature-specific?
│  (Server Actions, feature components, schemas, types)
│  └─→ Feature slice (features/{feature}/)
│
├─ Used by 3+ features AND identical?
│  (UI primitives, the supabase clients, generic utils)
│  └─→ lib/ or components/   (NO business logic)
│
└─ Used by 1-2 features?
   └─→ Keep it in the feature. Duplicate at the second. Wait for the third.
```

## app/ — Thin Route Composition

`app/` is the Next.js App Router. Route files compose a feature's public API; they don't
implement data access or business logic. Route groups organize by access boundary.

```
src/app/
├── (auth)/           # login, signup
├── (marketing)/      # public pages
├── (dashboard)/      # protected pages
│   └── layout.tsx    # auth-protected layout
├── layout.tsx        # root layout
├── loading.tsx       # global loading UI
├── error.tsx         # global error boundary
└── not-found.tsx
```

**Decision rule:** if a `page.tsx` contains anything beyond layout + feature composition + a
top-level data read delegated to a feature, that logic belongs in a feature slice.

Every navigable feature gets its route + a colocated `loading.tsx` and `error.tsx` where the
data fetch warrants a fallback / boundary.

## Feature Slice — Self-Contained Domains

Each slice owns everything for that feature behind a single public API (`index.ts`).

```
src/features/{feature}/
├── __tests__/        # Co-located tests
├── components/       # Server + Client Components ('use client' only where needed)
├── actions/          # Server Actions ('use server') — mutations + server reads
├── schemas/          # Zod schemas (source of truth for shapes)
├── types/            # Types inferred from schemas
└── index.ts          # Public API — the ONLY entry point
```

**Flow:** Server Component reads (via action or direct Supabase) → renders → Client Component
calls Server Action on interaction → `revalidatePath` → UI updates.

**Rules:**
- **`index.ts` is the contract.** No deep imports from outside the slice.
- **Server Actions** (`'use server'`) own writes and server-side reads; validate input with the
  feature's Zod schema inside the action.
- **`'use client'` is opt-in** — default to Server Components; mark client only for interactivity.
- **Zod schemas are the source of truth**; types are `z.infer`-ed.
- **Tests co-locate** in `__tests__/`.

## Shared — The Three-Feature Rule

Code moves to `lib/` (logic/clients) or `components/` (UI) only when **three or more** slices use
it identically.

```
src/lib/
├── supabase/server.ts   # server-side client (Server Components, Server Actions)
├── supabase/client.ts   # browser client (Client Components)
└── utils.ts
src/components/ui/        # shared shadcn/ui primitives — no business logic
```

**Process:** first slice inline → second duplicates (`// TODO: extract if used a third time`) →
third extracts and refactors all three. One is feature-specific, two coincidence, three a pattern.

## Import Rules

| From → To | Allowed? |
|-----------|----------|
| Pages (`app/`) → Features (via `index.ts`) | ✅ |
| Features → Shared (`lib/`, `components/`) | ✅ |
| Features → Features (via public `index.ts`) | ✅ |
| Server Actions → `lib/` (supabase clients) | ✅ |
| Shared → Features | ❌ NEVER |

## Adding a New Feature — Checklist

1. Create `src/features/{feature}/`
2. `schemas/` — Zod schema(s); `types/` — `z.infer` types
3. `actions/` — Server Actions (`'use server'`): validate with Zod, use `lib/supabase/server`,
   `revalidatePath` after mutations
4. `components/` — Server Components for reads, Client Components (`'use client'`) for interaction
5. `index.ts` — export the public API
6. Add the `app/` route(s) that compose the feature; add `loading.tsx` / `error.tsx` as needed
7. Co-locate tests in `__tests__/`
8. `pnpm test --run && pnpm build && pnpm lint` — MUST pass
