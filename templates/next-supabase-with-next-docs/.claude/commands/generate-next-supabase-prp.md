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

**Local-first**: The project includes version-accurate Next.js docs in `.next-docs/`. Always read local docs before falling back to online sources. This ensures patterns match the installed Next.js version (16.1.6).

#### 3.1 Next.js Local Docs (READ FIRST)
Read the relevant `.next-docs/` files for the feature being built:

| Topic | Local Path |
|-------|-----------|
| Server & Client Components | `.next-docs/01-app/01-getting-started/05-server-and-client-components.mdx` |
| Fetching Data | `.next-docs/01-app/01-getting-started/07-fetching-data.mdx` |
| Updating Data (Server Actions) | `.next-docs/01-app/01-getting-started/08-updating-data.mdx` |
| Caching & Revalidating | `.next-docs/01-app/01-getting-started/09-caching-and-revalidating.mdx` |
| Metadata & OG Images | `.next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx` |
| Layouts & Pages | `.next-docs/01-app/01-getting-started/03-layouts-and-pages.mdx` |
| Error Handling | `.next-docs/01-app/01-getting-started/10-error-handling.mdx` |
| Route Handlers | `.next-docs/01-app/01-getting-started/15-route-handlers.mdx` |
| Linking & Navigating | `.next-docs/01-app/01-getting-started/04-linking-and-navigating.mdx` |
| CSS & Styling | `.next-docs/01-app/01-getting-started/11-css.mdx` |
| Images | `.next-docs/01-app/01-getting-started/12-images.mdx` |
| Forms | `.next-docs/01-app/02-guides/forms.mdx` |
| Authentication | `.next-docs/01-app/02-guides/authentication.mdx` |
| JSON-LD | `.next-docs/01-app/02-guides/json-ld.mdx` |
| Environment Variables | `.next-docs/01-app/02-guides/environment-variables.mdx` |
| ISR | `.next-docs/01-app/02-guides/incremental-static-regeneration.mdx` |
| Vitest Testing | `.next-docs/01-app/02-guides/testing/vitest.mdx` |
| `'use server'` directive | `.next-docs/01-app/03-api-reference/01-directives/use-server.mdx` |
| `'use client'` directive | `.next-docs/01-app/03-api-reference/01-directives/use-client.mdx` |
| generateMetadata API | `.next-docs/01-app/03-api-reference/04-functions/generate-metadata.mdx` |
| generateStaticParams | `.next-docs/01-app/03-api-reference/04-functions/generate-static-params.mdx` |
| revalidatePath | `.next-docs/01-app/03-api-reference/04-functions/revalidatePath.mdx` |
| File conventions (layout, page, error, loading, etc.) | `.next-docs/01-app/03-api-reference/03-file-conventions/` |

Read **only** the files relevant to the feature. Don't read the entire docs directory.

If `.next-docs/` is missing, run: `npx @next/codemod agents-md --output CLAUDE.md`

#### 3.2 External Docs (for non-Next.js technologies)
**WebSearch** or **WebFetch** for technologies not covered by local docs:

| Technology | Documentation URL |
|------------|-------------------|
| Supabase SSR | https://supabase.com/docs/guides/auth/server-side/nextjs |
| shadcn/ui | https://ui.shadcn.com/docs |
| Tailwind v4 | https://tailwindcss.com/docs |
| React Hook Form | https://react-hook-form.com/docs |
| Zod | https://zod.dev |

#### 3.3 SEO Research (if applicable)
- Read `.next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx` for generateMetadata patterns
- Read `.next-docs/01-app/02-guides/json-ld.mdx` for structured data
- **WebSearch** for: `[feature type] seo meta tags best practices` (for domain-specific SEO guidance)

#### 3.4 Feature-Specific Research
- **WebSearch** for: `[feature] supabase implementation`
- **WebSearch** for: `[feature] best practices` and common gotchas
- Check `.next-docs/01-app/02-guides/` for relevant Next.js guides (authentication, forms, ISR, etc.)

#### 3.5 Document Findings
Populate the PRP's "Research & Documentation" section with:
- Local docs files read (with key patterns extracted)
- External links consulted
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
9. **Include visual design spec** - If INITIAL.md provided, extract visual design section. If string input, infer aesthetic from the description or ask user.
10. **Route integration for every feature (CRITICAL)** - For each feature slice created:
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
Read: .next-docs/01-app/01-getting-started/05-server-and-client-components.mdx
Read: .next-docs/01-app/01-getting-started/07-fetching-data.mdx
Read: .next-docs/01-app/02-guides/authentication.mdx
WebSearch: "supabase user profile server-side next.js"
WebFetch: https://supabase.com/docs/guides/auth/server-side/nextjs
```

### Example: Dark Mode Feature
```
Read: .next-docs/01-app/01-getting-started/11-css.mdx
WebSearch: "tailwind v4 dark mode toggle"
WebSearch: "shadcn/ui theme provider dark mode"
WebFetch: https://ui.shadcn.com/docs/dark-mode
WebFetch: https://tailwindcss.com/docs/dark-mode
```

### Example: Blog with SEO
```
Read: .next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx
Read: .next-docs/01-app/03-api-reference/04-functions/generate-metadata.mdx
Read: .next-docs/01-app/03-api-reference/04-functions/generate-static-params.mdx
Read: .next-docs/01-app/02-guides/json-ld.mdx
Read: .next-docs/01-app/02-guides/incremental-static-regeneration.mdx
WebSearch: "blog seo structured data best practices"
```

### Example: Real-time Chat Feature
```
Read: .next-docs/01-app/01-getting-started/05-server-and-client-components.mdx
Read: .next-docs/01-app/03-api-reference/01-directives/use-client.mdx
WebSearch: "supabase realtime next.js app router"
WebFetch: https://supabase.com/docs/guides/realtime/postgres-changes
# Note: Real-time features use 'use client' components
```
