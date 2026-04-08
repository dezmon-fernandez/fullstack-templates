# Plan: angular-supabase Template

## Overview

Angular 21 + Supabase full-stack template. Standalone components, signals-first reactivity, zoneless change detection (Angular 21 default), Vitest, Tailwind CSS v4, Biome for TS/JS linting. No component library — plain Tailwind.

**Template directory**: `templates/angular-supabase/`

## Research Summary

### Angular 21 Key Facts

- **Zoneless by default** — no Zone.js, no `provideZonelessChangeDetection()` needed in new apps
- **Standalone by default** — no NgModules, `--standalone true` is the CLI default
- **Vitest default** — replaces Karma, CLI manages config via `angular.json`
- **Signals stable** — `signal()`, `computed()`, `effect()`, `linkedSignal()`, `input()`, `output()`, `resource()`
- **httpResource** — reactive data fetching with signals, wraps HttpClient, auto-refetches on signal changes
- **HttpClient built-in** — provided at root by default, `provideHttpClient()` only needed for interceptors
- **Vite/esbuild** — default build toolchain
- **`@if`/`@for`/`@switch`** — stable control flow syntax replacing `*ngIf`/`*ngFor`

### Bootstrap Command

```bash
npx @angular/cli new angular-supabase \
  --style=css \
  --routing \
  --ssr=false \
  --package-manager=pnpm \
  --strict
```

Generates: standalone app, Vitest, zoneless, Vite builder, routing, strict TypeScript. We then layer on Supabase and Tailwind.

### Supabase Integration

- `@supabase/supabase-js` — client library
- Environment variables in `src/environments/environment.ts` and `environment.development.ts`
- Angular convention: no `.env` files, use `environment.ts` + `.env.local` for secrets at build time
- SupabaseService wraps client creation, exposes typed methods
- Auth via `supabase.auth` — email/password, magic link, OAuth

### Tailwind v4 Setup

```bash
ng add tailwindcss
```

Or manually: install `tailwindcss @tailwindcss/postcss postcss`, create `.postcssrc.json`, add `@import 'tailwindcss'` to `src/styles.css`. No `tailwind.config.js` — use `@theme` in CSS.

### Biome

Biome does NOT lint Angular templates (HTML). Use Biome for TS/JS linting + formatting only. Angular template linting is handled by the Angular compiler's strict checks.

### Testing

- Vitest is the default runner — `ng test` runs it
- `@testing-library/angular` for component testing
- TestBed for DI setup
- `ng test --no-watch --no-progress` for CI

## Architecture

```
src/
├── app/
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # Application config (providers)
│   ├── app.routes.ts          # Route definitions
│   ├── features/              # Self-contained vertical slices
│   │   └── [feature]/
│   │       ├── components/    # Feature components
│   │       ├── services/      # Feature services (data, business logic)
│   │       ├── models/        # Types and interfaces
│   │       ├── guards/        # Route guards
│   │       └── [feature].routes.ts  # Lazy-loaded child routes
│   ├── shared/                # Shared utilities (NO business logic)
│   │   ├── components/        # Reusable UI components
│   │   ├── services/          # Cross-cutting services (supabase, auth)
│   │   ├── guards/            # Shared route guards
│   │   └── utils/
│   └── layouts/               # Layout components (shell, auth layout)
├── environments/
│   ├── environment.ts         # Production defaults
│   └── environment.development.ts  # Dev overrides
└── styles.css                 # Global styles + Tailwind import
```

**Import Rules:**
- Routes → Features (lazy-load feature routes)
- Features → Shared
- Features → Features (via shared services or explicit imports)
- Shared → Features NEVER

## Dependencies

### Runtime
| Package | Version |
|---------|---------|
| `@angular/core` | ^21.0 |
| `@angular/common` | ^21.0 |
| `@angular/router` | ^21.0 |
| `@angular/forms` | ^21.0 |
| `@angular/platform-browser` | ^21.0 |
| `@supabase/supabase-js` | ^2.97 |
| `zod` | ^3.24 |

### Dev
| Package | Version |
|---------|---------|
| `@angular/cli` | ^21.0 |
| `@angular/compiler-cli` | ^21.0 |
| `typescript` | ~5.8 |
| `tailwindcss` | ^4.0 |
| `@tailwindcss/postcss` | ^4.0 |
| `postcss` | ^8.5 |
| `@biomejs/biome` | ^2.0 |
| `@testing-library/angular` | ^17.0 |
| `@testing-library/user-event` | ^14.0 |

