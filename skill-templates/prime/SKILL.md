---
description: Prime agent with codebase understanding
---

# Prime: Load Project Context

## Objective

Build comprehensive understanding of the codebase by analyzing structure, documentation, and key files.

## Process

### 0. Consume a pending handover

A previous session may have left `.agents/handover.md`: live state for whoever resumes,
covering what is half-done, what is blocked, and which claims were verified versus assumed.

Its contents:

!`cat .agents/handover.md 2>/dev/null || echo "(no pending handover)"`

If that printed `(no pending handover)`, skip to step 1. Otherwise:

1. Treat the handover as the current position for the rest of this priming. Its
   constraints and prohibitions apply to prime's own reads in the steps below, not only
   to the work after: a file the handover says not to read is not read during priming.
2. Verify any claim in it before acting on that claim in a way that spends credits,
   writes to production, or cannot be undone. A handover records one moment, and the
   tree may have moved since.
3. **Delete the file before continuing.** Run `git rm --cached .agents/handover.md`
   first if it is tracked or staged, then remove it from disk. A handover left in place
   is read by a later session as though it were still current, and is overwritten by
   the next run of the `/handover` skill that produced it.
4. Carry what it says into the report. The "Where we left off" section at the end is
   written from it.

### 1. Analyze Project Structure

All tracked files:
!`git ls-files`

Directory structure:
!`tree -L 3 -I 'node_modules|__pycache__|.git|dist|build' 2>/dev/null || echo "(tree not installed — see git ls-files above)"`

### 2. Read Core Documentation

- **Read the PRD (`.agents/PRD.md`) — the project's source of truth** (vision, MVP scope, architecture, success criteria, risks). If it's missing, note the user should run `/create-prd`.
- Read CLAUDE.md or similar global rules file
- Read README files at project root and major directories
- Read any architecture documentation

**The documentation map lives in CLAUDE.md** ("Documentation map"). Pull in now the rows whose
trigger the pending work fires; leave the rest for the moment it does.

### 3. Identify Key Files

Based on the structure, identify and read:
- Main entry points (main.py, index.ts, app.py, etc.)
- Core configuration files (pyproject.toml, package.json, tsconfig.json)
- Key model/schema definitions
- Important service or controller files

### 4. Understand Current State

Recent activity:
!`git log -10 --oneline`

Current branch and working-tree state:
!`git status`

## Output Report

Provide a concise summary covering:

### Project Overview
- Purpose and type of application
- Primary technologies and frameworks
- Current version/state

### Architecture
- Overall structure and organization
- Key architectural patterns identified
- Important directories and their purposes

### Tech Stack
- Languages and versions
- Frameworks and major libraries
- Build tools and package managers
- Testing frameworks

### Core Principles
- Code style and conventions observed
- Documentation standards
- Testing approach

### Current State
- Active branch
- Recent changes or development focus
- Any immediate observations or concerns

**Make the sections above easy to scan - use bullet points and clear headers.**

### Where we left off
Include this section only when step 0 consumed a handover; otherwise end the report above.

Brief the operator in two parts, both drawn from the handover.

First the story, one prose paragraph: what is being built, why, and where it stands —
written so someone returning after a day away understands it without opening a file.

Then the same-page check:

- **What we know** — the facts in force, anything still assumed flagged as such, and
  operator constraints quoted verbatim.
- **Next task(s)** — the immediate work, in order.
- **Open decisions** — calls only the operator can make, and what each unblocks.

Current State describes the repository as it stands; this describes the work in motion.
