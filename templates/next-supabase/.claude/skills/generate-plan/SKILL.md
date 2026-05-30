---
description: Research and create implementation plan for a Next.js + Supabase feature
---

# Generate Next.js + Supabase Plan

## Feature: $ARGUMENTS

Accepts a feature description (`/generate-plan "add dark mode toggle"`) or no argument (prompts
for one).

## Mission

Transform a feature request into a **comprehensive, feature-framed implementation plan** through
systematic codebase analysis, external research, and strategic planning — specialized for
Next.js 16 (App Router) + Supabase.

**Core Principle**: We do NOT write code in this phase. The goal is a context-rich plan that
enables one-pass implementation success for the execution agent.

**Key Philosophy**: Context is King. The plan must contain ALL information needed to implement —
patterns, mandatory reading, documentation, validation commands — so `/execute-plan` succeeds on
the first attempt without re-researching.

## Planning Process

### Phase 0: PRD Alignment

Align the plan to `.agents/PRD.md` — the project's source of truth for scope, architecture, success criteria, and risks. Cite the relevant PRD sections (MVP scope, affected slices, success criteria) in the plan's Requirements.

If `.agents/PRD.md` does not exist, stop and tell the user to run `/create-prd` first.

### Phase 1: Feature Understanding

**Deep Feature Analysis:**
- Extract the core problem being solved and the user value.
- Determine feature type: New Capability / Enhancement / Refactor / Bug Fix.
- Assess complexity: Low / Medium / High.
- Map affected slices (`src/features/`) and integration points.
- Determine rendering strategy per route (SSR / SSG / ISR / dynamic).

**Create / refine the User Story:**
```
As a <type of user>
I want to <action/goal>
So that <benefit/value>
```

Also produce **Requirements** (Must-have / Nice-to-have) and **Out of Scope**.

### Phase 2: Codebase Intelligence Gathering

**Read the codebase before planning. The plan must reference real files, not generic advice.**

1. **Project structure** — confirm Next.js version, App Router route groups, the Supabase
   server/browser clients in `lib/supabase/`, `middleware.ts` auth.
2. **Pattern recognition** — find the closest existing feature slice in `src/features/`; it is
   the pattern to mirror (Server Action shape, Server/Client component split, schema location,
   route composition, `index.ts` public API, test layout). Note naming, error handling, anti-patterns.
3. **Established docs (context on demand):** scan `.agents/documentation/` — deliberately-
   established, non-obvious codebase patterns (e.g. `vertical-slice-architecture.md`). Read the
   entries relevant to this feature; relevant ones override generic defaults and go into Context
   References. Most standard code has no doc — its absence means "follow conventional best
   practice + existing code."
4. **Dependency analysis** — libraries the feature touches; how they're already integrated.
5. **Integration points** — `src/app/` (route group the page belongs in), `src/middleware.ts`,
   `lib/` + `components/ui/` primitives reused, the supabase clients.

**Clarify ambiguities now** — resolve library/approach/architecture questions before researching.

### Phase 3: External Research

Fill gaps the PRD + codebase + documentation don't cover. Fetch latest official docs:

| Technology | Documentation URL |
|------------|-------------------|
| Next.js App Router | https://nextjs.org/docs/app |
| Server Components | https://nextjs.org/docs/app/building-your-application/rendering/server-components |
| Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations |
| Metadata API | https://nextjs.org/docs/app/building-your-application/optimizing/metadata |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

**WebSearch** for `next.js app router [feature]`, `supabase next.js server components`, SEO /
`generateMetadata` patterns if relevant, and known gotchas. **WebFetch** the pages that matter.
Capture URLs **with section anchors** and the *why* for each into Context References.

### Phase 4: Deep Strategic Thinking

Think harder about: how the feature fits the existing architecture; critical dependencies and
order of operations; what could go wrong (edge cases, auth/RLS, cache/revalidation, Server vs
Client boundary); how it's tested; performance and security. Choose between alternatives with
clear rationale; design for the slice boundary (no `shared/ → features/` leakage).

