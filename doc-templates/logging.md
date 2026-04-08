# Logging Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Logs exist for three audiences: **developers debugging locally**, **operators monitoring production**, and **on-call engineers triaging incidents**. Every log line should serve at least one.

## Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| **error** | Something failed that shouldn't have. Requires attention. | Payment processing failed, database connection lost |
| **warn** | Something unexpected happened but was handled. May need attention. | Rate limit approaching, deprecated API called, retry succeeded |
| **info** | Significant business events. The "what happened" trail. | User signed up, order placed, migration completed |
| **debug** | Developer details. Never in production by default. | Query params, intermediate state, cache hit/miss |

### Rules

- **error** = pages someone or needs a fix. Don't use for expected failures (validation errors, 404s).
- **warn** = worth investigating in aggregate, not individually.
- **info** = if you had to reconstruct what happened from logs alone, these are the lines you'd need.
- **debug** = anything else useful during development.

## Structured Logging

Always use structured key-value pairs, not string interpolation.

```
// BAD
logger.info(`User ${userId} created order ${orderId} for $${amount}`)

// GOOD
logger.info("order created", { userId, orderId, amount, currency })
```

### Why Structured

- Searchable in log aggregators (filter `orderId=abc` across all services)
- Parseable by alerting rules
- No injection risk from user-provided values in message strings

## What to Log

### Always Log

- **Request boundaries**: Incoming request method/path, response status/duration
- **Authentication events**: Login, logout, token refresh, failed auth attempts
- **Business transactions**: Created/updated/deleted domain entities with IDs
- **External calls**: Outbound API calls with method/url/status/duration
- **Errors**: With full context (what was being attempted, relevant IDs, stack trace)

### Never Log

- **Secrets**: Passwords, tokens, API keys, session IDs
- **PII without purpose**: Email addresses, names, IP addresses (unless required for the feature and compliant with privacy policy)
- **Request/response bodies in full**: Log relevant fields, not entire payloads
- **High-frequency noise**: Per-item loop iterations, cache checks, routine healthchecks

## Context Propagation

Every log line in a request should share a **correlation ID** so you can trace a request end-to-end.

[STACK-SPECIFIC: How to propagate request context — middleware injection, AsyncLocalStorage, request-scoped context, etc.]

## Error Logging

When logging errors, always include:

1. **What was being attempted** (not just "an error occurred")
2. **Relevant entity IDs** (user, order, resource)
3. **The error itself** (message + stack for unexpected errors)
4. **Whether it was handled** (retried? returned to user? swallowed?)

```
// BAD
logger.error("Error", { error })

// GOOD
logger.error("failed to process payment", {
  userId,
  orderId,
  paymentMethod: "stripe",
  error: error.message,
  stack: error.stack,
})
```

## [STACK-SPECIFIC] Logger Setup

> Replace this section with:
> - Which logging library to use (pino, winston, console wrapper, built-in)
> - How to configure it (dev vs production format)
> - Where the logger instance lives in the project
> - How to import and use it

## [STACK-SPECIFIC] Where Logging Happens

> Replace this section with stack-specific guidance:
> - Server-side: middleware, API routes/server actions, background jobs
> - Client-side: error boundaries, failed API calls (if applicable)
> - Edge/serverless considerations
> - Supabase Edge Functions

## Performance

- Don't construct expensive log payloads unless the level is enabled
- Avoid logging inside tight loops — aggregate and log summary
- In client-side code, minimize logging to errors and critical warnings
- Use sampling for high-throughput info logs in production if needed
