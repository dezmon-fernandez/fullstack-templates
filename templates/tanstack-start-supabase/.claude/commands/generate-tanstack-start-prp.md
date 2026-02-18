# Generate TanStack Start + Supabase PRP

Generate a comprehensive, well-researched PRP for a TanStack Start + Supabase project with SSR.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-tanstack-start-prp "add user profile with SEO"`
- **New App**: `/generate-tanstack-start-prp PRPs/INITIAL.md`
- **New Feature**: `/generate-tanstack-start-prp PRPs/FEATURE.md`

## Process

### 1. Load Base Template
- Read `PRPs/templates/prp_tanstack_start_base.md` completely
- This is the skeleton structure - replace all `[PLACEHOLDERS]` with actual feature details

### 2. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages, SSR requirements
- For features: identify affected slices, database changes, server functions needed
- List all technologies/integrations involved
- Determine SSR mode per route (true/false/'data-only')

### 3. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 3.1 Core Stack Research
For each technology in the feature, fetch latest documentation:

| Technology | Documentation URL |
|------------|-------------------|
| TanStack Start | https://tanstack.com/start/latest/docs |
| TanStack Router | https://tanstack.com/router/latest/docs |
| TanStack Query v5 | https://tanstack.com/query/latest/docs |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side |
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

#### 3.2 SSR-Specific Research
- **WebSearch** for: `tanstack start [feature] ssr pattern`
- **WebSearch** for: `supabase server-side rendering authentication`
- **WebFetch** relevant TanStack Start docs for server functions
- **WebFetch** https://tanstack.com/start/latest/docs/framework/react/guide/server-functions

#### 3.3 SEO Research (if applicable)
- **WebSearch** for: `[feature type] seo meta tags best practices`
- Research structured data (JSON-LD) if applicable
- **WebFetch** https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management

#### 3.4 Feature-Specific Research
- **WebSearch** for: `[feature] react 19 best practices 2024`
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for common gotchas and edge cases

#### 3.5 Document Findings
Populate the PRP's "Research & Documentation" section with:
- Links to relevant docs consulted
- Key patterns discovered
- Gotchas and edge cases found
- Version-specific considerations

### 4. Generate PRP

Create `PRPs/[name].md` using base template:

1. **Fill metadata** - Feature name, affected slices, SSR mode per route, database changes
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add server function definitions** - For data fetching and mutations
4. **Include head configuration** - For SEO-critical routes
5. **Add research section** - All documentation links and findings
6. **Customize phases** - Include server function phase (Phase 3) before hooks
7. **Include AI docs context** - Paste relevant documentation snippets
8. **Update gotchas** - Add feature-specific warnings discovered
9. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description or ask user.
10. **Route integration for every feature (CRITICAL)** - For each feature slice created:
    - Include a dedicated Task in Phase 7 for EACH route
    - Write COMPLETE component JSX that renders actual feature components
    - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
    - All loader data MUST be passed as typed props to feature components
    - Include full head/SEO configuration
    - Fill in the Route Completeness Checklist at the end of Phase 7

### 5. Validate PRP Completeness

Before saving, verify:

**Server & Data:**
- [ ] Server functions defined for data operations
- [ ] SSR mode specified for each route (true/false/'data-only')
- [ ] Middleware defined if auth required
- [ ] Database schema matches data model

**Research & Documentation:**
- [ ] Research section has relevant documentation links
- [ ] AI docs section has key code patterns from docs
- [ ] Gotchas section updated with research findings

**Route Completeness (CRITICAL):**
- [ ] Every feature slice has corresponding route(s) in Phase 7
- [ ] Each route task includes FULL component JSX (no placeholders/TODOs)
- [ ] Each route imports and renders actual feature components
- [ ] All loader data passed as typed props to components
- [ ] Head configuration with title, description, og:tags for each route
- [ ] Route completeness checklist filled in

**General:**
- [ ] All placeholders replaced with actual names
- [ ] Test files include feature-specific assertions

## Output

Created: `PRPs/[name].md`

Execute with: `/execute-tanstack-start-prp PRPs/[name].md`

---

## Research Examples

### Example: User Profile Feature with SSR
```
WebSearch: "tanstack start user profile ssr"
WebSearch: "supabase user profile server-side"
WebFetch: https://tanstack.com/start/latest/docs/framework/react/guide/server-functions
WebFetch: https://supabase.com/docs/guides/auth/server-side
```

### Example: Dark Mode Feature
```
WebSearch: "tailwind v4 dark mode toggle react"
WebSearch: "tanstack start theme provider ssr"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Blog with SEO
```
WebSearch: "tanstack start blog seo meta tags"
WebSearch: "supabase blog posts server-side rendering"
WebFetch: https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
WebFetch: https://tanstack.com/start/latest/docs/framework/react/guide/selective-ssr
```

### Example: Real-time Chat Feature
```
WebSearch: "supabase realtime tanstack start"
WebSearch: "tanstack query supabase realtime subscription"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
# Note: Real-time features typically use ssr: false or ssr: 'data-only'
```
