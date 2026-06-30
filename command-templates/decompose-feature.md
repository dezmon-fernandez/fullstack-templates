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

A slice is the right size when its plan is short and its result is one observable, testable change. A
slice that forces several unrelated decisions, or whose plan would sprawl, is two slices.

## Process

### Phase 1: Understand the feature

- Name the **keystone** — the one deliverable this feature exists to produce.
- Name the **inviolable property** — the correctness rule that must hold at every step. Take it from
  the repo's rules (CLAUDE.md) and PRD; do not invent it. The first slice proves it; every later
  slice preserves it.
- Establish user value, the systems touched, and a rough slice count.

### Phase 2: Map the current ground

Slices build on what exists, not on assumption. Before cutting, determine:

- What is already in place — modules, write paths, scaffolds, the existing regression floor.
- What is stubbed or missing.
- The seams the feature plugs into.

Read the codebase and the feature's design docs to establish this. As you go, note the files a
slice's plan will need to point its implementer at, and what each one is for.

### Phase 3: Cut the slices

- **Slice 1 proves the inviolable property** end to end with the fewest moving parts — the thinnest
  path that shows the keystone holds. Widen from there.
- **One architecture decision per slice.** A slice surfaces exactly one decision to review: a data
  shape, a key, a boundary, an idempotency rule. Bundle several and the review goes coarse; split
  them so each decision is weighed on its own.
- **Independent units before integrators.** Slices with no upstream dependency come first; the slice
  that wires them together comes last.
- **Separate pure logic from I/O.** A pure, testable core and its side-effecting shell are usually
  two slices.
- **Settle the irreversible early.** A decision that ripples through everything downstream — a key
  type every reference depends on — is made and reviewed before anything builds on it. A decision
  that can be reshaped later from data already in hand can wait.

### Phase 4: Sequence and check

- Order the slices by dependency; mark which are independent and which integrate others.
- Confirm each slice ends at a green gate and a shippable result.
- Confirm each slice carries exactly one architecture decision. A slice carrying several is split.
- For each slice, name the business rules and edge cases it must honor, so its plan specifies them.

## Output

Write the roadmap to `.agents/feature-ideas/<feature>-roadmap.md`:

```markdown
# <Feature> — execution roadmap

Each slice runs in its own session: `/prime`, read this roadmap, `/generate-plan-alt <the slice's
generate line>`, review and confirm the plan, `/execute-plan <plan>`, `/review-code <plan> <diff>`,
confirm the gate is green, then check the slice off and commit. One slice per session.

## Keystone
<the deliverable this feature produces; the inviolable property it must never break; the docs to read
before planning any slice, each with what it provides>

## Ground rules (every slice)
<the gate every slice must pass — lint, types, tests, the regression floor — and the repo rules the
feature must never violate>

## Slices
- [ ] **A** — <name> (independent)
- [ ] **B** — <name> (independent)
- [ ] **C** — <name> (integrates A and B)

---

### A — <name>
- **Generate with:** `/generate-plan-alt <terse statement of intent>`
- **Delivers:** <the single observable change>
- **Decision to review:** <the one architecture decision this slice surfaces>
- **Must honor:** <the business rules and edge cases this slice's plan has to specify>
- **Depends on:** <prior slices, or nothing> · **Enables:** <what this unlocks>
- **Regression floor:** <the test that pins this slice's result for good>
- **Done when:** <one observable, gate-green condition>

### B — <name>  (same shape)
### C — <name>  (same shape; integrator)

Filled example of one slice:

### pure core (independent)
- **Generate with:** `/generate-plan-alt pure function mapping <input> → <output>, no I/O`
- **Delivers:** a typed, tested pure function; no caller yet
- **Decision to review:** the return/result shape downstream depends on
- **Must honor:** the inviolable property; reject malformed input (fail loud)
- **Depends on:** nothing · **Enables:** the writer slice that persists its output
- **Regression floor:** known-input → known-output test + a fail-loud test
- **Done when:** importable, tests green

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
- [ ] Each slice names the business rules and edge cases its plan must specify.
- [ ] Each slice's generate line is a short statement of intent, not a spec.

## Report

- The slice count and the build order — which are independent, which integrate.
- The first slice to run.
- Any slice still carrying more than one decision; it needs splitting.
