# Testing Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Tests exist to **catch regressions and document behavior**, not to hit a coverage number. Write tests that would catch real bugs. Skip tests that just mirror the implementation.

## What to Test

### Always Test

- **Business logic** — calculations, transformations, state machines, validation rules
- **Data fetching hooks** — correct data returned, loading/error states, cache behavior
- **User interactions** — forms, buttons, navigation flows that affect data
- **Edge cases** — empty states, error states, boundary values, permissions

### Skip

- **Trivial rendering** — a component that just renders props with no logic
- **Third-party code** — don't test that shadcn Button renders a button
- **Implementation details** — internal state, private methods, how many times a function was called
- **Styles** — unless visual regression testing is set up

### Gray Area (Use Judgment)

- **Integration between features** — test if the integration is complex or fragile
- **API response handling** — test if you transform the response, skip if you just pass it through

## Test Structure

### File Organization

Tests live in `__tests__/` within each feature, mirroring source files:

```
features/orders/
├── __tests__/
│   ├── use-orders.test.ts        # Hook tests
│   ├── OrderList.test.tsx        # Component tests
│   └── order.schema.test.ts     # Schema/validation tests
├── components/
│   └── OrderList.tsx
├── hooks/
│   └── use-orders.ts
└── schemas/
    └── order.schema.ts
```

### Test Naming

```typescript
describe('useOrders', () => {
  it('returns orders for the current user', () => { ... })
  it('returns empty array when user has no orders', () => { ... })
  it('throws when user is not authenticated', () => { ... })
})
```

- `describe` = the unit being tested (function, component, hook)
- `it` = a specific behavior, written as a sentence that reads naturally
- Don't prefix with "should" — `it('returns...')` not `it('should return...')`

### AAA Pattern

```typescript
it('calculates order total with tax', () => {
  // Arrange — set up test data
  const items = [
    { name: 'Widget', price: 10, quantity: 2 },
    { name: 'Gadget', price: 25, quantity: 1 },
  ]
  const taxRate = 0.08

  // Act — call the thing being tested
  const total = calculateOrderTotal(items, taxRate)

  // Assert — verify the result
  expect(total).toBe(48.60)
})
```

Keep each section small. If Arrange is 20+ lines, extract a factory or fixture.

## Testing Patterns

### Component Tests

Test behavior, not markup:

```typescript
// BAD — testing implementation
expect(screen.getByTestId('order-list')).toHaveClass('grid-cols-2')

// GOOD — testing behavior
await user.click(screen.getByRole('button', { name: /add to cart/i }))
expect(screen.getByText('1 item in cart')).toBeInTheDocument()
```

Use `@testing-library/user-event` over `fireEvent` — it simulates real user behavior (focus, blur, input events).

### Hook Tests

Use `renderHook` from `@testing-library/react`:

```typescript
import { renderHook, waitFor } from '@testing-library/react'

it('fetches orders on mount', async () => {
  const { result } = renderHook(() => useOrders(), { wrapper: TestProviders })

  await waitFor(() => {
    expect(result.current.data).toHaveLength(3)
  })
})
```

### Validation Schema Tests

Test Zod schemas directly — they're pure functions:

```typescript
describe('orderSchema', () => {
  it('accepts valid order', () => {
    const result = orderSchema.safeParse({ title: 'Test', quantity: 1 })
    expect(result.success).toBe(true)
  })

  it('rejects empty title', () => {
    const result = orderSchema.safeParse({ title: '', quantity: 1 })
    expect(result.success).toBe(false)
  })

  it('rejects negative quantity', () => {
    const result = orderSchema.safeParse({ title: 'Test', quantity: -1 })
    expect(result.success).toBe(false)
  })
})
```

## Mocking

### Rules

- **Mock at boundaries** — external APIs, databases, third-party services
- **Don't mock what you own** — if you're mocking your own code extensively, the design may need work
- **Keep mocks simple** — return static data, don't re-implement logic in mocks
- **Reset mocks between tests** — prevent state leakage

### Supabase Mocking

```typescript
// Simple mock for unit tests
vi.mock('@/shared/utils/supabase', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValue({
        data: [{ id: '1', title: 'Test' }],
        error: null,
      }),
    }),
  },
}))

// For integration tests, prefer Supabase local (supabase start)
```

## [STACK-SPECIFIC] Test Runner Configuration

> Replace with:
> - Vitest/Jest configuration specifics
> - Test setup file contents (providers, global mocks)
> - Environment setup (jsdom, happy-dom, node)
> - Path alias configuration for tests

## [STACK-SPECIFIC] Component Test Setup

> Replace with:
> - Required providers wrapper (router, query client, auth context)
> - How to test server components vs client components
> - Route testing patterns
> - Form testing patterns with the specific form library

## [STACK-SPECIFIC] Per-Phase Testing

> Replace with the stack's testing phases:
> - When to run which tests during development
> - Commands for running specific test subsets
> - CI test pipeline

## Test Quality Checklist

Before submitting tests:

- [ ] Tests fail when the behavior they cover is broken (try it)
- [ ] Tests don't depend on each other or on execution order
- [ ] No `sleep` or arbitrary timeouts — use `waitFor` or polling
- [ ] Mock data is realistic (valid UUIDs, real-looking emails, sensible dates)
- [ ] Each test has a single clear assertion focus (may have multiple `expect` calls)
- [ ] Test names describe the behavior, not the implementation
