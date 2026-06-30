---
description: "Review an implementation against its plan — confirm every part of the contract is met and tested, and find the cases the plan missed"
argument-hint: [path-to-plan] [diff or paths implemented]
---

# Review code against its plan

## Inputs: $ARGUMENTS

The first argument is the plan — the contract the code was built to satisfy. The rest is the code or
diff implemented from it. Judge the code against the plan and the codebase, never against the
implementer's account of what it did.

## Mission

Answer two questions, independently:

1. **Does the code satisfy the plan?** Every acceptance criterion, behavioral rule, and edge case the
   plan specifies is implemented and tested.
2. **What did the plan miss?** Cases the code must handle that the plan never named.

The first keeps the implementation honest to the contract. The second keeps the contract honest to
reality — and a case the plan failed to name is the more valuable find, because it exposes a gap in
the plan, not just the code.

## Process

### 1. Load the contract

Read the plan's CONTRACT, ACCEPTANCE CRITERIA, behavioral rules, and edge-case table. Extract them as
a flat list of conditions the code must meet — this list is what you verify against.

### 2. Read the implementation

Read the changed code and its tests. For each condition, locate where the code satisfies it and the
test that exercises it.

### 3. Pass 1 — Conformance

For every condition: is it implemented, and is there a test that proves it? Cite the evidence
(`file:line`). A condition with no test fails the pass. Confirm every path of each public method has a
test.

### 4. Pass 2 — Completeness

Read the public surfaces for cases the plan did not name but the code must handle — boundaries, empty
or malformed input, error and ordering paths, domain rules implied but unstated. Each one you find is
a hole in the plan.

### 5. Classify each finding

- **Met** — satisfied and tested.
- **Code defect** — the plan was clear; the code does not satisfy it. The fix is in the code.
- **Plan gap** — the code is reasonable; the plan was silent or ambiguous. The fix is in the plan.
- **Standard gap** — a recurring miss with no convention governing it. The fix is in the coding
  standards.

A code defect is corrected against this slice. A plan gap or standard gap is corrected at its source,
so the next slice does not reproduce it. You report; the operator decides what merges.

## Output

```markdown
## Conformance
| Contract condition | Implemented | Tested | Evidence (file:line) | Finding |
|---|---|---|---|---|
| <condition> | yes/no | yes/no | <where> | met / code defect |

Every public-method path tested: <yes, or the untested paths>

## Cases the plan missed
- <case> — what breaks without it — <plan gap | standard gap>

## Verdict
- **Pass**, or **changes needed**.
- Code to fix: <list, or none>.
- Plan or standards to update: <list, or none>.
```

## Quality criteria

- [ ] Every contract condition is checked and carries file:line evidence.
- [ ] Every public-method path is confirmed tested.
- [ ] Unenumerated cases are actively searched for, not just the listed ones verified.
- [ ] Each finding is classified so its fix routes to the code, the plan, or the standards.

## Report

- Pass or changes-needed, with counts: met, code defects, plan gaps, standard gaps.
- The single most important finding.
- What to route back to the plan or the coding standards.
