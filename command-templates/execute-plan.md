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

Lead with what changed and what it now enables — not a file dump.

### What was built

Per logical unit (slice / feature / phase): 1–3 plain sentences on what it *does* and how it
fits — behavior, not a file list. A fresh reader should grasp the capability from this alone.

### Data-model / schema / interface changes

The shape changes, first-class and explicit — migrations / DDL, data-model or type changes,
new or changed public signatures, config or env keys. Show the actual change (the DDL line, the
field added). Write **none** for a unit that changed no shape — an explicit *none* is
information. (This is the part a flat file list always loses.)

### Files

- Created (with paths)
- Modified (with paths)
- Removed (with paths)

### Validation

- Tests added (files + count) and their result
- Each validation command from the plan, with its outcome

### Net state

What is now possible or unblocked that wasn't, and what remains gated or next — the capability
delta ("so what").

### Ready for commit

- All plan tasks complete and all validations green → ready for `/commit`, or name the blocking gap.

## Notes

- If you encounter issues not addressed in the plan, document them
- If you need to deviate from the plan, explain why
- If tests fail, fix implementation until they pass
- Don't skip validation steps
