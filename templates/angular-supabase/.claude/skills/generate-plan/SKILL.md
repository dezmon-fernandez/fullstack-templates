---
description: Research and create implementation plan for an Angular 21 + Supabase feature
---

# Generate Angular + Supabase Plan

## Feature: $ARGUMENTS

Accepts a feature description (`/generate-plan "add dark mode toggle"`) or no argument (prompts
for one).

## Mission

Transform a feature request into a **comprehensive, feature-framed implementation plan** through
systematic codebase analysis, external research, and strategic planning — specialized for
Angular 21 + Supabase.

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
- Map affected slices (`src/app/features/`) and integration points.

**Create / refine the User Story:**
```
As a <type of user>
I want to <action/goal>
So that <benefit/value>
```

Also produce **Requirements** (Must-have / Nice-to-have) and **Out of Scope**.

### Phase 2: Codebase Intelligence Gathering

**Read the codebase before planning. The plan must reference real files, not generic advice.**

1. **Project structure** — confirm Angular version, zoneless config, route setup
   (`app.config.ts`, `app.routes.ts`), the `SupabaseService` wrapper.
2. **Pattern recognition** — find the closest existing feature slice in `src/app/features/`; it
   is the pattern to mirror (service shape, signal usage, `input()`/`output()`, route wiring,
   test layout). Note naming conventions, error handling, and anti-patterns to avoid.
3. **Established docs & skills (context on demand):**
   - Scan `.agents/documentation/` — deliberately-established, non-obvious codebase patterns
     (e.g. `vertical-slice-architecture.md`). Read the entries relevant to this feature; relevant
     ones override generic defaults and go into Context References. Most standard code has no doc —
     its absence means "follow conventional best practice + existing code."
   - The `angular-testing` skill (harness + contract-testing pattern) governs every `*.spec.ts`;
     reference it for the test tasks rather than re-teaching tests.
4. **Dependency analysis** — libraries the feature touches; how they're already integrated.
5. **Integration points** — `app.routes.ts` (lazy route registration), `app.config.ts`
   (providers), `shared/` services/guards reused, DB/migration patterns.

**Clarify ambiguities now** — resolve library/approach/architecture questions before researching.

### Phase 3: External Research

Fill gaps the PRD + codebase + documentation don't cover. Fetch latest official docs:

| Technology | Documentation URL |
|------------|-------------------|
| Angular 21 | https://angular.dev/overview |
| Angular Signals | https://angular.dev/guide/signals |
| Angular httpResource | https://angular.dev/api/common/http/httpResource |
| Angular Router | https://angular.dev/guide/routing |
| Supabase JS | https://supabase.com/docs/reference/javascript |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| Supabase RLS | https://supabase.com/docs/guides/database/postgres/row-level-security |
| Tailwind v4 | https://tailwindcss.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

**WebSearch** for `[feature] angular 21 best practices`, `[feature] supabase implementation`, and
known gotchas. **WebFetch** the pages that matter. Capture URLs **with section anchors** and the
*why* for each into Context References.

### Phase 4: Deep Strategic Thinking

Think harder about: how the feature fits the existing architecture; critical dependencies and
order of operations; what could go wrong (edge cases, auth/RLS, race conditions); how it's tested;
performance and security. Choose between alternatives with clear rationale; design for the slice
boundary (no `shared/ → features/` leakage).

### Phase 5: Plan Structure Generation

Write `.agents/plans/<kebab-feature-name>.md` using the Output Format below. Fill every section;
replace all `[PLACEHOLDERS]`. The plan must pass the "No Prior Knowledge Test" — someone
unfamiliar with the codebase could implement it from the plan alone.

---

## Output Format

````markdown
# Feature: [FEATURE_NAME]

Validate documentation, codebase patterns, and task sanity before implementing. Pay special
attention to existing util/type/service names — import from the right files.

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

- `src/app/features/[similar]/[similar].service.ts:NN` — Why: mirror this service + signal shape
- `src/app/features/[similar]/[similar].routes.ts:NN` — Why: lazy route pattern to follow
- `src/app/app.routes.ts:NN` — Why: where the lazy route registers
- `src/app/shared/services/supabase.service.ts` — Why: the injected client

### New Files to Create

> Slice convention: root files flat with postfix (`[feature].component.ts`, `.service.ts`, …);
> presentational children each in their own postfix-named subfolder at the slice root (no
> `components/` wrapper). See `vertical-slice-architecture.md`.

- `src/app/features/[FEATURE]/[FEATURE].model.ts` — Zod schema + inferred types
- `src/app/features/[FEATURE]/[FEATURE].service.ts` — data access
- `src/app/features/[FEATURE]/[FEATURE].component.ts` — smart/page component
- `src/app/features/[FEATURE]/[FEATURE]-list/[FEATURE]-list.component.ts` — child (own subfolder)
- `src/app/features/[FEATURE]/[FEATURE]-form/[FEATURE]-form.component.ts` — child (own subfolder)
- `src/app/features/[FEATURE]/[FEATURE].routes.ts`
- `*.spec.ts` alongside each (per the angular-testing skill)

### Relevant Documentation — READ BEFORE IMPLEMENTING

