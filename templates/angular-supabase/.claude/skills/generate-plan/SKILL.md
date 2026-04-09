---
description: Research and create implementation plan for an Angular 21 + Supabase feature
---

# Generate Angular + Supabase Plan

Generate a comprehensive, well-researched plan for an Angular 21 + Supabase project.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-plan "add dark mode toggle"`
- **New App**: `/generate-plan planning/INITIAL.md`
- **New Feature**: `/generate-plan planning/FEATURE.md`

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

#### 2.2 Feature-Specific Research
- **WebSearch** for: `[feature] angular 21 best practices`
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for common gotchas and edge cases
- **WebFetch** relevant documentation pages

#### 2.3 Document Findings
Populate the plan's "Research & Documentation" section with:
- Links to relevant docs consulted
- Key patterns discovered
- Gotchas and edge cases found
- Version-specific considerations

### 3. Generate Plan

Create `planning/[name].md` using the output format below:

1. **Fill metadata** — Feature name, affected slices, database changes, dependencies
2. **Populate requirements** — From INITIAL.md or FEATURE.md input
3. **Add research section** — All documentation links and findings
4. **Customize phases** — Adapt code examples to actual feature
5. **Update gotchas** — Add feature-specific warnings discovered
6. **Include visual design spec** — If INITIAL.md provided, extract visual design section. Include:
   - Theme colors (define in `@theme` block for Tailwind v4)
   - Typography (font families, heading styles)
   - Component styling direction
7. **Route integration for every feature** — For each feature slice, include a Task that integrates it into a route via lazy loading.

### 4. Validate Plan Completeness

Before saving, verify:
- [ ] Research section has relevant documentation links
- [ ] All placeholders replaced with actual names
- [ ] Database schema matches data model
- [ ] Test files include feature-specific assertions
- [ ] Gotchas section updated with research findings
- [ ] Visual design section includes theme customization

## Output

Created: `planning/[name].md`

Execute with: `/execute-plan planning/[name].md`

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
| **Framework** | Angular | ^21.0 |
| **Language** | TypeScript | ~5.8 |
| **Package Manager** | pnpm | 10.x |
| **Styling** | Tailwind CSS | ^4 |
| **Forms** | Angular Reactive Forms + Zod | Built-in / ^3.24 |
| **Backend** | Supabase JS | ^2.97 |
| **Linting** | Biome | ^2.0 |
| **Testing** | Vitest + Testing Library | Built-in / ^17.0 |

---

## Architecture: Vertical Slices

```
src/
├── app/
│   ├── features/         # Self-contained vertical slices
│   │   └── [feature]/
│   │       ├── components/
│   │       ├── services/
│   │       ├── models/
│   │       ├── guards/
│   │       └── [feature].routes.ts
│   └── shared/           # Cross-cutting services, guards, utils
├── environments/
└── styles.css
```

**Import Rules:**
- Routes -> Features (lazy-load)
- Features -> Shared
- Features -> Features
- Shared -> Features NEVER

**Supabase Client**: `import { SupabaseService } from '@app/shared/services/supabase.service'`

---

## Implementation Blueprint

### Phase 1: Database Schema (if needed)

```yaml
Task 1.1 - Migration:
  file: supabase/migrations/[TIMESTAMP]_[NAME].sql
  validation: supabase db reset succeeds

Task 1.2 - Generate Types:
  commands:
    - supabase gen types typescript --local > src/app/shared/types/database.types.ts
  validation: ng build passes
```

### Phase 2: Feature Slice — Models & Services

```yaml
Task 2.1 - Models:
  file: src/app/features/[FEATURE]/models/[FEATURE].model.ts
  content: |
    import { z } from 'zod';
    export const [item]Schema = z.object({ ... });
    export type [Item] = z.infer<typeof [item]Schema>;

Task 2.2 - Service:
  file: src/app/features/[FEATURE]/services/[FEATURE].service.ts
  content: |
    @Injectable({ providedIn: 'root' })
    export class [Feature]Service {
      private readonly supabase = inject(SupabaseService);
      // CRUD methods using supabase.client
    }
```

### Phase 3: Feature Slice — Components

```yaml
Task 3.1 - List Component:
  file: src/app/features/[FEATURE]/components/[FEATURE]-list.component.ts

Task 3.2 - Form Component:
  file: src/app/features/[FEATURE]/components/[FEATURE]-form.component.ts

Task 3.3 - Component Tests:
  validation: ng test --include='**/[FEATURE]/**'
```

### Phase 4: Route Integration

```yaml
Task 4.1 - Feature Routes:
  file: src/app/features/[FEATURE]/[FEATURE].routes.ts

Task 4.2 - App Routes Update:
  file: src/app/app.routes.ts
  changes:
    - Add lazy-loaded route: loadChildren -> [FEATURE].routes.ts
```

---

## Validation Gates

### Per-Phase Testing (CRITICAL)

| Phase | Run Tests? | Command |
|-------|------------|---------|
| 1. Database | No | — |
| 2. Models & Services | **YES** | `ng test --include='**/[FEATURE]/**'` |
| 3. Components | **YES** | `ng test --include='**/[FEATURE]/**'` |
| 4. Routes | Verify | `pnpm build` |

### Final Validation
```bash
pnpm build
pnpm lint
pnpm test:run
```

---

## Common Gotchas

### Angular 21
- Zoneless by default — signals drive change detection
- Standalone components — no NgModules
- Use `inject()` not constructor injection
- `httpResource` for reads, `HttpClient` for mutations
- Control flow: `@if`, `@for`, `@switch`

### Supabase
- RLS returns empty array (not error) when blocking
- Run `supabase gen types` after EVERY migration
- Always use `getUser()` not `getSession()` for auth verification

### Testing
- Run tests after each phase — don't batch to the end
- Use TestBed for DI, Testing Library for DOM assertions
- Mock services in component tests
