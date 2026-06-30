# The PIV Loop

**Plan → Implement → Verify.** A context-disciplined workflow for building features with AI agents,
one slice at a time.

The idea is simple: build a structured plan from a rich conversation, then hand that plan — and *only*
that plan — to a fresh agent to implement, then hand the result to *another* fresh agent to review
against the plan. Each handoff happens across a clean context boundary, so the plan is the contract
that carries the work, not a sprawling chat history.

```
  /prime
  │
  ▼
  chat about the feature   (no command — build context, as deep as you want)
  │
  ▼
  /generate-plan
  │
  ▼  ──  clear context
  /execute-plan
  │
  ▼  ──  clear context
  /review-code


  Too big for one pass? Zoom out first:
  /decompose-feature  ──▶  break it into phased slices, then run the loop above on each.
```

## The lifecycle — and when to use each piece

### 1. `/prime` — understand the codebase

**When:** at the very start, in a fresh context.

Loads the structure, docs, conventions, and current state of the repo into context so everything
after it is grounded in how *this* codebase actually works. Run it first, every session.

### 2. Chat about the feature *(no command — just talk)*

**When:** after priming, before you plan.

This is where you and the agent build shared understanding of what you're about to build. It's as
involved as you want it to be — "read this file and this one," or "spend an hour gathering info and
talking it through." There's no rush and no command; the goal is to accumulate the context that makes
the next step produce a *good* plan. The richer this conversation, the better the plan.

### 3. `/generate-plan` — turn the conversation into a structured plan

**When:** once the chat has surfaced enough understanding and you know what you want built.

Uses the context of your conversation as the kick-start, then does its own work on top of it —
codebase research, external research, and strategic design — and writes a structured plan. The plan
specifies the **contract** (signatures, types, data models, behavioral rules, edge cases) and a
**pseudocode** implementation sketch. It is *not* paste-ready code — it guides the implementer; it
doesn't pre-write the answer.

Review the plan. Push on it until you're happy with it. This is the cheapest place to fix a mistake.

> ### ⟲ Clear your context
> Once you're happy with the plan, clear it. The plan is now a self-contained artifact — it carries
> everything the implementer needs. A fresh context means the implementer works from the plan, not
> from the meandering history of how you got there.

### 4. `/execute-plan` — implement the plan to the tee

**When:** fresh context, plan in hand.

Follows the plan exactly, task by task, runs the plan's validation commands, and reports *behaviorally*
what it built afterward — what changed, what it now enables, whether the gate is green. Because the
plan is the contract, the implementer doesn't need to relitigate decisions; it executes them.

> ### ⟲ Clear your context
> Clear it again before reviewing. You want a **fresh, unbiased reviewer** — one that judges the code
> against the plan, not against the implementer's own account of what it did. Independent verification
> is the whole point; don't let the implementer grade its own work.

### 5. `/review-code` — validate the code against the plan

**When:** fresh context, after execution.

Checks the implementation against the plan and answers two questions independently: *does the code
satisfy every part of the contract (and is each part tested)?* and *what did the plan fail to name that
the code must still handle?* Findings are classified so each fix routes to the right place — the code,
the plan, or the coding standards — so the next slice doesn't reproduce the same gap.

This is the last piece of one pass through the loop. Green gate → ship the slice.

---

## `/decompose-feature` — for work too big for one pass

**When:** *before* you plan, when the feature is too large to plan or understand in a single session.

> If you don't understand the plan, you're not going to understand the code.

A plan that sprawls across a whole feature is a plan no one can hold in their head — and code built
from it is code no one can review. Decompose breaks big work into a **phased roadmap of small slices**,
each carrying one decision and ending shippable. You then run the full PIV loop above on **each phase**,
one per session, planning each slice against what the previous one actually landed.

So the rule of thumb:

- **Small, well-understood change?** Start at `/prime` and run the loop directly.
- **Big or fuzzy feature?** Start at `/decompose-feature`, then run the loop on each slice it produces.

## At a glance

| Step | Command | When to reach for it | Context |
|------|---------|----------------------|---------|
| Understand | `/prime` | Start of every session | fresh |
| Discuss | *(chat)* | After prime, before planning | building it up |
| **P** — Plan | `/generate-plan` | Once you know what you want built | uses the chat |
| Implement | `/execute-plan` | Plan approved | **clear first** |
| **V** — Verify | `/review-code` | Implementation done | **clear first** |
| Zoom out | `/decompose-feature` | Feature too big for one plan | fresh |

## Why the context boundaries matter

The two "clear your context" steps are not housekeeping — they're the mechanism that makes the loop
work:

- **Clear before implementing** → the plan proves it's complete. If the implementer can't build it
  from the plan alone, the plan had a gap, and you've found it now instead of in review.
- **Clear before reviewing** → the reviewer is genuinely independent. It can't be talked into "that's
  fine, here's why I did it that way," because it never heard the explanation. It only has the plan and
  the code.

## Related commands

These live one level up in `command-templates/` and complement the loop:

- `/create-prd` — write the project's source-of-truth PRD before decomposing features against it.
- `/commit` — atomic, conventional commit once a slice's gate is green.
- `retrospective/` — `/execution-report` → `/system-review` to turn repeated divergences into durable
  updates to CLAUDE.md, the plan template, and these commands.

---

`command-templates/piv-loop/` is the canonical source for these commands. Each stack template
(`templates/*/.claude/skills/`) carries specialized copies wired up as slash commands — edit behavior
here, then sync it out.
