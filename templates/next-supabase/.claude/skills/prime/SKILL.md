---
description: Prime agent with Next.js + Supabase codebase understanding
---

# Prime Context for Claude Code

Use the command `tree` to get an understanding of the project structure.

Start with reading the CLAUDE.md file if it exists to get an understanding of the project.

Read the README.md file to get an understanding of the project.

**Read the PRD (project source of truth):**
- `.agents/PRD.md` — product vision, MVP scope, architecture, success criteria, risks. This is
  authoritative for all planning.
- If `.agents/PRD.md` is missing, note it — the user should run `/create-prd` before planning.
- Also skim `.agents/documentation/` (if present) — deliberately-established, non-obvious
  codebase patterns (e.g. `vertical-slice-architecture.md`) that planning and implementation consult.

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
