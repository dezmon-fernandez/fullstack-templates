# Vertical Slice Architecture

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Decision Framework: Where Does Code Go?

```
New code to write?
│
├─ Does it exist before any features?
│  (config, database, logging, middleware)
│  └─→ core/ (or lib/)
│
├─ Used by 3+ features AND identical logic?
│  (base models, pagination, utilities)
│  └─→ shared/
│
├─ Feature-specific?
│  (business logic, domain models, endpoints)
│  └─→ Feature slice (features/{feature}/)
│
└─ Used by 1-2 features?
   └─→ Duplicate in each feature (wait for third)
```

## Core: Universal Infrastructure

Core contains infrastructure that exists **before** features and is **universal**. If removing every feature would still require this code, it goes in core.

[STACK-SPECIFIC: The directory may be called `core/`, `lib/`, `src/lib/`, etc.]

What belongs in core:
- Configuration / environment
- Database connection / client setup
- Logger setup
- Middleware (request logging, auth session refresh, CORS)
- Base exception classes
- Global dependencies / providers

What does NOT belong in core:
- Business logic
- Feature-specific error types, schemas, or types
- Anything that references a specific feature

## Shared: The Three-Feature Rule

**Code moves to shared when 3+ features need it. Until then, duplicate it.**

- One instance: feature-specific
- Two instances: might be coincidence
- Three instances: proven pattern worth abstracting

**Process:**
1. First feature: write the code inline
2. Second feature: duplicate it
3. Third feature: extract to shared, refactor all three

What belongs in shared:
- Base models / mixins used by all DB models
- Common schemas (pagination, standard response shapes)
- Generic utilities (string helpers, date formatting)
- External service clients used by 3+ features

What does NOT belong in shared:
- Business logic (even if two features have similar logic)
- Code with slight variations between features
- Feature-specific logic that happens to look similar

## Feature Slices

Each feature owns everything it needs.

[STACK-SPECIFIC: Feature structure — what files live in a feature for this stack.]

**Rules:**
- Routes/pages are thin — compose feature exports, don't implement logic
- Features can import from other features, shared, and core
- Shared and core never import from features
- Public API via barrel file (`index.ts` / `__init__.py`) — consumers never reach into internals

Not every feature needs every file. Start with the minimum, add files as the feature grows.

## Cross-Feature Patterns

When an operation spans multiple features, the owning feature orchestrates:

```typescript
// features/orders/actions/create-order.ts
import { getProduct } from '@/features/products'
import { reserveInventory } from '@/features/inventory'

export async function createOrder(data: CreateOrderInput) {
  for (const item of data.items) {
    const product = await getProduct(item.productId)
    if (!product) throw new NotFoundError('product', item.productId)
  }
  await reserveInventory(data.items)
  return await insertOrder(data)
}
```

- **Reading** from another feature: allowed, import through the barrel
- **Writing** to another feature's data: never directly — call the owning feature's public API

## Auth: Dual-Nature Pattern

Auth is both infrastructure and a feature:
- **Core/middleware**: Session refresh, `getCurrentUser` — used by every protected route
- **Feature**: Login, register, password reset — the auth slice itself

[STACK-SPECIFIC: How auth splits in this stack.]

## Infrastructure Setup Order

When scaffolding, set up in this order:
1. **Config** — everything depends on it
2. **Logger** — for debugging setup issues
3. **Database/client** — data layer
4. **Middleware** — request handling
5. **First feature** — proves the stack works end-to-end

## [STACK-SPECIFIC] Project Structure

> Replace with the actual project structure for this stack.

## [STACK-SPECIFIC] Feature Structure

> Replace with what a feature looks like in this stack.
