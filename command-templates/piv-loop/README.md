# The PIV Loop

**Plan → Implement → Verify.** Build a feature one small, shippable **slice** at a time — each slice
planned, built, and reviewed across clean context boundaries, so the plan is the only thing that
carries the work from step to step.

One "build this feature" prompt makes an agent decide everything at once, with no checkpoint, and
turns review into archaeology. The loop replaces that with three moves:

- **Slices, not features.** Decompose big work into slices that each carry *exactly one* architecture
  decision and end at a green gate — small enough to plan in one session, large enough to ship alone.
- **Contract before code.** The plan specifies the **contract** — signatures, types, data models,
  behavioral rules, edge cases — and a **pseudocode** sketch. *Litmus: if the implementer could paste
  it and be done, it's code — back off to pseudocode.*
- **Verify against the contract.** Review asks two questions — *does the code satisfy the plan?* and
  *what did the plan miss?* — and routes each finding to the code, the plan, or the standards.

## The loop at a glance

```
  Big or fuzzy feature? Zoom out first:
  /decompose-feature ─▶ roadmap of slices ─▶ run the loop on each

  Per slice — one session each:
  /prime ─▶ talk it through ─▶ /generate-plan
                                      │ ⟲ clear context
                               /execute-plan
                                      │ ⟲ clear context
                               /review-code ─▶ green gate ─▶ ship
```

## Run one slice

One session per slice. Clear context at the two ⟲ marks — that is what makes the loop work, not
housekeeping (see below).

| # | Step | Done when |
|---|------|-----------|
| 1 | `/prime` | Repo structure, conventions, and current state are in context. |
| 2 | Talk it through *(no command)* | You can state what to build and why. Read files, ask, gather — the richer the chat, the better the plan. |
| 3 | `/generate-plan` | The plan names the full contract + a pseudocode sketch you'd approve. Push on it here — cheapest place to fix a mistake. **⟲ clear after.** |
| 4 | `/execute-plan <plan>` | Code and tests written from the plan alone, gate green, behavioral report of what shipped. **⟲ clear after.** |
| 5 | `/review-code <plan> <diff>` | Every contract item is met and tested; each finding is classified (table below). |

Green gate → ship the slice, then start the next in a fresh session, planned against what this one
actually landed. Repeat until the roadmap is clear.

> Small, well-understood change? Skip decompose — start at `/prime`. Seed the PRD once with
> `/create-prd`; when divergences recur, `/execution-report → /system-review` turns them into durable
> fixes to CLAUDE.md, the plan template, or the commands.

## Why the two context clears

- **Clear before implementing** → the plan must prove it's complete. If the implementer can't build
  from the plan alone, the plan had a gap — and you found it now, not in review.
- **Clear before reviewing** → the reviewer is genuinely independent. It has only the plan and the
  code, so it can't be talked into "that's fine, here's why" — it never heard the why.

## What makes a good slice

`/decompose-feature` enforces these:

- **Slice 1 proves the inviolable property** end to end, with the fewest moving parts.
- **One architecture decision per slice** — bundle several and review goes coarse.
- **Independent units before integrators** — the slice that wires things together comes last.
- **Settle the irreversible early** — a key type everything depends on is decided and reviewed first.
- **Every slice ends shippable and gate-green**, pinned by a regression-floor test.

## Where review sends each finding

| Finding | Meaning | Fix lands in |
|---|---|---|
| **Met** | Satisfied and tested | — |
| **Code defect** | Plan was clear; code doesn't satisfy it | this slice's code |
| **Plan gap** | Code is reasonable; the plan was silent or ambiguous | the plan, before the next slice |
| **Standard gap** | A recurring miss no convention governs | the coding standards / CLAUDE.md |

A plan gap or standard gap is the more valuable find — it fixes the process, not one slice.

## Artifacts

The loop reads and writes the `.agents/` workspace. `.agents/PRD.md` is the repo's source of truth —
every plan aligns to it; it grounds the loop rather than being a step in it.

```
.agents/
├── PRD.md                              # source of truth — every plan aligns to it
├── feature-ideas/<feature>-roadmap.md  # slice roadmap from /decompose-feature
├── plans/<slice>.md                    # one contract + pseudocode plan per slice
├── execution-reports/<slice>.md        # what /execute-plan built
└── system-reviews/<slice>-review.md    # process findings from /system-review
```

## Editing these commands

`command-templates/piv-loop/` is the canonical source. Stack templates
(`templates/*/.claude/skills/`) carry specialized copies wired as slash commands — edit the loop
here, then sync it out.
