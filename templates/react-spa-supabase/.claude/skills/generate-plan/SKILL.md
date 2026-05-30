---
description: Research and create implementation plan for a React SPA + Supabase feature
---

# Generate React + Supabase Plan

## Feature: $ARGUMENTS

Accepts a feature description (`/generate-plan "add dark mode toggle"`) or no argument (prompts
for one).

## Mission

Transform a feature request into a **comprehensive, feature-framed implementation plan** through
systematic codebase analysis, external research, and strategic planning — specialized for
React 19 (Vite SPA) + TanStack + Supabase.

**Core Principle**: We do NOT write code in this phase. The goal is a context-rich plan that
enables one-pass implementation success for the execution agent.

**Key Philosophy**: Context is King. The plan must contain ALL information needed to implement —
patterns, mandatory reading, documentation, validation commands — so `/execute-plan` succeeds on
the first attempt without re-researching.

## Planning Process

### Phase 0: PRD Alignment (Option B — prime is the loader)

- The PRD (`.agents/PRD.md`) should already be loaded in context via `/prime`. Treat it as
  authoritative for scope, architecture, success criteria, and risks; align the plan to it.
- If the PRD is **not** in context, tell the user: `"The PRD doesn't appear to be loaded. Run
  /prime first (it loads .agents/PRD.md), or /create-prd if no PRD exists yet."` — then proceed
  only if they confirm. Do not re-read the full PRD here as routine; prime owns loading it.
- Cite the PRD sections relevant to this feature (MVP scope, affected slices, success criteria)
  in the plan's Requirements.

### Phase 1: Feature Understanding

**Deep Feature Analysis:**
- Extract the core problem being solved and the user value.
- Determine feature type: New Capability / Enhancement / Refactor / Bug Fix.
- Assess complexity: Low / Medium / High.
- Map affected slices (`src/features/`) and integration points.

**Create / refine the User Story:**
```
As a <type of user>
I want to <action/goal>
So that <benefit/value>
```

Also produce **Requirements** (Must-have / Nice-to-have) and **Out of Scope**.

### Phase 2: Codebase Intelligence Gathering

**Read the codebase before planning. The plan must reference real files, not generic advice.**

1. **Project structure** — confirm React/Vite setup, TanStack Router file-based routes, the
   Supabase client singleton, the `QueryClient` provider.
2. **Pattern recognition** — find the closest existing feature slice in `src/features/`; it is
   the pattern to mirror (hook shape, query-key factory, component structure, route composition,
   `index.ts` public API, test layout). Note naming conventions, error handling, anti-patterns.
3. **Established docs (context on demand):** scan `.agents/documentation/` — deliberately-
   established, non-obvious codebase patterns (e.g. `vertical-slice-architecture.md`). Read the
   entries relevant to this feature; relevant ones override generic defaults and go into Context
   References. Most standard code has no doc — its absence means "follow conventional best
   practice + existing code."
