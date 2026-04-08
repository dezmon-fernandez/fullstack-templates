# Fullstack Templates

A collection of AI-powered templates for rapid MVP development with Claude Code.

## Quick Start

```bash
# List available templates
python quickstart.py --list

# Copy a template to start a new project
python quickstart.py next-supabase ./my-new-app

# With git initialization
python quickstart.py next-supabase ./my-new-app --with-git
```

Then inside your new project:

```bash
pnpm setup                                        # Install deps, start Supabase, write .env.local
# Edit planning/INITIAL.md with your app requirements
/generate-plan planning/INITIAL.md                  # Generate implementation plan
/execute-plan planning/[generated].md               # Build it
pnpm dev                                           # Start dev server
```

## Available Templates

### next-supabase
Server-rendered React with Next.js App Router and Supabase. Verbose CLAUDE.md with inline code examples.

**Stack:** Next.js 16, React 19, App Router, Server Components, Supabase, shadcn/ui, Tailwind v4

**Best for:** Public-facing apps, e-commerce, content sites, SEO-critical applications.

### next-supabase-with-next-docs
Same as `next-supabase` but with local `.next-docs/` directory for version-accurate Next.js documentation. Slimmed CLAUDE.md that defers to local docs.

**Stack:** Next.js 16, React 19, App Router, Server Components, Supabase, shadcn/ui, Tailwind v4

**Best for:** Same use cases as above, with local-first documentation for more accurate AI-assisted development.

### react-spa-supabase
Client-rendered React 19 SPA with Supabase backend.

**Stack:** React 19, Vite, TanStack Router/Query, Supabase, shadcn/ui, Tailwind v4

**Best for:** Dashboards, admin panels, internal tools, apps where SEO doesn't matter.

### tanstack-start-supabase
Server-rendered React with TanStack Start and Supabase.

**Stack:** React 19, TanStack Start, TanStack Router/Query, Supabase, shadcn/ui, Tailwind v4

**Best for:** Public-facing apps, landing pages, content sites, SEO-critical applications.

## What's in a Template

- **CLAUDE.md** — Stack patterns, architecture, gotchas, with `@` imports for standards docs
- **Standards Docs** (`docs/`) — Logging, security, testing, etc. — selected per stack
- **Skills** (`.claude/skills/`) — `/generate-plan`, `/execute-plan`, `/prime`
- **Planning** (`planning/`) — Requirement templates for new apps and features
- **Source** — Minimal bootable app with one working route
- **Setup** — `scripts/setup.sh`, README, .env.example

### Workflow

Copy a template with `quickstart.py` and follow the output instructions. Each template's README has the full setup and planning workflow.

## Adding New Templates

Use the built-in template generator:

```bash
/planning "Angular 19 + Supabase SSR template"   # Research and plan
/execute plans/angular-supabase.md                # Build the template
```

Each template needs at minimum:
- `README.md` - Setup instructions
- `CLAUDE.md` - Claude Code guidelines (references `docs/` for standards enforcement)
- `docs/` - Stack-specific standards (selected and specialized from `doc-templates/` during planning)
- `.claude/skills/` - Generate and execute skills
- `planning/` - Requirement templates
- `scripts/setup.sh` - Automated setup script

### Base Templates

| Directory | Purpose |
|-----------|---------|
| `skill-templates/` | Base Claude skills, specialized per template into `.claude/skills/` |
| `doc-templates/` | Base standards docs (logging, errors, security, testing, etc.) — selected and specialized per template into `docs/` |

The quickstart script will automatically discover new templates.
