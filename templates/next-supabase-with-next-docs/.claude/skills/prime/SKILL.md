---
description: Prime agent with Next.js + Supabase + Fumadocs codebase understanding
---

# Prime Context for Claude Code

Use the command `tree` to get an understanding of the project structure.

Start with reading the CLAUDE.md file if it exists to get an understanding of the project.

Read the README.md file to get an understanding of the project.

**Read the PRD (project source of truth):**
- `.agents/PRD.md` — product vision, MVP scope, architecture, success criteria, risks. This is
  authoritative for all planning. Loading it here means `/generate-plan` can assume it's in
  context rather than re-reading it every invocation.
- If `.agents/PRD.md` is missing, note it — the user should run `/create-prd` before planning.
- Also skim `.agents/documentation/` (if present) — deliberately-established, non-obvious
  codebase patterns (e.g. `vertical-slice-architecture.md`) that planning and implementation consult.
- This template also bundles version-accurate Next.js docs under `.next-docs/` — note they exist;
  `/generate-plan` consults them per-feature.

Read key files in the src/ directory, especially:
- `src/app/layout.tsx` (root layout)
- `src/lib/supabase/server.ts` (server Supabase client)
- `src/lib/supabase/client.ts` (browser Supabase client)
- `src/middleware.ts` (auth middleware)

> List any additional files that are important to understand the project.

Explain back to me:
- Project structure
- Project purpose and goals
- Key files and their purposes
- Any important dependencies
- Any important configuration files
