---
description: Execute an Angular + Supabase implementation plan phase by phase
---

# Execute Angular + Supabase Plan

Implement a plan phase by phase with validation.

## Input: $ARGUMENTS

Path to plan file (e.g., `.agents/plans/my-feature.md`)

## Process

1. **Load Plan** — Read completely, understand all phases

2. **Phase Execution**
   - Announce phase and files to create
   - Implement following vertical slice architecture
   - Use standalone components, signals, `inject()`
   - Validate phase completion

3. **Per-Phase Testing (CRITICAL)**

   | Phase | Run Tests? | Command |
   |-------|------------|---------|
   | Services | **YES** | `ng test --no-watch --include='**/services/**'` |
   | Components | **YES** | `ng test --no-watch --include='**/components/**'` |
   | Guards | **YES** | `ng test --no-watch --include='**/guards/**'` |
   | Routes | Verify | `pnpm build` |

   **Do NOT proceed if tests fail.**

4. **Final Validation**
   ```bash
   pnpm build
   pnpm lint
   pnpm test:run
   ```

## Architecture

```
src/
├── app/
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # Providers
│   ├── app.routes.ts          # Lazy-loaded route definitions
│   ├── features/[name]/
│   │   ├── components/
│   │   ├── services/
│   │   ├── models/
│   │   ├── guards/
│   │   └── [name].routes.ts
│   └── shared/
│       ├── services/          # SupabaseService, etc.
│       ├── guards/            # authGuard
│       └── utils/
├── environments/
└── styles.css
```

**Import Rules:**
- Routes lazy-load from `features/[name]`
- Features import from `@app/shared/*`
- Shared NEVER imports from features

## Angular Conventions

- All components are `standalone: true`
- Use `signal()`, `computed()`, `input()`, `output()` for state
- Use `inject()` for DI, not constructor injection
- Use `@if`, `@for`, `@switch` control flow
- Use `httpResource` for reactive GET, `HttpClient` for mutations
- Use Zod for validation at boundaries
