# Next.js 16 + Supabase Full-Stack Template

This file provides guidance to Claude Code when working with Next.js App Router + Supabase projects with SSR/SEO capabilities.

## Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Next.js | 16.1.6 |
| **Frontend** | React | 19.2.3 |
| **Language** | TypeScript | 5.x (strict) |
| **Package Manager** | pnpm | 10.x |
| **UI Components** | shadcn/ui | Latest |
| **Styling** | Tailwind CSS | 4.x |
| **Forms** | React Hook Form + Zod | 7.71.x + 4.3.x |
| **Backend** | Supabase | 2.95.x |
| **Linting** | Biome | 2.2.0 |
| **Testing** | Vitest + Testing Library | 4.x + 16.x |

## Architecture: Vertical Slices + App Router

```
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Auth route group (login, signup)
│   ├── (marketing)/      # Public pages (landing, about)
│   ├── (dashboard)/      # Protected pages
│   │   └── layout.tsx    # Auth-protected layout
│   ├── layout.tsx        # Root layout (<html>, <body>)
│   ├── loading.tsx       # Global loading UI
│   ├── error.tsx         # Global error boundary
│   └── not-found.tsx     # Global 404
├── features/             # Self-contained vertical slices
│   └── [feature]/
│       ├── __tests__/
│       ├── components/   # Feature UI (Server + Client Components)
│       ├── actions/      # Server Actions ('use server')
│       ├── schemas/      # Zod validation schemas
│       ├── types/
│       └── index.ts      # Public API
├── lib/                  # Shared utilities
│   ├── supabase/
│   │   ├── server.ts     # Server-side Supabase client
│   │   └── client.ts     # Browser-side Supabase client
│   └── utils.ts
├── components/           # Shared UI (shadcn/ui, layout)
│   └── ui/
└── middleware.ts          # Auth session refresh
```

