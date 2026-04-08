# Coding Standards

> This entire file should be specialized for the target stack. The sections below define the structure — replace all content with framework-specific conventions, examples, and rules during planning/execution. A Next.js template and a Python agent template will look completely different.

## [STACK-SPECIFIC] Naming Conventions

> Replace with the stack's actual naming conventions for files, directories, variables, functions, types, constants. Include a table mapping each code element to its convention with real examples from this stack.

## [STACK-SPECIFIC] Type System

> Replace with the stack's type system rules:
> - TypeScript: strict mode, no `any`, `z.infer`, explicit return types, `satisfies`
> - Python: type hints, mypy/pyright config, Pydantic models
> - Go: interface conventions, error returns
> Include the actual config (tsconfig, mypy settings, etc.) and real code examples.

## [STACK-SPECIFIC] Import / Module Conventions

> Replace with how this stack organizes imports:
> - Path aliases, import ordering
> - Named vs default exports
> - `type` imports (TypeScript)
> - Circular dependency prevention
> Include a real import block showing the conventions.

## Functions

These apply across all stacks:

- **Keep functions short.** ~30 lines max, extract a helper beyond that.
- **Single responsibility.** If the name has "and", split it.
- **Early returns** over nested conditionals. Guard clauses at the top.
- **Limit parameters to 3.** Use an options object / dataclass / struct for more.

[STACK-SPECIFIC: Add a before/after code example in this stack's language showing the early return pattern.]

## Components

These apply to UI stacks. Remove this section for non-UI stacks (agents, CLI tools, APIs).

- **One component per file** for anything non-trivial.
- **Props interfaces** defined in the same file, above the component.
- **Destructure props** in the function signature.
- **Handle all states**: loading, error, empty, success.
- **Colocate** — keep components near the feature that uses them, not in a global folder (except shared UI like shadcn).

[STACK-SPECIFIC: Component patterns for this framework — server vs client components, directive usage, lifecycle hooks, state management, rendering patterns. Include real code examples.]

## Comments

- **Don't comment what the code does** — the code says that.
- **Do comment why** — business rules, non-obvious constraints, workarounds.
- **Delete commented-out code.** Git has history.

[STACK-SPECIFIC: TODO format, doc comment conventions (JSDoc, docstrings, GoDoc, etc.)]

## Dependencies

- **Pin exact versions** in templates. Users can loosen after scaffolding.
- **Minimize dependencies.** Before adding a package: can a 10-line utility do the job?
- **Audit before adding.** Check bundle size, maintenance status, community standard.

[STACK-SPECIFIC: Package manager conventions, lockfile handling, dependency grouping (runtime vs dev vs peer)]

## [STACK-SPECIFIC] Linting and Formatting

> Replace with the stack's linter/formatter config, auto-fix commands, and pre-commit hooks. Include the actual config file contents or key settings.

## [STACK-SPECIFIC] Framework-Specific Patterns

> Replace with patterns unique to this framework that don't fit elsewhere:
> - Data fetching conventions (server components, loaders, hooks, decorators)
> - Routing patterns
> - State management approach
> - Server/client boundaries
> - Build and bundling considerations