### Phase 5: Plan Structure Generation

Write `.agents/plans/<kebab-feature-name>.md` using the Output Format below. Fill every section;
replace all `[PLACEHOLDERS]`. The plan must pass the "No Prior Knowledge Test" — someone
unfamiliar with the codebase could implement it from the plan alone.

---

## Output Format

````markdown
# Feature: [FEATURE_NAME]

Validate documentation, codebase patterns, and task sanity before implementing. Pay special
attention to existing util/type/action names — import from the right files, no deep imports past
a slice's `index.ts`.

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
**Rendering**: [per-route SSR/SSG/ISR/dynamic]
**Dependencies**: [external libs/services, or NONE]
**PRD Alignment**: [PRD section(s) this serves]

---

## CONTEXT REFERENCES

### Relevant Codebase Files — IMPORTANT: READ THESE BEFORE IMPLEMENTING

- `src/features/[similar]/actions/[x].ts:NN` — Why: mirror this Server Action shape
- `src/features/[similar]/index.ts:NN` — Why: public API surface to follow
- `src/app/(group)/[similar]/page.tsx:NN` — Why: how a page composes a feature's public API
- `src/lib/supabase/server.ts` — Why: the server client used by actions

### New Files to Create

- `src/features/[FEATURE]/schemas/[FEATURE].schema.ts` — Zod schema(s)
- `src/features/[FEATURE]/types/[FEATURE].types.ts` — inferred types
- `src/features/[FEATURE]/actions/[FEATURE].ts` — Server Actions
- `src/features/[FEATURE]/components/[FEATURE]-list.tsx` — Server/Client Components
- `src/features/[FEATURE]/components/[FEATURE]-form.tsx`
- `src/features/[FEATURE]/__tests__/*` — co-located tests
- `src/features/[FEATURE]/index.ts` — public API
- `src/app/(group)/[ROUTE]/page.tsx` (+ `loading.tsx` / `error.tsx` as needed)

### Relevant Documentation — READ BEFORE IMPLEMENTING

