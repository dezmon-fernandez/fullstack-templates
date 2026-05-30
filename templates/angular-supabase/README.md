# [Project Name]

> Built with the Angular 21 + Supabase Template

## Setup

1. **Run setup** (installs deps, starts Supabase, writes environment config)
   ```bash
   pnpm setup
   ```

2. **Create the PRD** (project source of truth)
   ```bash
   /create-prd
   ```
   Generates `.agents/PRD.md` from your conversation context. The PRD is the authoritative spec; subsequent `/generate-plan` runs read it as the source of truth.

3. **Generate and execute the first feature**
   ```bash
   /generate-plan "<feature description>"
   /execute-plan .agents/plans/<feature>.md
   ```
   Plans land in `.agents/plans/<feature>.md`. Each feature gets its own plan, aligned to the PRD.

4. **Run**
   ```bash
   pnpm dev
   ```

## Adding More Features

```bash
/generate-plan "add user profile with avatar"
/execute-plan .agents/plans/<feature>.md
```

Plans align with the PRD. If a feature warrants PRD updates (new MVP scope, architecture decisions), update `.agents/PRD.md` first, then plan.

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
