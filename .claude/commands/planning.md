---
description: Research a tech stack and create a plan for a new template
argument-hint: [stack-description e.g. "Angular 19 + Supabase SSR template"]
---

# Planning: New Tech Stack Template

## Stack Description

$ARGUMENTS

## Determine Template Name

Create a kebab-case name that describes the stack (e.g., `angular-supabase`, `python-agent-langgraph`, `react-spa-supabase`).

**Template Name**: [create-template-name]

Plan filename: `plans/[template-name].md`
Template directory: `templates/[template-name]/`

## Phase 1: Research

### 1.1 Study Existing Templates

Read 1-2 existing templates in `templates/` to understand conventions:
- How CLAUDE.md / AGENTS.md is structured and what it covers
- How `.claude/skills/` are organized (generate-plan/execute-plan pattern)
- How the planning system works (INITIAL.md, FEATURE.md, output format in SKILL.md)
- How `scripts/setup.sh` bootstraps the project
- How `.claude/settings.json` scopes permissions
- What source files are included (minimal bootable app, not a full app)

Also read `skill-templates/` for the base skill files that get specialized per template.

### 1.2 Research the Target Stack

This is the most important part of the entire workflow. Everything `/execute` builds comes from what we learn here.

- **WebFetch** the framework/tool's official getting-started guide and project structure docs
- **WebSearch** for recommended project structure, best practices, and conventions
- **WebSearch** for integration patterns between the key technologies in the stack
- **WebSearch** for common gotchas, pitfalls, and version-specific issues
- Pin exact dependency versions — don't use `latest`
- Capture real code examples for the stack's key patterns

For each technology, document:
- What it does and why it's in the stack
- How it's configured
- Key code patterns with examples
- Gotchas and things that trip people up
- Links to docs consulted

### 1.3 Research How the Technologies Wire Together

The real value is in how the pieces connect. Research and document:
- Data flow end-to-end (how does data get from backend to UI and back?)
- Auth pattern (middleware, guards, layout wrappers — whatever fits the stack)
- Environment variable conventions (prefixes for client-side access, secrets handling)
- How the build/dev/test toolchain works together

## Phase 2: Design the Template

Based on research, make decisions and document them in the plan.

### 2.1 Architecture

Design a vertical slice file structure adapted to this stack:
- What does the routing layer look like?
- Where do features live and what's inside each slice?
- Where do shared utilities go?
- What are the import rules?

Not every stack will have the same slices. A web app has routes, components, hooks. An agent might have tools, prompts, pipelines. Adapt to what the stack actually needs.

### 2.2 File Manifest

List every file the template needs, grouped logically:

- **Config** — whatever makes it build and run (package.json, tsconfig, build config, linter config, .gitignore, .env.example)
- **Source** — minimal bootable app (entry point, root layout/component, one working route/page/command, wiring between key technologies)
- **AI System** — CLAUDE.md, `.claude/skills/` (prime, generate-plan, execute-plan), `.claude/settings.json`
- **Planning** — planning/INITIAL.md, planning/FEATURE.md, output format inlined in generate-plan SKILL.md
- **Setup** — scripts/setup.sh, README.md with setup instructions

For each file, note:
- Exact path relative to `templates/[template-name]/`
- What it does
- Which existing template file to use as a starting point (if any)

### 2.3 CLAUDE.md Content

This is the most important file in the template — it's what makes Claude Code effective with this stack. Outline what it needs to cover:

- Technology stack table with versions
- Architecture diagram (the vertical slice structure from 2.1)
- Development commands (dev, build, test, lint, type-check)
- Key code patterns with real examples from research (not pseudocode)
- Data flow pattern
- Common gotchas (from research)
- Environment variable reference
- Planning workflow (how to use generate/execute commands)
- Code philosophy and UX best practices

Use existing CLAUDE.md / AGENTS.md files as structural references but write content for the target stack.

### 2.4 Commands

Plan the 3 template-level skills by specializing from `skill-templates/`:

- **prime** — which key files should it read for this stack?
- **generate-plan** — what research URLs, what framework-specific validation, what does route/page integration look like? Include the output format (plan skeleton) inline in the SKILL.md.
- **execute-plan** — what are the per-phase testing commands, what does the architecture section contain, what are the validation steps?

### 2.5 Dependencies

List all packages/tools with pinned versions, split into runtime and dev dependencies.

## Phase 3: Write the Plan

Save as `plans/[template-name].md` with step-by-step tasks organized into phases that `/execute` can follow sequentially. Each task needs:

- **File**: Exact path
- **Action**: What to create
- **Details**: Specific enough to implement without ambiguity
- **Reference**: Existing template file to adapt from (if any)

Include a validation section at the end:
- Does it copy cleanly via `quickstart.py`?
- Does setup run?
- Does it build and start?
- Do linting/types pass?
- Is CLAUDE.md complete and accurate?

Also note that root `README.md` needs updating with the new template.

## Confirmation

After creating the plan, confirm:
- ✅ Plan saved to `plans/[template-name].md`
- ✅ Research findings documented with real code examples
- ✅ All files listed with exact paths
- ✅ Dependencies pinned to versions
- ✅ CLAUDE.md content outlined with stack-specific patterns
- ✅ `/execute` can build this without further research

**Next step**: Run `/execute plans/[template-name].md`
