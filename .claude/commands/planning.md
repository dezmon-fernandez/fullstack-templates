---
description: Research a tech stack and create a plan for a new template
argument-hint: [stack-description e.g. "Angular 19 + Supabase SSR template"]
---

# Planning: New Tech Stack Template

The primary output is a CLAUDE.md that makes Claude Code effective with this stack, `@`-imported standards docs, and skills. The scaffolded code is just enough to boot.

## Stack Description

$ARGUMENTS

## Determine Template Name

Create a kebab-case name (e.g., `angular-supabase`, `python-agent-langgraph`).

Plan filename: `plans/[template-name].md`
Template directory: `templates/[template-name]/`

## Phase 1: Research

### 1.1 Study Existing Templates

Read 1-2 existing templates in `templates/` to understand conventions — how CLAUDE.md is structured, how skills work, how setup.sh bootstraps, what source files are included.

Also read `skill-templates/` and `doc-templates/` for the base files that get specialized.

### 1.2 Research the Bootstrap Command

If the framework has an official scaffolding CLI (`npx create-next-app`, `npx create-vite`, `ng new`, etc.):

- Find the exact command with recommended flags
- Document what it generates: file structure, configs, dependencies, versions
- Note what it doesn't set up that the template needs (e.g., Supabase, Biome)

If no bootstrap command exists, plan the project structure from community conventions.

### 1.3 Research the Target Stack

Everything `/execute` builds comes from what we learn here.

- **WebFetch** official getting-started guides and project structure docs
- **WebSearch** for best practices, integration patterns, gotchas, version-specific issues
- Pin exact dependency versions
- Capture real code examples for the stack's key patterns

For each technology: what it does, how it's configured, key patterns with examples, gotchas.

### 1.4 Research How the Technologies Wire Together

- Data flow end-to-end
- Auth pattern
- Environment variable conventions
- Build/dev/test toolchain

## Phase 2: Design the Template

### 2.1 Architecture

Design a file structure adapted to this stack. Not every stack has the same shape — a web app has routes/components/hooks, an agent has tools/prompts/pipelines. Adapt to what the stack actually needs.

### 2.2 CLAUDE.md

This is the most important file. Read an existing template's CLAUDE.md (e.g., `templates/next-supabase/CLAUDE.md`) for the level of detail expected.

Based on the research, determine which sections CLAUDE.md needs for this stack. Every stack needs at minimum:

- **Technology Stack** — table with pinned versions
- **Architecture** — file structure, import/module rules
- **Development Commands** — exact commands that match the config files
- **Key Patterns** — real, compilable code blocks showing how this stack works
- **Common Gotchas** — from research, each worth 30+ min of debugging time
- **Environment Variables** — which vars, which prefixes, which file

Beyond that, add sections that the research shows are necessary for this stack. A web app might need routing patterns, server vs client component rules, SEO metadata. An agent might need tool registration, prompt patterns, memory management. **The research determines the sections, not a fixed template.**

CLAUDE.md is composed from two sources:
1. **Stack-specific content** written directly (tech table, patterns, gotchas, commands)
2. **`@` imports** of specialized doc-templates that become sections of the global rules (see 2.4)

```markdown
@docs/vertical-slice-architecture.md
@docs/logging.md
@docs/security.md
```

The doc-templates ARE the global rules file — each `@` import inlines a focused section into CLAUDE.md at load time.

### 2.3 Skills

Plan 3 skills by specializing from `skill-templates/`:

- **prime** — which key files to read for this stack
- **generate-plan** — framework-specific validation, route/page integration, output format
- **execute-plan** — per-phase testing commands, validation steps

### 2.4 Doc-Templates (Interactive)

`doc-templates/` contains focused rule sets that compose CLAUDE.md via `@` imports. Each one becomes a section of the global rules file when specialized for the stack. **Ask the user** which apply:

- `vertical-slice-architecture.md` — decision framework, core/shared/feature rules, three-feature rule, cross-feature patterns
- `coding-standards.md` — naming, type system rules, function design, imports
- `logging.md` — structured event logging with dotted namespace pattern
- `error-handling.md` — error categories, typed errors, boundary handling
- `observability.md` — health checks, metrics, correlation IDs
- `testing.md` — what to test, colocated vs integration, patterns, mocking
- `security.md` — input validation, auth, RLS, secrets management
- `api-design.md` — response shapes, mutation patterns, pagination

Some stacks may need framework-specific doc-templates not in this list (e.g., Next.js server/client component rules, Angular module patterns). Create those during execution if needed.

For each selected doc, capture the stack-specific decisions for the `[STACK-SPECIFIC]` sections. These get specialized into `docs/` in the template and `@`-imported by CLAUDE.md.

### 2.5 File Manifest

List every file with exact path, what it does, and which existing file to adapt from (if any).

### 2.6 Dependencies

All packages/tools with pinned versions, split into runtime and dev.

## Phase 3: Write the Plan

Save as `plans/[template-name].md`. Each task needs:

- **File**: Exact path
- **Action**: What to create
- **Details**: Specific enough to implement without ambiguity
- **Reference**: Existing template file to adapt from (if any)

Include validation steps and note that root `README.md` needs updating.

## Confirmation

- Plan saved to `plans/[template-name].md`
- Research documented with real code examples
- All files listed with exact paths
- Dependencies pinned
- CLAUDE.md sections determined by research, not a fixed checklist
- `/execute` can build this without further research

**Next step**: `/execute plans/[template-name].md`
