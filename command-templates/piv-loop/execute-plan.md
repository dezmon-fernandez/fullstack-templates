---
description: Execute an implementation plan
argument-hint: [path-to-plan]
---

# Execute: Implement from Plan

## Plan to Execute

Read plan file: `$ARGUMENTS`

## Execution Instructions

### 1. Read and Understand

- Read the ENTIRE plan carefully
- Understand all tasks and their dependencies
- Note the validation commands to run
- Review the testing strategy

### 2. Execute Tasks in Order

For EACH task in "Step by Step Tasks":

#### a. Navigate to the task
- Identify the file and action required
- Read existing related files if modifying

#### b. Implement the task
- Follow the detailed specifications exactly
- Maintain consistency with existing code patterns
- Include proper type hints and documentation
- Add structured logging where appropriate

#### c. Verify as you go
- After each file change, check syntax
- Ensure imports are correct
- Verify types are properly defined

### 3. Implement Testing Strategy

After completing implementation tasks:

- Create all test files specified in the plan
- Implement all test cases mentioned
- Follow the testing approach outlined
- Ensure tests cover edge cases

### 4. Run Validation Commands

Execute ALL validation commands from the plan in order:

```bash
# Run each command exactly as specified in plan
```

If any command fails:
- Fix the issue
- Re-run the command
- Continue only when it passes

### 5. Final Verification

Before completing:

- ✅ All tasks from plan completed
- ✅ All tests created and passing
- ✅ All validation commands pass
- ✅ Code follows project conventions
- ✅ Documentation added/updated as needed

## Output Report

When the work is done, report by filling the template below — every section, in order. Lead with what changed and what it now enables, not a file dump. Show, don't summarize. Write **none** for a section nothing touched. The plan and the repo's CLAUDE.md / docs drive the specifics — keep this to what the slice changed.

````markdown
### What was built

<Per functional unit: 1–3 plain sentences on what it does and how it fits — behavior, not a bare file list.>

- `path/to/module` — what it does in one line; how it fits.

### Data-model / schema / interface changes

<Anything whose shape or contract changed, so other code must conform; "none" if nothing changed shape.>

- `migration NNNN`: `<the DDL>` · `<Type>` + `<field: type>` · new surface `<name(args) -> Return>` · `<route / component props / config key + its shape>`

### Validation Results

```bash
$ <lint && type-check && tests>
<the actual output>
```

### Net state

<What is now possible or unblocked that wasn't, and what's gated or next.>

- now unblocked: `<capability>` · next: `<what comes first>`

### Ready for commit

<**Yes** — all tasks done, checks green · **No** — `<the blocking gap>`>
````

## Notes

- If you encounter issues not addressed in the plan, document them
- If you need to deviate from the plan, explain why
- If tests fail, fix implementation until they pass
- Don't skip validation steps
