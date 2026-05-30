---
description: Prime agent with React SPA + Supabase codebase understanding
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

Read key files in the src/ directory

> List any additional files that are important to understand the project.

Explain back to me:
- Project structure
- Project purpose and goals
- Key files and their purposes
- Any important dependencies
- Any important configuration files