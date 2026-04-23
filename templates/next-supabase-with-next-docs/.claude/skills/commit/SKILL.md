---
description: Create an atomic commit for current changes in this Next.js + Supabase + Fumadocs project
---

# Commit Changes

## Process

### 1. Review Changes

```bash
git status
git diff HEAD
git diff --stat HEAD
```

Check for new untracked files:
```bash
git ls-files --others --exclude-standard
```

### 2. Stage Files

Add the untracked and changed files relevant to the current work.

**Do NOT stage:**
- `.env.local` or any credential files
- `.next/` build output, `node_modules/`, `pnpm-lock.yaml` conflicts
- Files unrelated to the current task
- Large binaries

### 3. Pre-Commit Validation

Before committing, run the project's quality gates:

```bash
pnpm biome check .    # Lint and format
pnpm tsc --noEmit     # Type check
pnpm test --run       # Tests (if touched code has coverage)
```

Fix any errors before proceeding. Never commit with failing type checks or lint errors.

### 4. Create Commit

Write an atomic commit message with a conventional commit tag:

- `feat:` — New capability or feature
- `fix:` — Bug fix
- `refactor:` — Code restructure without behavior change
- `docs:` — Documentation only
- `test:` — Test additions or fixes
- `chore:` — Build, CI, tooling changes
- `perf:` — Performance improvement
- `style:` — Formatting, whitespace (rare with Biome auto-format)

**Use scope to identify the vertical slice or subsystem:**

```
feat(auth): add magic-link sign-in flow
fix(dashboard): resolve server action redirect loop
refactor(supabase): consolidate SSR client creation
chore(deps): bump @supabase/ssr to 0.5.x
```

**Commit message format:**
```
tag(scope): concise description of what changed

[Optional body explaining WHY this change was made,
not just what changed. Include context that isn't
obvious from the diff.]

[Optional: Fixes #123, Closes #456]
```

### 5. Capture AI Context Changes

If any AI context assets were modified in this commit, add a `Context:` section to the commit body:

```
feat(auth): add magic-link sign-in flow

Supabase magic-link replaces password auth for the MVP since email
delivery is already configured and reduces support surface.

Context:
- Added .agents/reference/auth-flow.md documenting the redirect dance
- Updated .claude/skills/generate-plan/SKILL.md with auth patterns
- Noted gotcha: middleware must refresh session before Server Component reads

Fixes #482
```

**What counts as AI context changes:**
- `.claude/skills/` — skill definitions created or modified
- `.agents/reference/` — curated reference material added or updated
- `.agents/PRD.md` — product definition changes
- `CLAUDE.md` — global rules or stack guidance changes

**What does NOT count:**
- `.agents/plans/` — plans are task outputs, not context
- `.next-docs/` — auto-generated, don't track in commits

**Why this matters:** Your git log is long-term memory. Future agents and sessions use `git log` to understand project history. If context changes aren't captured in commits, the AI layer's evolution becomes invisible — you lose the ability to trace WHY a rule exists or WHEN a pattern was adopted.

### 6. Output Report

Verify with `git log -1 --oneline` and `git show --stat`, then report:

- **Commit Hash**
- **Commit Message** (full, in code block)
- **Files Committed** (with change stats)
- **Summary**: files changed, insertions, deletions

## Notes

- If no changes to commit, report clearly
- If pre-commit validation fails, report the error and stop — do not `--no-verify`
- Never include `Co-Authored-By` lines
- If a commit fails due to a hook, fix the underlying issue and create a NEW commit (do not amend)