Note: Vitest, jsdom, and the Angular build toolchain (esbuild/vite) are included automatically by `ng new`.

## File Manifest

### Configuration Files

| # | File | Action | Reference |
|---|------|--------|-----------|
| 1 | `templates/angular-supabase/README.md` | Create | `templates/react-spa-supabase/README.md` |
| 2 | `templates/angular-supabase/CLAUDE.md` | Create | `templates/next-supabase/CLAUDE.md` (structure) |
| 3 | `templates/angular-supabase/.gitignore` | Create | Angular CLI default + Supabase additions |
| 4 | `templates/angular-supabase/.env.example` | Create | `templates/react-spa-supabase/.env.example` |
| 5 | `templates/angular-supabase/biome.json` | Create | `templates/react-spa-supabase/biome.json` |
| 6 | `templates/angular-supabase/.postcssrc.json` | Create | New (Tailwind v4 PostCSS config) |
| 7 | `templates/angular-supabase/tsconfig.json` | Create | Angular CLI default |
| 8 | `templates/angular-supabase/tsconfig.app.json` | Create | Angular CLI default |
| 9 | `templates/angular-supabase/package.json` | Create | Angular deps + Supabase + Biome + testing-library |
| 10 | `templates/angular-supabase/angular.json` | Create | Angular CLI default with Biome integration |

### Skills

| # | File | Action | Reference |
|---|------|--------|-----------|
| 11 | `templates/angular-supabase/.claude/skills/prime/SKILL.md` | Create | `skill-templates/prime.md` |
| 12 | `templates/angular-supabase/.claude/skills/generate-plan/SKILL.md` | Create | `skill-templates/generate-plan.md` |
| 13 | `templates/angular-supabase/.claude/skills/execute-plan/SKILL.md` | Create | `skill-templates/execute-plan.md` |
| 14 | `templates/angular-supabase/.claude/settings.json` | Create | `templates/react-spa-supabase/.claude/settings.json` |

### Planning

| # | File | Action | Reference |
|---|------|--------|-----------|
| 15 | `templates/angular-supabase/planning/INITIAL.md` | Create | `templates/react-spa-supabase/planning/INITIAL.md` |
| 16 | `templates/angular-supabase/planning/FEATURE.md` | Create | `templates/react-spa-supabase/planning/FEATURE.md` |

### Setup

| # | File | Action | Reference |
|---|------|--------|-----------|
| 17 | `templates/angular-supabase/scripts/setup.sh` | Create | `templates/react-spa-supabase/scripts/setup.sh` |
| 18 | `templates/angular-supabase/supabase/config.example.toml` | Create | `templates/react-spa-supabase/supabase/config.example.toml` |

### Source Files

| # | File | Action | Reference |
|---|------|--------|-----------|
| 19 | `templates/angular-supabase/src/main.ts` | Create | Angular bootstrap |
| 20 | `templates/angular-supabase/src/styles.css` | Create | Tailwind import |
| 21 | `templates/angular-supabase/src/index.html` | Create | Angular shell HTML |
| 22 | `templates/angular-supabase/src/app/app.component.ts` | Create | Root component |
| 23 | `templates/angular-supabase/src/app/app.config.ts` | Create | Application config |
| 24 | `templates/angular-supabase/src/app/app.routes.ts` | Create | Route definitions |
| 25 | `templates/angular-supabase/src/app/shared/services/supabase.service.ts` | Create | Supabase client wrapper |
| 26 | `templates/angular-supabase/src/app/shared/guards/auth.guard.ts` | Create | Route guard using Supabase auth |
| 27 | `templates/angular-supabase/src/environments/environment.ts` | Create | Prod env vars |
| 28 | `templates/angular-supabase/src/environments/environment.development.ts` | Create | Dev env vars |

## Step-by-Step Tasks

### Task 1: Create package.json

**File**: `templates/angular-supabase/package.json`
**Action**: Create Angular project package.json with all dependencies pinned.

**Details**:
- Angular 21 core packages (`@angular/core`, `@angular/common`, `@angular/router`, `@angular/forms`, `@angular/platform-browser`, `@angular/compiler`, `@angular/animations`)
- Dev: `@angular/cli`, `@angular/compiler-cli`, `@angular/build`, `typescript`
- Runtime: `@supabase/supabase-js`, `zod`
- Dev: `@biomejs/biome`, `tailwindcss`, `@tailwindcss/postcss`, `postcss`, `@testing-library/angular`, `@testing-library/user-event`
- Scripts: `ng serve` → `dev`, `ng build` → `build`, `ng test` → `test`, `biome check .` → `lint`
- `pnpm setup` script alias pointing to `scripts/setup.sh`

