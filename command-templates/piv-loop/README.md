# The PIV Loop

**Plan → Implement → Verify.** A directive, context-disciplined workflow for building features with
AI agents — one small, shippable **slice** at a time.

The idea is simple: build a structured plan from a rich conversation, then hand that plan — and *only* that plan — to a fresh agent to implement, and the result to *another*
fresh agent to review against it. Every handoff crosses a clean context boundary, so the plan is the
contract that carries the work, never a sprawling chat history.

```
  Zoom out first when a feature is too big for one plan:
  /decompose-feature  ─▶  phased roadmap of slices  ─▶  run the loop on each

  Then, per slice — one session each:
  /prime ─▶ chat about the feature ─▶ /generate-plan
                                             │
                                             ▼   clear context
                                      /execute-plan
                                             │
                                             ▼   clear context
                                      /review-code  ─▶  green gate, ship
```

## Why a loop

A single "build this feature" prompt forces an agent to make every decision at once, with no
checkpoint, and review becomes archaeology. The PIV loop replaces that with three moves:

- **Slices, not features.** Big work is decomposed into granular slices, each carrying *exactly one*
  architecture decision and ending at a green gate — small enough to plan and implement in one
  session, large enough to ship and stand alone.
- **Contract before code.** The plan specifies the **contract** — signatures, types, data models,
  behavioral rules, edge cases — and a **pseudocode** sketch of the implementation. Never paste-ready
  code. *Litmus:* if the implementer could paste it and be done, it's code; back off to pseudocode.
- **Verify against the contract.** Review asks two independent questions — *does the code satisfy the
  plan?* and *what did the plan miss?* — and routes each finding to the code, the plan, or the coding
  standards, so the next slice doesn't reproduce it.

## The lifecycle — and when to use each piece

### `/prime` — understand the codebase
**When:** the start of every session, in a fresh context.

Loads the repo's structure, docs, conventions, and current state into context, so everything after it
is grounded in how *this* codebase actually works.

### Chat about the feature — *no command, just talk*
**When:** after priming, before you plan.

Where you and the agent build shared understanding of what you're about to build. As involved as you
want — "read these two files," or "spend an hour gathering info and talking it through." No rush, no
command; you're accumulating the context that makes the next step produce a *good* plan. The richer
the conversation, the better the plan.

### `/generate-plan` — turn the conversation into a structured plan
**When:** once the chat has surfaced enough understanding that you know what you want built.

Takes your conversation as the kick-start, then does its own codebase research, external research, and
design on top — and writes the plan: the contract plus a pseudocode implementation sketch. Push on it
until you're happy. This is the cheapest place to fix a mistake.

> **⟲ Clear your context.** The plan is now a self-contained artifact — it carries everything the
> implementer needs. A fresh context means the implementer works from the plan, not from the
> meandering history of how you got there.

### `/execute-plan` — implement the plan to the tee
**When:** fresh context, plan in hand.

Follows the plan task by task, runs its validation commands, and reports *behaviorally* what it built
— what changed, what it now enables, whether the gate is green. The plan is the contract, so the
implementer executes decisions rather than relitigating them.

> **⟲ Clear your context.** You want a genuinely independent reviewer — one that judges the code
> against the plan, not against the implementer's account of what it did. Don't let the implementer
> grade its own work.

### `/review-code` — validate the code against the plan
**When:** fresh context, after execution.

Checks the implementation against the plan, independently: *is every part of the contract implemented
and tested?* and *what must the code handle that the plan never named?* Findings are classified so each
fix routes to its source. Green gate → ship the slice, then start the next in a fresh session.

### `/decompose-feature` — zoom out when the work is too big
**When:** *before* planning, when a feature is too large to plan or hold in your head at once.

> If you can't understand the plan, you won't understand the code.

Breaks big work into a **phased roadmap of small slices**, each carrying one decision and ending
shippable. You then run the full loop above on **each slice**, one per session, planning each against
what the previous one actually landed — not a guess made up front.

- **Small, well-understood change?** Start at `/prime` and run the loop directly.
- **Big or fuzzy feature?** Start at `/decompose-feature`, then run the loop on each slice it yields.

## Why the context boundaries matter

The two "clear your context" steps aren't housekeeping — they're the mechanism that makes the loop
work:

- **Clear before implementing** → the plan has to prove it's complete. If the implementer can't build
  from the plan alone, the plan had a gap — and you found it now, not in review.
- **Clear before reviewing** → the reviewer is truly independent. It can't be talked into "that's fine,
  here's why I did it that way," because it never heard the explanation. It has only the plan and the
  code.

## How review routes each finding

`/review-code` classifies every finding so the fix lands where it belongs — and the next slice doesn't
repeat it:

| Finding | Meaning | Fix lands in |
|---|---|---|
| **Met** | Satisfied and tested | — |
| **Code defect** | Plan was clear; the code doesn't satisfy it | this slice's code |
| **Plan gap** | Code is reasonable; the plan was silent or ambiguous | the plan, before the next slice |
| **Standard gap** | A recurring miss no convention governs | the coding standards / CLAUDE.md |

A plan gap or standard gap is the more valuable find — it fixes the *process*, not just one slice. When
divergences recur, the retrospective commands (`/execution-report` → `/system-review`) turn them into
durable updates to CLAUDE.md, the plan template, or the commands themselves.

## What makes a good slice

`/decompose-feature` enforces these — they're what keep the loop honest:

- **Slice 1 proves the inviolable property** end to end, with the fewest moving parts.
- **One architecture decision per slice.** Bundle several and the review goes coarse — split them.
- **Independent units before integrators.** The slice that wires things together comes last.
- **Settle the irreversible early.** A key type everything depends on is decided and reviewed before
  anything builds on it.
- **Every slice ends shippable and gate-green**, pinned by a regression-floor test.

## Before the loop: the PRD

The **PRD (`.agents/PRD.md`) is the repo's source of truth** — the vision, scope, and constraints every
plan aligns to. It isn't a loop step; it's the ground the loop stands on. Seed it once with
`/create-prd` to capture the initial vision, then keep it current as the project evolves.

## Artifacts

Everything the loop reads and writes lives in the `.agents/` workspace:

```
.agents/
├── PRD.md                              # source of truth — every plan aligns to it
├── feature-ideas/<feature>-roadmap.md  # slice roadmap from /decompose-feature
├── plans/<slice>.md                    # one contract + pseudocode plan per slice
├── execution-reports/<slice>.md        # what /execute-plan actually did
└── system-reviews/<slice>-review.md    # process findings from /system-review
```

## How these templates are used

`command-templates/piv-loop/` is the canonical source for these commands. Each stack template
(`templates/*/.claude/skills/`) carries specialized copies wired up as slash commands — edit the
behavior of the loop here, then sync it out.
