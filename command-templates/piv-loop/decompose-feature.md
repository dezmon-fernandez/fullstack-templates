---
description: "Decompose a feature into a phased roadmap of granular, dependency-ordered slices — each a single unit of work for one planning and implementation session"
argument-hint: [feature, PRD section, or feature-idea doc]
---

# Decompose a feature into granular slices

## Feature: $ARGUMENTS

## Mission

Break a feature into a phased roadmap of granular slices and the order to build them. Each slice is a
single unit of work: one architecture decision to make, small enough to plan and implement in one
session, large enough to ship and stand on its own. The roadmap is built one slice per session, so
each session plans against what the previous one actually landed rather than a guess made up front.

A slice entry says **what it develops, the problem it solves, and any constraints it must respect** —
and stops there. It does not specify signatures, data shapes, enums, file-level design, or tests:
deciding *how* to build a slice is the plan's job (`/piv-loop:generate-plan`), and the plan discovers
what to read on its own. Write each entry to be **read at a glance** — plain language, one idea per
line, the deliverable first. Human readability is the point: if a slice needs a wall of detail to
describe, it is either two slices or you have started planning it.

A slice is the right size when its plan is short and its result is one observable, testable change. A
slice that forces several unrelated decisions, or whose entry drifts into implementation, is two
slices — or a plan wearing a roadmap's clothes.

## Process

### Phase 1: Understand the feature

- Name the **keystone** — the one deliverable this feature exists to produce.
- Name the **inviolable property** — the correctness rule that must hold at every step. Take it from
  the repo's rules (CLAUDE.md) and PRD; do not invent it. The first slice proves it; every later
  slice preserves it.
- Note the **docs to read before planning** — the design/PRD sections a slice's plan should start
  from. This is a roadmap-level callout in the Keystone, not a per-slice field.
- Establish user value, the systems touched, and a rough slice count.

### Phase 2: Map the current ground

Slices build on what exists, not on assumption. Before cutting, determine:

- What is already in place — modules, write paths, scaffolds, the existing regression floor.
- What is stubbed or missing.
- The seams the feature plugs into.

Read the codebase and the feature's design docs — enough to cut the slices at real boundaries. What
you learn shapes the *sequencing*; it does not become slice-level implementation notes.

### Phase 3: Cut the slices

- **Slice 1 proves the inviolable property** end to end with the fewest moving parts — the thinnest
  path that shows the keystone holds. Widen from there.
- **One architecture decision per slice.** A slice surfaces exactly one decision to weigh: a data
  shape, a key, a boundary, an idempotency rule. Bundle several and the review goes coarse; split them.
- **Independent units before integrators.** Slices with no upstream dependency come first; the slice
  that wires them together comes last.
- **Separate pure logic from I/O.** A pure, testable core and its side-effecting shell are usually
  two slices.
- **Settle the irreversible early.** A decision that ripples through everything downstream — a key
  type every reference depends on — is made and reviewed before anything builds on it. A decision
  that can be reshaped later from data already in hand can wait.

### Phase 4: Sequence and check

- Order the slices by dependency; mark which are independent and which integrate others.
- Confirm each slice carries exactly one architecture decision, ends shippable, and ends at a green
  gate. A slice carrying several decisions is split.
- Confirm each entry stays at the develops / problem / constraints altitude — no signatures, data
  shapes, enums, or tests have crept in. If they have, that content belongs in the plan, not here.

## Output

Write the roadmap to `.agents/feature-ideas/<feature>-roadmap.md`:

```markdown
# <Feature> — execution roadmap

Each slice runs in its own session: `/piv-loop:prime`, read this roadmap, `/piv-loop:generate-plan
<the slice's line>`, review and confirm the plan, `/piv-loop:execute-plan <plan>`,
`/piv-loop:review-plan-code <plan> <diff>`, confirm the gate is green, then check the slice off and
commit. One slice per session.

## Keystone
<the deliverable this feature produces; the inviolable property it must never break; the docs to read
before planning any slice, each with what it provides>

## Ground rules (every slice)
<the repo rules the feature must never violate; every slice preserves the inviolable property and ends
shippable, gate-green (lint · types · tests, plus a regression-floor test that pins its result)>

## Slices
- [ ] **A** — <name> (independent)
- [ ] **B** — <name> (independent)
- [ ] **C** — <name> (integrates A and B)

---

### A — <name>  (independent)
- **Develops:** <the one capability this slice adds — the functionality, in plain language>
- **Solves:** <the problem this slice removes; why it exists>
- **Constraints:** <any invariant or rule the slice must respect — behavior that must hold, not how to
  build it; omit if none>
- **Depends on:** <prior slices, or nothing> · **Enables:** <what this unlocks>

### B — <name>  (same shape)
### C — <name>  (same shape; integrator)

Filled example of one slice:

### pure core (independent)
- **Develops:** a typed, tested pure function mapping <input> → <output>; no caller yet.
- **Solves:** downstream slices need a trustworthy primitive to build on before any I/O exists.
- **Constraints:** no I/O, no DB, no network; malformed input fails loud.
- **Depends on:** nothing · **Enables:** the writer slice that persists its output.

---

## Sequencing questions
<decisions left to the moment a specific slice is planned — each with the current best answer and the
doc that settles it>
```

## Quality criteria

- [ ] The keystone and inviolable property trace to the repo's rules and PRD.
- [ ] Slice 1 proves the inviolable property end to end.
- [ ] Each slice carries one architecture decision, ends shippable, and ends gate-green.
- [ ] Slices are ordered by dependency; irreversible decisions are settled first.
- [ ] Each entry says what it develops, the problem it solves, and its constraints — and stops there.
      No signatures, data shapes, enums, file design, or tests (those are the plan's).
- [ ] Each entry reads at a glance: plain language, one idea per line, deliverable first.

## Report

- The slice count and the build order — which are independent, which integrate.
- The first slice to run.
- Any slice still carrying more than one decision, or drifted into implementation detail — it needs
  splitting or trimming.
