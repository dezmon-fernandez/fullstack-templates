# Deprecated

> This intake template was removed in favor of the PRD-first workflow.

Feature plans are now generated inline, aligned to `.agents/PRD.md`:

```bash
/generate-plan "<feature description>"     # Per-feature plan at .agents/plans/<feature>.md
/execute-plan .agents/plans/<feature>.md   # Implement
```

If a feature warrants PRD updates (new MVP scope, architecture decisions), update `.agents/PRD.md` first.

Safe to delete this file. Kept here as a redirect for muscle memory.
