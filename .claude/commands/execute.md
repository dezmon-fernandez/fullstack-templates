---
description: Execute a plan to build a new tech stack template
argument-hint: [path-to-plan e.g. plans/angular-supabase.md]
---

# Execute: Build Template from Plan

## Plan to Execute

Read plan file: `$ARGUMENTS`

Read the ENTIRE plan before writing any files. Understand all phases, files, and dependencies. The plan contains all the research — do not do additional research, just implement.

## Execution

### 1. Work Through Tasks in Order

For each task in the plan:

- Create the file at the exact path specified
- Follow the details and reference files noted in the plan
- When adapting from an existing template file, read that file first, then modify for the target stack
- Stay consistent with the patterns and conventions described in the plan

### 2. CLAUDE.md Quality Check

After writing CLAUDE.md (or AGENTS.md), verify:
- Code examples are real and use the correct syntax for the target stack (not pseudocode, not copied from a different framework)
- Architecture section matches the actual file structure you just created
- Development commands match what's in package.json (or equivalent)
- Gotchas section reflects actual issues found during planning research

### 3. Docs Specialization

The plan specifies which `doc-templates/` to include and the stack-specific decisions for each. Only create docs the plan calls for.

For each doc listed in the plan:
- Read the base `doc-templates/[name].md`
- Replace all `[STACK-SPECIFIC]` sections using the decisions from the plan
- Keep stack-agnostic sections intact
- Write to `docs/[name].md` in the template

After writing all docs, add a standards reference section in CLAUDE.md that points to each doc:

```markdown
## Standards

Follow the standards in these docs — read them before writing code in the relevant area:
- Logging: `docs/logging.md`
- Error handling: `docs/error-handling.md`
```

Only list docs that were actually created. This reference is how Claude Code discovers and reads the standards — it won't find them otherwise.

### 4. Command Specialization

When creating `.claude/skills/`, start from `skill-templates/` and specialize:
- Read the base skill file
- Adapt it for this stack's specific patterns, testing phases, validation commands, and architecture

### 5. Source Scaffolding

The source files should produce a minimal app that actually boots:
- Entry point wires up the key technologies
- One working route/page/command demonstrates the stack's patterns
- Config is correct and complete (no placeholder values except .env)

### 6. Validation

After all files are created, run the validation steps from the plan. Typically:

```bash
# Verify all expected files exist
find templates/[template-name] -type f | sort

# Verify it copies cleanly
python quickstart.py [template-name] /tmp/test-template
```

If the plan includes build/start validation and the dependencies are installable, run those too.

Fix any issues before completing.

### 7. Root Repo Updates

- Update root `README.md` with the new template entry
- Verify `quickstart.py` discovers it (it scans `templates/` automatically)

## Output Report

### Files Created
- List every file with its path

### Validation Results
- Output from each validation step

### Notes
- Any deviations from the plan and why
- Any issues encountered and how they were resolved
- Anything that needs manual follow-up

### Ready for Commit
- Confirm all files created
- Confirm validation passed
- Ready for `/commit`
