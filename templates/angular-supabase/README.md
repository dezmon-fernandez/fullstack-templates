# [Project Name]

> Built with the Angular 21 + Supabase Template

## Setup

1. **Run setup** (installs deps, starts Supabase, writes environment config)
   ```bash
   pnpm setup
   ```

2. **Define your app** in `.agents/plans/INITIAL.md`

3. **Generate and execute**
   ```bash
   /generate-plan .agents/plans/INITIAL.md
   /execute-plan .agents/plans/[your-app].md
   ```

4. **Run**
   ```bash
   pnpm dev
   ```

## Adding Features

```bash
# Option 1: Edit .agents/plans/FEATURE.md first
/generate-plan .agents/plans/FEATURE.md

# Option 2: Inline
/generate-plan "add user profile with avatar"

# Then execute
/execute-plan .agents/plans/[feature].md
```

## Commands

```bash
pnpm dev              # Dev server (http://localhost:4200)
pnpm build            # Production build
pnpm test             # Run tests (watch)
pnpm test:run         # Run tests once (CI)
pnpm lint             # Biome check
pnpm format           # Biome format

supabase start        # Local Supabase
supabase db reset     # Reset database
supabase gen types typescript --local > src/app/shared/types/database.types.ts
```

## Project Structure

```
src/
├── app/
│   ├── app.component.ts       # Root component
│   ├── app.config.ts          # Providers
│   ├── app.routes.ts          # Route definitions
│   ├── features/              # Vertical slices
│   │   └── [feature]/
│   │       ├── components/
│   │       ├── services/
│   │       └── models/
│   └── shared/                # Cross-cutting services, guards
├── environments/              # Compile-time config
└── styles.css                 # Tailwind entry
```

## Docs

- [Angular](https://angular.dev)
- [Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
