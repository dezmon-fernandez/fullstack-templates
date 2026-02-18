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
# Edit PRPs/INITIAL.md with your app requirements
/generate-<template>-prp PRPs/INITIAL.md           # Generate implementation plan
/execute-<template>-prp PRPs/[generated].md        # Build it
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

## How It Works

Each template includes:

1. **PRP System** - Product Requirement Prompts for AI-driven development
2. **Claude Commands** - `/generate-*-prp` and `/execute-*-prp` slash commands
3. **CLAUDE.md** - Project guidelines for Claude Code
4. **Vertical Slice Architecture** - Feature-based code organization
5. **Setup Script** - `pnpm setup` automates deps, Supabase, and environment config

### Workflow

Copy a template with `quickstart.py` and follow the output instructions. Each template's README has the full setup and PRP workflow.

## Adding New Templates

1. Create a folder in `templates/`
2. Include at minimum:
   - `README.md` - Setup instructions
   - `CLAUDE.md` - Claude Code guidelines
   - `.claude/commands/` - Generate and execute commands
   - `PRPs/` - Requirement templates
   - `scripts/setup.sh` - Automated setup script

The quickstart script will automatically discover new templates.
