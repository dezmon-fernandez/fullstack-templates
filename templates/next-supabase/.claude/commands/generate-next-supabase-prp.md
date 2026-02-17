# Generate Next.js + Supabase PRP

Generate a comprehensive, well-researched PRP for a Next.js App Router + Supabase project with SSR/SEO.

## Input: $ARGUMENTS

Accepts:
- **String**: `/generate-next-supabase-prp "add user profile with SEO"`
- **New App**: `/generate-next-supabase-prp PRPs/INITIAL.md`
- **New Feature**: `/generate-next-supabase-prp PRPs/FEATURE.md`

## Process

### 1. Load Base Template
- Read `PRPs/templates/prp_next_supabase_base.md` completely
- This is the skeleton structure - replace all `[PLACEHOLDERS]` with actual feature details

### 2. Analyze Request
- Read the input from $ARGUMENTS
- For new apps: identify all features, data model, pages, rendering requirements
- For features: identify affected slices, database changes, Server Actions needed
- List all technologies/integrations involved
- Determine rendering strategy per route (SSR/SSG/ISR/dynamic)

### 3. Research Phase (CRITICAL)

**This is the most important step. Execute should implement, not research.**

#### 3.1 Core Stack Research
For each technology in the feature, fetch latest documentation:

| Technology | Documentation URL |
|------------|-------------------|
| Next.js App Router | https://nextjs.org/docs/app |
| Server Components | https://nextjs.org/docs/app/building-your-application/rendering/server-components |
| Server Actions | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations |
| Metadata API | https://nextjs.org/docs/app/building-your-application/optimizing/metadata |
| Middleware | https://nextjs.org/docs/app/building-your-application/routing/middleware |
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| React 19 | https://react.dev/blog/2024/12/05/react-19 |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |
| Vitest | https://vitest.dev/guide |

#### 3.2 SSR/SEO-Specific Research
- **WebSearch** for: `next.js app router [feature] ssr pattern`
- **WebSearch** for: `supabase next.js server components authentication`
- **WebFetch** relevant Next.js docs for Server Components and Server Actions
- **WebFetch** https://nextjs.org/docs/app/building-your-application/data-fetching

#### 3.3 SEO Research (if applicable)
- **WebSearch** for: `[feature type] seo meta tags best practices`
- Research structured data (JSON-LD) if applicable
- **WebFetch** https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **WebSearch** for: `next.js generateMetadata dynamic seo`

#### 3.4 Feature-Specific Research
- **WebSearch** for: `[feature] next.js app router best practices`
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

1. **Fill metadata** - Feature name, affected slices, rendering strategy per route, database changes
2. **Populate requirements** - From INITIAL.md or FEATURE.md input
3. **Add Server Action definitions** - For data mutations
4. **Include generateMetadata configuration** - For SEO-critical routes
5. **Add research section** - All documentation links and findings
6. **Customize phases** - Include Server Actions phase before components
7. **Include AI docs context** - Paste relevant documentation snippets
8. **Update gotchas** - Add feature-specific warnings discovered
9. **If fresh project** (no `package.json`) - Check `.env.local` exists using `test -f .env.local` (never read its contents). If missing, stop and ask user to copy from `.env.example` and add their Supabase keys. Then include Phase 0: Project Scaffolding in the PRP with create-next-app setup, dependencies, shadcn, Supabase clients, and middleware. Note: `src/lib/supabase/server.ts` and `src/lib/supabase/client.ts` already exist - do not overwrite.
10. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description or ask user.
11. **Route integration for every feature (CRITICAL)** - For each feature slice created:
    - Include a dedicated Task in Phase 6 for EACH page
    - Write COMPLETE page content that renders actual feature components
    - NO placeholder comments like `{/* TODO */}` or `{/* Content here */}`
    - Server Components must fetch data and pass as typed props
    - Include full generateMetadata for SEO-critical pages
    - Include loading.tsx and error.tsx where appropriate
    - Fill in the Route Completeness Checklist at the end of Phase 6

### 5. Validate PRP Completeness

Before saving, verify:

**Server & Data:**
- [ ] Server Actions defined for data mutations
- [ ] Rendering strategy specified for each route (SSR/SSG/ISR/dynamic)
- [ ] Middleware handles auth session refresh
- [ ] Database schema matches data model

**Research & Documentation:**
- [ ] Research section has relevant documentation links
- [ ] AI docs section has key code patterns from docs
- [ ] Gotchas section updated with research findings

**Route Completeness (CRITICAL):**
- [ ] Every feature slice has corresponding page(s) in Phase 6
- [ ] Each page includes FULL component rendering (no placeholders/TODOs)
- [ ] Each page imports and renders actual feature components
- [ ] Server Components fetch data and pass typed props
- [ ] generateMetadata defined for SEO-critical pages
- [ ] Route completeness checklist filled in

**General:**
- [ ] All placeholders replaced with actual names
- [ ] Test files include feature-specific assertions

## Output

Created: `PRPs/[name].md`

Execute with: `/execute-next-supabase-prp PRPs/[name].md`

---

## Research Examples

### Example: User Profile Feature with SSR
```
WebSearch: "next.js app router user profile server component"
WebSearch: "supabase user profile server-side next.js"
WebFetch: https://nextjs.org/docs/app/building-your-application/data-fetching
WebFetch: https://supabase.com/docs/guides/auth/server-side/nextjs
```

### Example: Dark Mode Feature
```
WebSearch: "tailwind v4 dark mode toggle next.js app router"
WebSearch: "shadcn/ui theme provider dark mode"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Blog with SEO
```
WebSearch: "next.js generateMetadata blog seo"
WebSearch: "next.js generateStaticParams blog"
WebFetch: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
WebFetch: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
```

### Example: Real-time Chat Feature
```
WebSearch: "supabase realtime next.js app router"
WebSearch: "next.js client component supabase subscription"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
# Note: Real-time features use 'use client' components
```
