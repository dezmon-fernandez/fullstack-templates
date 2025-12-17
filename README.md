# [Project Name]

> Built with the React 19 + Supabase MVP Template

## Setup

### 1. Supabase Credentials

Make sure `.env.local` has your Supabase credentials:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

If using local Supabase:
```bash
supabase start
# Use credentials from terminal output
```

Link to your remote Supabase project:
```bash
supabase link --project-ref your-project-ref
```

### 2. Describe Your App

Edit `PRPs/INITIAL.md` with your app requirements.

### 3. Generate & Build

```bash
/generate-react-supabase-prp PRPs/INITIAL.md
/execute-react-supabase-prp PRPs/[your-app].md
```

The AI scaffolds everything and builds your app.

### 4. Run

```bash
pnpm dev
```

## Adding Features

```bash
# Option 1: Edit PRPs/FEATURE.md first
/generate-react-supabase-prp PRPs/FEATURE.md

# Option 2: Inline
/generate-react-supabase-prp "add user profile with avatar"

# Then execute
/execute-react-supabase-prp PRPs/[feature].md
```

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
