# The PIV Loop

**Plan → Implement → Verify.** A directive, slice-at-a-time workflow for building features with AI agents.

These command templates turn a feature request into shipped code by running one small, shippable
**slice** through the loop per session. Each pass produces a context-rich plan, an implementation
built from it, and a review that holds the code to the plan *and* holds the plan to reality. The loop
is built one slice at a time so every slice plans against what the last one actually landed — never a
guess made up front.

## Why a loop

A single "build this feature" prompt forces an agent to make every decision at once, with no
checkpoint, and review becomes archaeology. The PIV loop fixes that with three moves:

- **Slices, not features.** A feature is decomposed into granular slices, each carrying *exactly one*
  architecture decision and ending at a green gate. Small enough to plan and implement in one session;
  large enough to ship and stand alone.
- **Contract before code.** The plan specifies the **contract** (signatures, types, data models,
  behavioral rules, edge cases) and a **pseudocode** implementation sketch — never paste-ready code.
  Litmus: if the implementer could paste it and be done, it's code; back off to pseudocode.
- **Review against the contract.** Verification asks two independent questions — *does the code
  satisfy the plan?* and *what did the plan miss?* — and routes each finding to the code, the plan, or
  the coding standards so the next slice doesn't reproduce it.

## The loop at a glance

```
                          once per feature
   /prime ─▶ /create-prd ─▶ /decompose-feature ─▶  roadmap of slices
                                                          │
                  ┌───────────────────────────────────────┘
                  ▼   once per slice (one session each)
        ┌────────────────────────────────────────────────────────┐
        │  P  /generate-plan-alt   →  contract + pseudocode plan │
        │  I  /execute-plan        →  code + tests + report      │
        │  V  /review-code         →  conformance + completeness │
        │     /commit              →  atomic, gate-green commit  │
        └────────────────────────────────────────────────────────┘
                  │
                  ▼  optional, when divergence repeats
        /execution-report ─▶ /system-review ─▶ updates to CLAUDE.md,
                                                plan template, commands
```

## Commands

| Step | Command | Input | Produces |
|------|---------|-------|----------|
| **Prime** | `/prime` | — | Codebase understanding loaded into context |
| **PRD** | `/create-prd` | feature/product idea | `.agents/PRD.md` — the project source of truth |
| **Decompose** | `/decompose-feature` | feature / PRD section | `.agents/feature-ideas/<feature>-roadmap.md` — ordered slices |
| **P — Plan** | `/generate-plan-alt` | one slice's intent line | `.agents/plans/<slice>.md` — contract + pseudocode plan |
| **I — Implement** | `/execute-plan` | path to plan | Code, tests, and an execution report |
| **V — Verify** | `/review-code` | plan + diff/paths | Conformance + completeness review, classified findings |
| **Commit** | `/commit` | — | One atomic, conventional commit |
| **Reflect** | `/execution-report` → `/system-review` | plan + report | Process fixes routed to CLAUDE.md / templates |

> `/generate-plan-alt` is the **directive** planner — it produces a contract and a pseudocode plan, not
> literal code, so the implementer writes the code. `/generate-plan` is the original variant that may
> include more concrete code; prefer `-alt` for the PIV loop.

## Running one slice

Each slice is one session. From the roadmap, take the slice's generate line and run:

```bash
/prime                                              # load context (once per session)
# read the roadmap, pick the next unchecked slice
/generate-plan-alt <the slice's intent line>        # P — write the plan
# review the plan, confirm the contract & edge cases, then:
/execute-plan .agents/plans/<slice>.md              # I — build it
/review-code .agents/plans/<slice>.md <diff>        # V — verify against the plan
# confirm the gate is green (lint, types, tests)
/commit                                             # check the slice off and commit
```

Then start the next slice in a fresh session. Repeat until the roadmap is checked off.

## What makes a good slice

The decompose step enforces these — they're what keep the loop honest:

- **Slice 1 proves the inviolable property** end to end, with the fewest moving parts.
- **One architecture decision per slice.** Bundle several and the review goes coarse. Split them.
- **Independent units before integrators.** The slice that wires things together comes last.
- **Settle the irreversible early.** A key type everything depends on is decided and reviewed before
  anything builds on it.
- **Every slice ends shippable and gate-green** — and carries a regression-floor test that pins its
  result for good.

## Verification routes findings to their source

`/review-code` classifies each finding so the fix lands where it belongs:

| Finding | Meaning | Fix lands in |
|---------|---------|--------------|
| **Met** | Satisfied and tested | — |
| **Code defect** | Plan was clear; code doesn't satisfy it | This slice's code |
| **Plan gap** | Code is reasonable; plan was silent/ambiguous | The plan (before the next slice) |
| **Standard gap** | Recurring miss with no convention governing it | The coding standards / CLAUDE.md |

A plan gap or standard gap is the more valuable find — it fixes the *process*, not just one slice. The
optional retrospective (`/execution-report` → `/system-review`) is where repeated divergences get
turned into durable updates to CLAUDE.md, the plan template, or new commands.

## Artifacts

Everything the loop reads and writes lives in the `.agents/` workspace:

```
.agents/
├── PRD.md                              # source of truth — every plan aligns to it
├── feature-ideas/<feature>-roadmap.md  # the slice roadmap from /decompose-feature
├── plans/<slice>.md                    # one contract + pseudocode plan per slice
├── execution-reports/<slice>.md        # what /execute-plan actually did
└── system-reviews/<slice>-review.md    # process findings from /system-review
```

## How these templates are used

`command-templates/` is the canonical source. Each stack template (`templates/*/.claude/skills/`)
carries specialized copies wired up as slash commands. Edit the behavior of the loop here, then sync
it out to the templates.
