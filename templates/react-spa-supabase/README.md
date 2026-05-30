# [Project Name]

> Built with the React 19 + Supabase MVP Template

## Setup

1. **Run setup** (installs deps, starts Supabase, writes `.env.local`)
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
pnpm dev              # Dev server
pnpm build            # Production build
pnpm test             # Run tests
pnpm biome check .    # Lint
pnpm tsc --noEmit     # Type check

supabase start        # Local Supabase
supabase db reset     # Reset database
supabase gen types typescript --local > src/shared/types/database.types.ts
```

## Project Structure

```
src/
├── routes/           # TanStack Router
├── features/         # Vertical slices
│   └── [feature]/
│       ├── __tests__/
│       ├── components/
│       ├── hooks/
│       └── index.ts
└── shared/           # UI, utils
```

## Docs

- [Supabase](https://supabase.com/docs)
- [TanStack](https://tanstack.com)
- [shadcn/ui](https://ui.shadcn.com)