- `.agents/documentation/vertical-slice-architecture.md` — slice boundaries, what-goes-where
- [other relevant `.agents/documentation/*.md` found in Phase 2, if any]
- `angular-testing` skill — harness + contract-testing pattern for all `*.spec.ts`
- [External]: [url#anchor] — Why: [specific need]

### Patterns to Follow

[Concrete conventions extracted from the codebase in Phase 2 — naming, signal state, error
handling, how services parse Supabase responses. Include real file:line references.]

---

## TECHNOLOGY STACK

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Angular | ^21.0 |
| **Language** | TypeScript | ~5.8 |
| **Package Manager** | pnpm | 10.x |
| **Styling** | Tailwind CSS | ^4 |
| **Forms** | Angular Signal Forms + Zod | Built-in / ^3.24 |
| **Backend** | Supabase JS | ^2.97 |
| **Linting** | Biome | ^2.0 |
| **Testing** | Vitest + Testing Library | Built-in / ^17.0 |

Architecture: vertical slices — `src/app/features/[feature]/` holds root files flat with postfix
(`[feature].component.ts`, `.service.ts`, `.model.ts`, `.routes.ts`); presentational children get
their own postfix-named subfolder at the slice root (`[child]/[child].component.ts`); plus
`src/app/shared/`. Routes → Features (lazy) → Shared; Shared → Features NEVER. See
`.agents/documentation/vertical-slice-architecture.md`.

---

## IMPLEMENTATION PLAN

> Name artifacts + their interfaces. Standard Angular/Supabase code follows conventional patterns;
> only spell out what's non-obvious or codebase-specific.

### Phase 1: Data Layer (Zod models + Supabase access)
Migration (if DB changes), Zod model, `@Injectable` service with signal-backed reads + mutations.

### Phase 2: Components
Standalone components — `input()`/`output()` signals, `@if`/`@for`+track, OnPush, Signal Forms.

### Phase 3: Route Integration
Feature `[FEATURE].routes.ts` (lazy `loadComponent` + guard) wired into `app.routes.ts`.

### Phase 4: Testing & Validation
Per the `angular-testing` skill; run tests after each phase.

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
  `supabase gen types typescript --local > src/app/shared/types/database.types.ts`

#### [CREATE] src/app/features/[FEATURE]/[FEATURE].model.ts
- **IMPLEMENT**: Zod row schema + create/update variants (by omit/partial); `z.infer` types
- **PATTERN**: [existing model file:line]
- **GOTCHA**: timestamps are ISO strings (`z.string().datetime()`)
- **VALIDATE**: `pnpm tsc --noEmit`

#### [CREATE] src/app/features/[FEATURE]/[FEATURE].service.ts
- **IMPLEMENT**: `@Injectable({providedIn:'root'})`; `inject(SupabaseService)`; signal-backed
  reads; `load/create/update/remove`; parse responses with the Zod schema at the boundary
- **PATTERN**: [similar service file:line]
- **IMPORTS**: `inject`, `signal`, the model schema/types, `SupabaseService`
- **GOTCHA**: mutate signals (`.set`/`.update`) to drive UI; `getUser()` not `getSession()`
- **VALIDATE**: `ng test --include='**/[FEATURE]/**'`

### Phase 2: Components

#### [CREATE] src/app/features/[FEATURE]/[FEATURE].component.ts
- **IMPLEMENT**: smart/page component; injects the service; composes the child components; renders signal state
- **PATTERN**: [similar root component file:line]
- **GOTCHA**: read signals with `()`; business logic stays in the service, not the component
- **VALIDATE**: `ng test --include='**/[FEATURE]/**'`

#### [CREATE] src/app/features/[FEATURE]/[FEATURE]-list/[FEATURE]-list.component.ts
- **IMPLEMENT**: presentational; standalone, OnPush; `input()`/`output()`; `@if`/`@for`+track
- **PATTERN**: [similar child component file:line]
- **GOTCHA**: `@for` requires `track`; presentational children take `input()`s, no service injection
- **VALIDATE**: `ng test --include='**/[FEATURE]/**'`

#### [CREATE] src/app/features/[FEATURE]/[FEATURE]-form/[FEATURE]-form.component.ts
- **IMPLEMENT**: Signal Form (`form()` over a model signal, schema validation); submit runs Zod `safeParse`; emits via `output()` (parent calls the service)
- **VALIDATE**: `ng test --include='**/[FEATURE]/**'`

### Phase 3: Route Integration

#### [CREATE] src/app/features/[FEATURE]/[FEATURE].routes.ts
- **IMPLEMENT**: `Routes` with lazy `loadComponent` + `canActivate` guard
- **PATTERN**: [existing feature routes file:line]

#### [UPDATE] src/app/app.routes.ts
- **ADD**: lazy `loadChildren` entry pointing at `[FEATURE].routes.ts`
- **VALIDATE**: `pnpm build`

### Phase 4: Tests
- **IMPLEMENT**: `*.spec.ts` per the `angular-testing` skill (harness, `data-testid`,
  `await fixture.whenStable()`, contract not construction)
- **VALIDATE**: `pnpm test:run`

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and full feature correctness.

### Level 1: Syntax & Types
`pnpm tsc --noEmit && pnpm lint`

### Level 2: Tests (per phase, then full)
`ng test --include='**/[FEATURE]/**'` → `pnpm test:run`

### Level 3: Database (if applicable)
`supabase db reset && supabase gen types typescript --local > src/app/shared/types/database.types.ts`

### Level 4: Build / Manual
`pnpm build`; then click through the feature — loading/empty/error/success states render.

---

## ACCEPTANCE CRITERIA

- [ ] All specified functionality implemented
- [ ] All validation commands pass with zero errors
- [ ] Feature self-contained in a vertical slice; route integrated
- [ ] Tests follow the angular-testing skill; pass per phase
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
- **Pattern Consistency**: follows codebase conventions; no reinvention of existing utils/services.
- **No Prior Knowledge Test**: someone unfamiliar with the codebase could implement from the plan alone.

## Output

Created: `.agents/plans/<feature>.md` — execute with `/execute-plan .agents/plans/<feature>.md`.

After creating the plan, report: feature summary + approach, full path, complexity, key risks,
and a confidence score (#/10) for one-pass success.