4. **Dependency analysis** — libraries the feature touches; how they're already integrated.
5. **Integration points** — `src/routes/` (where the feature's route composes its public API),
   `src/shared/` primitives reused, the Supabase client, the query-key conventions.

**Clarify ambiguities now** — resolve library/approach/architecture questions before researching.

### Phase 3: External Research

Fill gaps the PRD + codebase + documentation don't cover. Fetch latest official docs:

| Technology | Documentation URL |
|------------|-------------------|
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| TanStack Query v5 | https://tanstack.com/query/latest/docs/framework/react/overview |
| TanStack Router | https://tanstack.com/router/latest/docs/framework/react/overview |
| Supabase JS | https://supabase.com/docs/reference/javascript |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

Integrations as applicable: Stripe, Vercel AI SDK, Supabase Storage/Realtime.

**WebSearch** for `[feature] react 19 best practices`, `[feature] supabase implementation`, and
known gotchas. **WebFetch** the pages that matter. Capture URLs **with section anchors** and the
*why* for each into Context References.

### Phase 4: Deep Strategic Thinking

Think harder about: how the feature fits the existing architecture; critical dependencies and
order of operations; what could go wrong (edge cases, auth/RLS, cache invalidation); how it's
tested; performance and security. Choose between alternatives with clear rationale; design for the
slice boundary (no `shared/ → features/` leakage; minimal `index.ts` surface).

### Phase 5: Plan Structure Generation

Write `.agents/plans/<kebab-feature-name>.md` using the Output Format below. Fill every section;
replace all `[PLACEHOLDERS]`. The plan must pass the "No Prior Knowledge Test" — someone
unfamiliar with the codebase could implement it from the plan alone.

---

## Output Format

````markdown
# Feature: [FEATURE_NAME]

Validate documentation, codebase patterns, and task sanity before implementing. Pay special
attention to existing util/type/hook names — import from the right files, no deep imports past a
slice's `index.ts`.

## User Story

As a [USER]
I want to [ACTION]
So that [BENEFIT]

## Requirements

**Must have**
- [ ] [requirement]

**Nice to have**
- [ ] [requirement]

## Out of Scope

- [what this explicitly does NOT include]

## Problem Statement

[The specific problem/opportunity this addresses]

## Solution Statement

[The proposed approach and how it solves the problem]

## Feature Metadata

**Feature Type**: [New Capability/Enhancement/Refactor/Bug Fix]
**Estimated Complexity**: [Low/Medium/High]
**Affected Slices**: [features/x, features/y, or NEW: features/z]
**Database Changes**: [YES/NO]
**Dependencies**: [external libs/services, or NONE]
**PRD Alignment**: [PRD section(s) this serves]

---

## CONTEXT REFERENCES

### Relevant Codebase Files — IMPORTANT: READ THESE BEFORE IMPLEMENTING

- `src/features/[similar]/hooks/use-[x].ts:NN` — Why: mirror this hook + query-key shape
- `src/features/[similar]/index.ts:NN` — Why: public API surface to follow
- `src/routes/[similar].tsx:NN` — Why: how a route composes a feature's public API
- `src/shared/utils/supabase.ts` — Why: the client singleton

### New Files to Create

- `src/features/[FEATURE]/schemas/[FEATURE].schema.ts` — Zod schema(s)
- `src/features/[FEATURE]/types/[FEATURE].types.ts` — inferred types
- `src/features/[FEATURE]/hooks/use-[FEATURE].ts` — TanStack Query hooks
- `src/features/[FEATURE]/components/[FEATURE]-list.tsx`
- `src/features/[FEATURE]/components/[FEATURE]-form.tsx`
- `src/features/[FEATURE]/__tests__/*` — co-located tests
- `src/features/[FEATURE]/index.ts` — public API
- `src/routes/[ROUTE].tsx`

### Relevant Documentation — READ BEFORE IMPLEMENTING

- `.agents/documentation/vertical-slice-architecture.md` — slice boundaries, public-API rule
- [other relevant `.agents/documentation/*.md` found in Phase 2, if any]
- [External]: [url#anchor] — Why: [specific need]

### Patterns to Follow

[Concrete conventions extracted from the codebase in Phase 2 — query-key factories, hook naming,
how hooks parse Supabase responses, error handling. Include real file:line references.]

---

## TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|------------|---------|
| **Frontend** | React | ^19.2 |
| **Build** | Vite | ^7 |
| **Package Manager** | pnpm | 10.x |
| **Routing** | TanStack Router | ^1.160 |
| **Data Fetching** | TanStack Query | ^5.90 |
| **UI** | shadcn/ui + Lucide | Latest |
| **Styling** | Tailwind CSS | ^4 |
| **Forms** | React Hook Form + Zod | ^7.71 / ^3 |
| **Backend** | Supabase JS | ^2.97 |
| **Linting** | Biome | 2.x |
| **Testing** | Vitest + Testing Library | Latest |

Architecture: vertical slices — `src/features/[feature]/` (`components/`, `hooks/`, `schemas/`,
`types/`, `__tests__/`, `index.ts` public API) + thin `src/routes/` + `src/shared/`. Routes →
Features → Shared; Features → Features via public `index.ts`; Shared → Features NEVER. See
`.agents/documentation/vertical-slice-architecture.md`.

---

## IMPLEMENTATION PLAN

> Name artifacts + their interfaces. Standard React/TanStack/Supabase code follows conventional
> patterns; only spell out what's non-obvious or codebase-specific.

### Phase 1: Data Layer (Zod schemas + types + Supabase migration)
Migration (if DB changes), Zod schema + create/update variants, inferred types.

### Phase 2: Hooks (TanStack Query)
Query-key factory, list/detail queries, create/update/delete mutations with invalidation.

### Phase 3: Components
Feature components consuming hooks; React Hook Form + Zod resolver for forms.

### Phase 4: Public API + Route Integration
`index.ts` exports; a `routes/` file composing the feature.

### Phase 5: Testing & Validation
Vitest + Testing Library; run tests after each phase.

---

## STEP-BY-STEP TASKS

Execute in order, top to bottom. Each task is atomic and independently testable.
Keywords: **CREATE / UPDATE / ADD / REMOVE / REFACTOR / MIRROR**.

### Phase 1: Data Layer

#### [CREATE] supabase/migrations/[TIMESTAMP]_[NAME].sql  (only if DB changes)
- **IMPLEMENT**: table + `user_id` FK (cascade) + per-policy indexes + RLS policy set
- **PATTERN**: [existing migration file:line]
- **GOTCHA**: index every RLS-filtered column; RLS blocks return empty arrays, not errors
- **VALIDATE**: `supabase db reset` succeeds, then
  `supabase gen types typescript --local > src/shared/types/database.types.ts`

#### [CREATE] src/features/[FEATURE]/schemas/[FEATURE].schema.ts
- **IMPLEMENT**: Zod row schema + create/update variants (omit/partial)
- **PATTERN**: [existing schema file:line]
- **VALIDATE**: `pnpm tsc --noEmit`

#### [CREATE] src/features/[FEATURE]/types/[FEATURE].types.ts
- **IMPLEMENT**: `z.infer` type exports from the schema
- **VALIDATE**: `pnpm tsc --noEmit`

### Phase 2: Hooks

#### [CREATE] src/features/[FEATURE]/hooks/use-[FEATURE].ts
- **IMPLEMENT**: query-key factory; list/detail `useQuery`; create/update/delete `useMutation`
  with `invalidateQueries`; parse Supabase responses with the Zod schema
- **PATTERN**: [similar hook file:line]
- **IMPORTS**: `@tanstack/react-query`, the supabase client, the schema/types
- **GOTCHA**: v5 — `isPending` not `isLoading`, `gcTime` not `cacheTime`; always invalidate after mutations
- **VALIDATE**: `pnpm test src/features/[FEATURE]/__tests__/use-*`

### Phase 3: Components

#### [CREATE] src/features/[FEATURE]/components/[FEATURE]-list.tsx
- **IMPLEMENT**: consumes the query hook; renders loading/empty/error/success states
- **PATTERN**: [similar component file:line]
- **VALIDATE**: `pnpm test src/features/[FEATURE]/__tests__/`

#### [CREATE] src/features/[FEATURE]/components/[FEATURE]-form.tsx
- **IMPLEMENT**: React Hook Form + Zod resolver; calls the mutation hook
- **VALIDATE**: `pnpm test src/features/[FEATURE]/__tests__/`

### Phase 4: Public API + Route

#### [CREATE] src/features/[FEATURE]/index.ts
- **IMPLEMENT**: export the hooks, components, and types routes/other features need — nothing more
- **GOTCHA**: this is the ONLY entry point; no deep imports from outside the slice

#### [CREATE] src/routes/[ROUTE].tsx
- **IMPLEMENT**: import from `@/features/[FEATURE]`; compose its components; thin
- **PATTERN**: [existing route file:line]
- **GOTCHA**: dynamic params use `$` prefix (`$itemId.tsx`); `routeTree.gen.ts` regenerates on `pnpm dev`
- **VALIDATE**: `pnpm build`

### Phase 5: Tests
- **IMPLEMENT**: co-located `__tests__/` — mock supabase in hook tests, mock hooks in component tests
- **VALIDATE**: `pnpm test --run`

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and full feature correctness.

### Level 1: Syntax & Types
`pnpm tsc --noEmit && pnpm biome check .`

### Level 2: Tests (per phase, then full)
`pnpm test src/features/[FEATURE]/__tests__/` → `pnpm test --run`

### Level 3: Database (if applicable)
`supabase db reset && supabase gen types typescript --local > src/shared/types/database.types.ts`

### Level 4: Build / Manual
`pnpm build`; then click through the feature — loading/empty/error/success states render.

---

## ACCEPTANCE CRITERIA

- [ ] All specified functionality implemented
- [ ] All validation commands pass with zero errors
- [ ] Feature self-contained in a slice; public API minimal; route integrated
- [ ] Tests co-located in `__tests__/`; pass per phase
- [ ] Code follows codebase conventions; no `shared/ → features/` leakage
- [ ] No regressions in existing functionality

## NOTES

[Design decisions, trade-offs, anything the execution agent should know]

---

**Confidence Score**: [#/10] that execution succeeds on the first attempt
````

## Quality Criteria

- **Context Completeness**: patterns identified, docs linked w/ anchors, integration points mapped,
  gotchas captured, every task has an executable validation command.
- **Implementation Ready**: tasks ordered by dependency, atomic, with file:line pattern references.
- **Pattern Consistency**: follows codebase conventions; no reinvention of existing utils/hooks.
- **No Prior Knowledge Test**: someone unfamiliar with the codebase could implement from the plan alone.

## Output

Created: `.agents/plans/<feature>.md` — execute with `/execute-plan .agents/plans/<feature>.md`.

After creating the plan, report: feature summary + approach, full path, complexity, key risks,
and a confidence score (#/10) for one-pass success.
