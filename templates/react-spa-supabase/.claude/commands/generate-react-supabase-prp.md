# Generate React + Supabase PRP

Generate a comprehensive, well-researched PRP for a React 19 + Supabase project.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-react-supabase-prp "add dark mode toggle"`
- **New App**: `/generate-react-supabase-prp PRPs/INITIAL.md`
- **New Feature**: `/generate-react-supabase-prp PRPs/FEATURE.md`

## Process

### 1. Load Base Template
- Read `PRPs/templates/prp_react_supabase_base.md` completely
- This is the skeleton structure - replace all `[PLACEHOLDERS]` with actual feature details

### 2. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages needed
- For features: identify affected slices, database changes, components
- List all technologies/integrations involved

### 3. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 3.1 Core Stack Research
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

#### 3.2 Feature-Specific Research
- **WebSearch** for: `[feature] react 19 best practices 2024`
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for common gotchas and edge cases
- **WebFetch** relevant documentation pages

#### 3.3 Integration Research (if applicable)
| Integration | Research |
|-------------|----------|
| Stripe | https://docs.stripe.com/payments |
| Vercel AI SDK | https://sdk.vercel.ai/docs |
| Supabase Storage | https://supabase.com/docs/guides/storage |
| Supabase Realtime | https://supabase.com/docs/guides/realtime |

#### 3.4 Document Findings
Populate the PRP's "Research & Documentation" section with:
- Links to relevant docs consulted
- Key patterns discovered
- Gotchas and edge cases found
- Version-specific considerations

### 4. Generate PRP

Create `PRPs/[name].md` using base template:

1. **Fill metadata** - Feature name, affected slices, database changes, dependencies
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add research section** - All documentation links and findings
4. **Customize phases** - Adapt code examples to actual feature
5. **Include AI docs context** - Paste relevant documentation snippets
6. **Update gotchas** - Add feature-specific warnings discovered
7. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description (e.g., "luxury" → dark + gold + serif, "playful" → rounded + bright colors) or ask user. Include in PRP:
   - Theme colors (define in `@theme` block for Tailwind v4)
   - Typography (font families, heading styles)
   - Custom utility classes (glows, gradients, effects)
   - Component styling direction (e.g., "cinematic cards with gold borders")
8. **Route integration for every feature** - For each feature slice created, include a Task in Phase 6 that integrates it into a route. Create a new route file if one doesn't exist for that feature. Routes must import from `@/features/[name]` and compose the feature's exported components.

### 5. Validate PRP Completeness

Before saving, verify:
- [ ] Research section has relevant documentation links
- [ ] AI docs section has key code patterns from docs
- [ ] All placeholders replaced with actual names
- [ ] Database schema matches data model
- [ ] Test files include feature-specific assertions
- [ ] Gotchas section updated with research findings
- [ ] Visual design section includes theme.css with colors, fonts, and custom utilities

## Output

Created: `PRPs/[name].md`

Execute with: `/execute-react-supabase-prp PRPs/[name].md`

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