### Task 2: Create angular.json

**File**: `templates/angular-supabase/angular.json`
**Action**: Angular workspace config.

**Details**:
- Project name: `angular-supabase`
- Builder: `@angular/build:application` (Vite/esbuild)
- Styles: `src/styles.css`
- File replacements for environments
- Output path: `dist/angular-supabase`
- Test builder: `@angular/build:unit-test`

### Task 3: Create TypeScript configs

**Files**: `tsconfig.json`, `tsconfig.app.json`

**Details**:
- `tsconfig.json`: Angular 21 defaults — `strict: true`, `target: ES2022`, `module: ES2022`, `moduleResolution: bundler`
- `tsconfig.app.json`: extends base, includes `src/**/*.ts`
- Path alias: `@app/*` → `src/app/*`

### Task 4: Create Biome config

**File**: `templates/angular-supabase/biome.json`
**Reference**: `templates/react-spa-supabase/biome.json`

**Details**:
- Formatter and linter enabled
- Ignore `dist/`, `node_modules/`, `.angular/`
- No Angular template linting (Biome doesn't support it)

### Task 5: Create PostCSS config

**File**: `templates/angular-supabase/.postcssrc.json`

**Details**:
```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### Task 6: Create source files

**Files**: `src/main.ts`, `src/index.html`, `src/styles.css`

**Details**:

`main.ts`:
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

`index.html`: Standard Angular shell with `<app-root>`.

`styles.css`:
```css
@import 'tailwindcss';
```

### Task 7: Create app config and routing

**Files**: `src/app/app.config.ts`, `src/app/app.routes.ts`, `src/app/app.component.ts`

**Details**:

`app.config.ts`:
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

`app.routes.ts`: Single home route, placeholder for feature lazy routes.

`app.component.ts`: Minimal standalone component with `<router-outlet>`.

### Task 8: Create Supabase service

**File**: `src/app/shared/services/supabase.service.ts`

**Details**:
- Injectable at root
- Uses `inject()` — no constructor injection
- Creates Supabase client from environment variables
- Exposes `client` getter and `authChanges()` observable
- Uses `signal()` for current session state

### Task 9: Create auth guard

**File**: `src/app/shared/guards/auth.guard.ts`

**Details**:
- Functional guard using `inject()`
- Checks `supabase.auth.getUser()` (not `getSession()`)
- Redirects to login route if unauthenticated

### Task 10: Create environment files

**Files**: `src/environments/environment.ts`, `src/environments/environment.development.ts`

**Details**:
```typescript
export const environment = {
  production: true, // false for development
  supabaseUrl: '', // Populated by setup.sh into .env.local, read at build time
  supabaseKey: '',
};
```

Note: Angular doesn't have native `.env` support. The setup.sh writes a `.env.local` that gets loaded via a custom `set-env.ts` script OR we use the `NG_APP_` prefix pattern. For simplicity, the template will use `environment.development.ts` with placeholders that `setup.sh` populates directly.

### Task 11: Create setup script

**File**: `templates/angular-supabase/scripts/setup.sh`
**Reference**: `templates/react-spa-supabase/scripts/setup.sh`

**Details**:
- `pnpm install`
- `supabase start`
- Extract Supabase credentials from `supabase status -o env`
- Write `src/environments/environment.development.ts` with actual values

### Task 12: Create .gitignore

**File**: `templates/angular-supabase/.gitignore`

**Details**: Angular defaults (`.angular/`, `dist/`, `node_modules/`) + Supabase (`.env.local`, `supabase/.temp/`)

### Task 13: Create .env.example

**File**: `templates/angular-supabase/.env.example`

**Details**: Document the environment variables even though Angular uses `environment.ts`:
```
# These values are written to src/environments/environment.development.ts by setup.sh
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-anon-key
```

### Task 14: Create Supabase config

**File**: `templates/angular-supabase/supabase/config.example.toml`
**Reference**: `templates/react-spa-supabase/supabase/config.example.toml`

### Task 15: Create CLAUDE.md

**File**: `templates/angular-supabase/CLAUDE.md`
**Reference**: `templates/next-supabase/CLAUDE.md` (structure and depth)

**Sections** (all inline, no @imports):

1. **Technology Stack** — table with pinned versions (Angular 21, TypeScript 5.8, Tailwind v4, Vitest, Biome, Supabase, Zod)
2. **Architecture: Vertical Slices** — file tree, import rules, page responsibility
3. **Development Commands** — `pnpm dev`, `pnpm build`, `pnpm test`, `pnpm lint`, `ng test`, Supabase commands
4. **Angular Patterns**:
   - Standalone components (default, no NgModules)
   - Signals (`signal()`, `computed()`, `linkedSignal()`, `input()`, `output()`)
   - `httpResource` for reactive data fetching with code example
   - Dependency injection with `inject()` (not constructor injection)
   - Control flow (`@if`, `@for`, `@switch`) with code examples
   - Reactive forms with Zod validation
   - Route guards (functional)
   - Lazy loading features with `loadChildren`
5. **Supabase Patterns** — service usage, auth with `getUser()` not `getSession()`, RLS gotchas
6. **Code Patterns** — TypeScript strict, no `any`, Zod at boundaries, `inject()` over constructor
7. **Testing** — per-phase testing table, TestBed patterns, testing-library usage
8. **Common Gotchas**:
   - Zoneless: must use signals/OnPush, no Zone.js monkey-patching
   - `httpResource` is for reads only, use `HttpClient` for mutations
   - Signals: `.set()` / `.update()` — don't mutate signal values directly
   - Biome: doesn't lint Angular templates, rely on compiler strict checks
   - Supabase RLS returns empty array, not error
   - Environment variables: `environment.ts` not `.env`
   - Tailwind v4: no config file, use `@theme` in CSS
9. **Planning Workflow** — same as other templates
10. **UX Best Practices** — same as other templates
11. **Code Philosophy** — same as other templates
12. **Environment Variables** — table of vars and where they go

### Task 16: Create README.md

**File**: `templates/angular-supabase/README.md`

**Details**: Setup instructions, prerequisites, development workflow. Adapt from `templates/react-spa-supabase/README.md`.

### Task 17: Create skills

**Files**:
- `.claude/skills/prime/SKILL.md` — specialize for Angular key files (app.config.ts, app.routes.ts, supabase.service.ts, CLAUDE.md)
- `.claude/skills/generate-plan/SKILL.md` — Angular-specific validation (`ng test`, `ng build`, `biome check`)
- `.claude/skills/execute-plan/SKILL.md` — per-phase testing with `ng test`, build validation with `ng build`

**Reference**: `skill-templates/` for base, `templates/react-spa-supabase/.claude/skills/` for specialization examples

### Task 18: Create planning templates

**Files**: `planning/INITIAL.md`, `planning/FEATURE.md`
**Reference**: `templates/react-spa-supabase/planning/`

### Task 19: Create .claude/settings.json

**File**: `templates/angular-supabase/.claude/settings.json`
**Reference**: `templates/react-spa-supabase/.claude/settings.json`

**Details**: Allow Bash commands for `ng`, `pnpm`, `biome`, `supabase`.

### Task 20: Update root README.md

**File**: `README.md` (root)

**Details**: Add `angular-supabase` entry to Available Templates section:

```markdown
### angular-supabase
Angular 21 with Supabase backend. Standalone components, signals-first, zoneless.

**Stack:** Angular 21, TypeScript 5.8, Tailwind CSS v4, Vitest, Supabase, Biome

**Best for:** Enterprise apps, form-heavy applications, teams familiar with Angular.
```

Also update the "What's in a Template" section if needed (no shadcn/ui assumption).

## Validation Steps

```bash
# Verify all expected files exist
find templates/angular-supabase -type f | sort

# Verify quickstart discovers it
python quickstart.py --list

# Verify it copies cleanly
python quickstart.py angular-supabase /tmp/test-angular-template
ls /tmp/test-angular-template/
rm -rf /tmp/test-angular-template
```

## Notes

- **No component library** — plain Tailwind CSS v4 utility classes. shadcn/ui is React-only.
- **No SSR** — `--ssr=false`. Angular SSR adds complexity; this template targets SPAs with Supabase as the backend. SSR can be added later.
- **Biome limitations** — Biome lints TS/JS only, not Angular HTML templates. The Angular compiler's strict mode catches template errors.
- **Environment variables** — Angular uses `environment.ts` files, not `.env`. The setup script writes development values directly to `environment.development.ts`.
