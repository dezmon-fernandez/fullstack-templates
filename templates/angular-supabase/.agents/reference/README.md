# reference/

Curated context the AI should consult when planning or implementing work. Drop notes here when you hit something non-obvious that future sessions shouldn't have to rediscover.

## What belongs here

- **Architectural decisions** — why we chose X over Y, constraints that forced a shape
- **Stack quirks** — Angular 21 / Supabase / signals / zoneless behaviors that bit us
- **Patterns to preserve** — idioms the codebase leans on that aren't self-evident from any single file
- **Integration notes** — Supabase auth flow, SSR considerations, RLS gotchas
- **Cross-cutting context** — things that span multiple features and aren't documented elsewhere

## What does NOT belong here

- Plans or PRDs (those live in `.agents/plans/` and `.agents/PRD.md`)
- Standards enforced by CLAUDE.md, Biome, or the Angular compiler
- Anything recoverable by reading the code

## Format

Free-form markdown. One file per topic. Name files descriptively (`supabase-auth-guard.md`, `signal-patterns.md`, `environment-config.md`).
