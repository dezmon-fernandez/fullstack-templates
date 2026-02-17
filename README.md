# Quickstart Hub

A collection of AI-powered templates for rapid MVP development with Claude Code.

## Quick Start

```bash
# List available templates
python quickstart.py --list

# Copy a template to start a new project
python quickstart.py react-spa-supabase ./my-new-app

# With git initialization
python quickstart.py react-spa-supabase ./my-new-app --with-git
```

## Available Templates

### react-spa-supabase
Client-rendered React 19 SPA with Supabase backend.

**Stack:** React 19, Vite, TanStack Router/Query, Supabase, shadcn/ui, Tailwind v4

**Best for:** Dashboards, admin panels, internal tools, apps where SEO doesn't matter.

### tanstack-start-supabase
Server-rendered React with TanStack Start and Supabase.

**Stack:** React 19, TanStack Start, TanStack Router/Query, Supabase, shadcn/ui, Tailwind v4

**Best for:** Public-facing apps, landing pages, content sites, SEO-critical applications.

### next-supabase
Server-rendered React with Next.js App Router and Supabase.

**Stack:** Next.js 16, React 19, App Router, Server Components, Supabase, shadcn/ui, Tailwind v4

**Best for:** Public-facing apps, e-commerce, content sites, SEO-critical applications, teams familiar with Next.js.

## How It Works

Each template includes:

1. **PRP System** - Product Requirement Prompts for AI-driven development
2. **Claude Commands** - `/generate-*-prp` and `/execute-*-prp` commands
3. **AGENTS.md** - Guidelines for Claude Code
4. **Vertical Slice Architecture** - Feature-based code organization

### Workflow

```bash
# 1. Copy template
python quickstart.py react-spa-supabase ./my-app

# 2. Navigate and install
cd my-app
pnpm install

# 3. Set up Supabase credentials
cp .env.example .env.local
# Edit .env.local with your keys

# 4. Describe your app in PRPs/INITIAL.md

# 5. Generate implementation plan
/generate-react-supabase-prp PRPs/INITIAL.md

# 6. Execute the plan
/execute-react-supabase-prp PRPs/[generated].md

# 7. Run
pnpm dev
```

## Adding New Templates

1. Create a folder in `templates/`
2. Include at minimum:
   - `README.md` - Setup instructions
   - `AGENTS.md` - Claude Code guidelines
   - `CLAUDE.md` - Points to AGENTS.md
   - `.claude/commands/` - Generate and execute commands
   - `PRPs/` - Requirement templates

The quickstart script will automatically discover new templates.