- `.agents/documentation/vertical-slice-architecture.md` — slice boundaries, Server/Client split
- [other relevant `.agents/documentation/*.md` found in Phase 2, if any]
- [External]: [url#anchor] — Why: [specific need]

### Patterns to Follow

[Concrete conventions extracted from the codebase in Phase 2 — Server Action shape, revalidation,
how actions validate input and use the server client, Server-vs-Client boundary. Include real
file:line references.]

---

## TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js (App Router) | 16.x |
| **UI** | React | ^19 |
| **Package Manager** | pnpm | 10.x |
| **UI Kit** | shadcn/ui + Lucide | Latest |
| **Styling** | Tailwind CSS | ^4 |
| **Forms** | React Hook Form + Zod | ^7 / ^3 |
| **Backend** | Supabase (SSR) | ^2.97 |
| **Linting** | Biome | 2.x |
| **Testing** | Vitest + Testing Library | Latest |

Architecture: vertical slices + App Router — `src/app/` (thin route groups, layouts,
loading/error) + `src/features/[feature]/` (`components/`, `actions/`, `schemas/`, `types/`,
`__tests__/`, `index.ts`) + `src/lib/` (supabase clients) + `src/components/` (shared UI). Pages →
Features via `index.ts`; Server Actions → `lib/` clients; Shared → Features NEVER. See
`.agents/documentation/vertical-slice-architecture.md`.

---

## IMPLEMENTATION PLAN

> Name artifacts + their interfaces. Standard Next.js/React/Supabase code follows conventional
> patterns; only spell out what's non-obvious or codebase-specific.

### Phase 1: Data Layer (Zod schemas + types + Supabase migration)
Migration (if DB changes), Zod schema + create/update variants, inferred types.

### Phase 2: Server Actions
`'use server'` reads + create/update/delete mutations; validate with Zod; `revalidatePath`.

### Phase 3: Components
Server Components for reads; Client Components (`'use client'`) for interaction; RHF + Zod forms.

### Phase 4: Public API + Route Integration
`index.ts` exports; an `app/` page composing the feature (+ loading/error).

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
  `supabase gen types typescript --local > src/lib/database.types.ts`

#### [CREATE] src/features/[FEATURE]/schemas/[FEATURE].schema.ts
- **IMPLEMENT**: Zod row schema + create/update variants (omit/partial)
- **VALIDATE**: `pnpm tsc --noEmit`

#### [CREATE] src/features/[FEATURE]/types/[FEATURE].types.ts
- **IMPLEMENT**: `z.infer` type exports from the schema
- **VALIDATE**: `pnpm tsc --noEmit`

### Phase 2: Server Actions

#### [CREATE] src/features/[FEATURE]/actions/[FEATURE].ts
- **IMPLEMENT**: `'use server'`; list/get reads + create/update/delete mutations; validate input
  with the Zod schema; use `lib/supabase/server`; `revalidatePath` after mutations
- **PATTERN**: [similar action file:line]
- **IMPORTS**: `lib/supabase/server`, `revalidatePath`, the schema/types
- **GOTCHA**: `getUser()` not `getSession()`; never share a client across requests
- **VALIDATE**: `pnpm tsc --noEmit`

### Phase 3: Components

#### [CREATE] src/features/[FEATURE]/components/[FEATURE]-list.tsx
- **IMPLEMENT**: Server Component reading via the action; renders empty/success states
- **PATTERN**: [similar component file:line]
- **VALIDATE**: `pnpm test src/features/[FEATURE]/__tests__/`

#### [CREATE] src/features/[FEATURE]/components/[FEATURE]-form.tsx
- **IMPLEMENT**: `'use client'`; React Hook Form + Zod resolver; calls the Server Action
- **VALIDATE**: `pnpm test src/features/[FEATURE]/__tests__/`

### Phase 4: Public API + Route

#### [CREATE] src/features/[FEATURE]/index.ts
- **IMPLEMENT**: export the components, actions, and types pages need — nothing more
- **GOTCHA**: this is the ONLY entry point; no deep imports from outside the slice

#### [CREATE] src/app/(group)/[ROUTE]/page.tsx
- **IMPLEMENT**: import from the feature's `index.ts`; compose; `generateMetadata` if SEO; thin
- **PATTERN**: [existing page file:line]
- **VALIDATE**: `pnpm build`

#### [CREATE] src/app/(group)/[ROUTE]/loading.tsx and error.tsx  (where the fetch warrants it)
- **IMPLEMENT**: loading fallback + error boundary
- **VALIDATE**: `pnpm build`

### Phase 5: Tests
- **IMPLEMENT**: co-located `__tests__/` — mock actions in component tests
- **VALIDATE**: `pnpm test --run`

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and full feature correctness.

### Level 1: Syntax & Types
`pnpm tsc --noEmit && pnpm lint`

### Level 2: Tests (per phase, then full)
`pnpm test src/features/[FEATURE]/__tests__/` → `pnpm test --run`

### Level 3: Database (if applicable)
`supabase db reset && supabase gen types typescript --local > src/lib/database.types.ts`

### Level 4: Build / Manual
`pnpm build`; then click through the feature — loading/empty/error/success states render.

---

## ACCEPTANCE CRITERIA

- [ ] All specified functionality implemented
- [ ] All validation commands pass with zero errors
- [ ] Feature self-contained in a slice; public API minimal; route(s) integrated
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
- **Pattern Consistency**: follows codebase conventions; no reinvention of existing utils/actions.
- **No Prior Knowledge Test**: someone unfamiliar with the codebase could implement from the plan alone.

## Output

Created: `.agents/plans/<feature>.md` — execute with `/execute-plan .agents/plans/<feature>.md`.

After creating the plan, report: feature summary + approach, full path, complexity, key risks,
and a confidence score (#/10) for one-pass success.
