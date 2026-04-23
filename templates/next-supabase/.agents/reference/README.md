# reference/

Curated context the AI should consult when planning or implementing work. Drop notes here when you hit something non-obvious that future sessions shouldn't have to rediscover.

## What belongs here

- **Architectural decisions** — why we chose X over Y, constraints that forced a shape
- **Stack quirks** — Next.js / Supabase / shadcn behaviors that bit us
- **Patterns to preserve** — idioms the codebase leans on that aren't self-evident from any single file
- **Integration notes** — how external services are wired, auth flows, edge cases
- **Cross-cutting context** — things that span multiple features and aren't documented elsewhere

## What does NOT belong here

- Plans or PRDs (those live in `.agents/plans/` and `.agents/PRD.md`)
- Standards enforced by CLAUDE.md or lint config
- Anything recoverable by reading the code

## Format

Free-form markdown. One file per topic. Name files descriptively (`supabase-ssr-cookies.md`, `server-action-patterns.md`, `auth-flow.md`).