**Import Rules:**
- Pages (app/) → Features (ONLY from feature's `index.ts` public API)
- Features → Shared (lib/, components/)
- Features → Features
- Shared → Features NEVER
- Server Actions → lib/ for Supabase clients

**Page Responsibility:**
- Pages are THIN - they compose feature exports, not implement logic
- Server Components fetch data via feature actions or Supabase directly
- Client Components use feature components, not inline JSX
- Types imported from features, not defined in pages

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (http://localhost:3000)
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm biome check .    # Lint and format
pnpm tsc --noEmit     # Type check

# Testing
pnpm test             # Run tests (watch)
pnpm test --run       # Run once (CI)

# Supabase
supabase start        # Local Supabase
supabase db reset     # Reset with migrations
supabase gen types typescript --local > src/lib/types/database.types.ts
```

## Next.js Patterns

**Local docs are the source of truth.** Read `.next-docs/` for version-accurate Next.js 16.1.6 patterns. Key files:

| Topic | Local Path |
|-------|-----------|
| Server & Client Components | `.next-docs/01-app/01-getting-started/05-server-and-client-components.mdx` |
| Fetching Data | `.next-docs/01-app/01-getting-started/07-fetching-data.mdx` |
| Updating Data (Server Actions) | `.next-docs/01-app/01-getting-started/08-updating-data.mdx` |
| Metadata & OG Images | `.next-docs/01-app/01-getting-started/14-metadata-and-og-images.mdx` |
| Layouts & Pages | `.next-docs/01-app/01-getting-started/03-layouts-and-pages.mdx` |
| Error Handling | `.next-docs/01-app/01-getting-started/10-error-handling.mdx` |
| Forms | `.next-docs/01-app/02-guides/forms.mdx` |
| Authentication | `.next-docs/01-app/02-guides/authentication.mdx` |
| JSON-LD | `.next-docs/01-app/02-guides/json-ld.mdx` |
| Vitest Testing | `.next-docs/01-app/02-guides/testing/vitest.mdx` |
| File conventions | `.next-docs/01-app/03-api-reference/03-file-conventions/` |
| generateMetadata API | `.next-docs/01-app/03-api-reference/04-functions/generate-metadata.mdx` |
| revalidatePath | `.next-docs/01-app/03-api-reference/04-functions/revalidatePath.mdx` |

If `.next-docs/` is missing, run: `npx @next/codemod agents-md --output CLAUDE.md`

### Data Flow Pattern (CRITICAL)

Server Components fetch data → pass as props → Client Components handle interactivity → Server Actions mutate → `revalidatePath()` refreshes.

### Supabase Client Usage
```typescript
// Server-side (in Server Components, Server Actions, Route Handlers)
import { createClient } from '@/lib/supabase/server'

// Client-side (in Client Components for real-time, auth UI)
import { createClient } from '@/lib/supabase/client'
```

## Code Conventions

- Use `ReactElement` return type, not `JSX.Element`
- No `any` — use `unknown` if type is truly unknown
- Explicit return types for functions
- Use `z.infer<typeof schema>` for types derived from Zod schemas
- Don't manually memoize — React Compiler handles it
- Validate at system boundaries (API responses, form inputs, URL params)

## PRP Workflow

**New App**: Edit `PRPs/INITIAL.md` → `/generate-next-supabase-prp PRPs/INITIAL.md`

**New Feature**: Edit `PRPs/FEATURE.md` → `/generate-next-supabase-prp PRPs/FEATURE.md`

**Quick Feature**: `/generate-next-supabase-prp "add dark mode toggle"`

Then execute: `/execute-next-supabase-prp PRPs/[generated-file].md`

## UX Best Practices
- **Leverage shadcn structure** - Don't rewrite components; customize via props and Tailwind
- **Simple component trees** - Prefer flat, readable structures over deep nesting
- **Make aesthetic choices** - Colors, transitions, and typography should feel intentional, not stock
- **Consistent spacing** - Use Tailwind spacing scale consistently (p-4, gap-4, etc.)
- **Loading states** - Show skeletons for async content, disable buttons during submission
- **Error states** - Display inline errors near the problem, not just toasts
- **Mobile first** - Start with mobile layout, add responsive breakpoints as needed
- **Accessible by default** - Use semantic HTML, proper labels, keyboard navigation

## Code Philosophy

- **Don't over-engineer** - Solve the current problem, not hypothetical future ones
- **No premature abstractions** - Duplicate code is fine until a pattern emerges 3+ times
- **Minimal indirection** - Prefer inline logic over layers of helpers and utilities
- **Delete aggressively** - Remove unused code, don't comment it out "just in case"

## Common Gotchas

### Next.js App Router
For detailed Next.js patterns, read the local docs in `.next-docs/`. Key things to remember:
- **Params are Promises**: In Next.js 16, `params` and `searchParams` are `Promise` types — always `await` them
- **`'use client'` boundary**: Once a file is marked `'use client'`, ALL its imports become client code. Keep the boundary as low as possible

### Supabase
- **Server**: Use `createClient()` from `@/lib/supabase/server` (handles cookies)
- **Client**: Use `createClient()` from `@/lib/supabase/client` for real-time subscriptions
- RLS returns empty array (not error) when blocking
- Run `supabase gen types` after EVERY migration
- Always use `getUser()` not `getSession()` for server-side auth verification

### Environment Variables
- **Client-accessible**: Must be prefixed with `NEXT_PUBLIC_`
- **Server-only**: No prefix needed, only available in Server Components/Actions/Route Handlers
- **Never expose secrets**: Stripe secret keys, API keys without `NEXT_PUBLIC_` prefix

### Testing
- Run tests after each phase, don't batch to the end
- Use `server-only` package to prevent accidental client imports of server code

## Environment Variables

### Client (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Server (.env.local - no prefix)
```
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
OPENAI_API_KEY=
```

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output CLAUDE.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,isolatedDevBuild.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,isolatedDevBuild.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
