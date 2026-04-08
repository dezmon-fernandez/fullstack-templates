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

### 3. Command Specialization

When creating `.claude/skills/`, start from `skill-templates/` and specialize:
- Read the base skill file
- Adapt it for this stack's specific patterns, testing phases, validation commands, and architecture

### 4. Source Scaffolding

The source files should produce a minimal app that actually boots:
- Entry point wires up the key technologies
- One working route/page/command demonstrates the stack's patterns
- Config is correct and complete (no placeholder values except .env)

### 5. Validation

After all files are created, run the validation steps from the plan. Typically:

```bash
# Verify all expected files exist
find templates/[template-name] -type f | sort

# Verify it copies cleanly
python quickstart.py [template-name] /tmp/test-template
```

If the plan includes build/start validation and the dependencies are installable, run those too.

Fix any issues before completing.

### 6. Root Repo Updates

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
