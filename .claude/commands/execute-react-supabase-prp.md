# Execute React + Supabase PRP

Implement a PRP phase by phase with validation.

## Input: $ARGUMENTS

Path to PRP file (e.g., `PRPs/my-feature.md`)

## Process

1. **Load PRP** - Read completely, understand all phases

2. **Phase Execution**
   - Announce phase and files to create
   - Implement following vertical slice architecture
   - Validate phase completion

3. **Per-Phase Testing (CRITICAL)**

   | Phase | Run Tests? | Command |
   |-------|------------|---------|
   | Hooks | **YES** | `pnpm test src/features/[feature]/__tests__/use-*` |
   | Components | **YES** | `pnpm test src/features/[feature]/__tests__/` |
   | Routes | **YES** | `pnpm test --run` (full suite) |

   **Do NOT proceed if tests fail.**

4. **Final Validation**
   ```bash
   pnpm build
   pnpm tsc --noEmit
   pnpm biome check .
   pnpm test --run
   ```

## Architecture

```
features/[name]/
├── __tests__/
├── components/
├── hooks/
├── schemas/
├── types/
└── index.ts
```

**Import Rules:**
- Routes import from `@/features/[name]`
- Features import from `@/shared/*`
- Shared NEVER imports from features
