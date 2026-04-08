# Logging Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Logs exist for three audiences: **developers debugging locally**, **operators monitoring production**, and **on-call engineers triaging incidents**. Every log line should serve at least one. Logs are also the foundation of observability — structured event names make logs searchable, alertable, and parseable by both humans and machines.

## Event Naming: Hybrid Dotted Namespace Pattern

**Pattern:** `{domain}.{component}.{action}_{state}`

Where:
- **domain**: Top-level category (application, request, database, external, system)
- **component**: Subsystem or feature (lifecycle, http, connection, etc.)
- **action_state**: Descriptive operation with state using snake_case

**Examples:**
- `application.lifecycle.started`
- `request.http_received`
- `database.connection_initialized`
- `user.registration_completed`
- `external.api.call_failed`

### Why This Pattern

1. **OpenTelemetry compliant** — follows official semantic conventions
2. **Scalable hierarchy** — supports multi-level event taxonomies
3. **Grep-friendly** — search with `grep "database\."` or `grep "_failed"`
4. **State machine tracking** — natural expression of lifecycle transitions
5. **Industry standard** — matches Elastic, OTel, LangChain, AWS patterns

### Depth Guidelines

- **Level 1 (Domain):** Broad system category — `request`, `database`, `user`
- **Level 2 (Component):** Specific subsystem — `http`, `connection`, `auth`
- **Level 3 (Operation):** Detailed action — `execution_started`, `call_completed`
- **Level 4 (Optional):** Sub-operation — use sparingly

**Maximum recommended depth:** 4 levels. **Minimum:** 3 levels.

## Standard States

Use these state suffixes consistently across all domains:

| State | Usage | Example |
|-------|-------|---------|
| `_started` | Operation initiated | `order.process_started` |
| `_progress` | Operation in progress | `order.process_progress` |
| `_completed` | Operation successful | `order.process_completed` |
| `_failed` | Operation failed | `order.process_failed` |
| `_validated` | Validation passed | `input.schema_validated` |
| `_rejected` | Validation failed | `input.schema_rejected` |
| `_retrying` | Retry attempt | `external.api.call_retrying` |
| `_cancelled` | Operation cancelled | `request.http_cancelled` |
| `_timeout` | Operation timed out | `request.http_timeout` |
| `_received` | Event received | `request.http_received` |
| `_sent` | Event sent | `notification.email_sent` |

## Log Levels

| Level | When to Use | Example Event |
|-------|-------------|---------------|
| **error** | Something failed that shouldn't have. Requires attention. | `database.connection_failed`, `order.payment_failed` |
| **warn** | Something unexpected happened but was handled. May need attention. | `external.api.rate_limited`, `request.validation_failed` |
| **info** | Significant business events. The "what happened" trail. | `user.registration_completed`, `order.process_completed` |
| **debug** | Developer details. Never in production by default. | `database.query_executed`, `request.http_processing` |

### Rules

- **error** = pages someone or needs a fix. Don't use for expected failures (validation errors, 404s).
- **warn** = worth investigating in aggregate, not individually.
- **info** = if you had to reconstruct what happened from logs alone, these are the lines you'd need.
- **debug** = anything else useful during development.

## Structured Logging

Always use structured key-value pairs, not string interpolation.

```typescript
// BAD — string interpolation
logger.info(`User ${userId} created order ${orderId} for $${amount}`)

// GOOD — structured event with attributes
logger.info("order.create_completed", { userId, orderId, amount, currency })
```

### Why Structured

- Searchable in log aggregators (filter `orderId=abc` across all services)
- Parseable by alerting rules
- No injection risk from user-provided values in message strings

## Event Taxonomy

### Application Domain

```
application.
├── lifecycle.started          # Application started successfully
├── lifecycle.stopped          # Application shut down gracefully
├── config.loaded              # Configuration loaded successfully
├── config.validation_failed   # Configuration validation error
└── initialization_failed      # Fatal startup error
```

### Request Domain

```
request.
├── http_received              # Request received
├── http_completed             # Request completed successfully
├── http_failed                # Request failed with error
├── validation_failed          # Request validation error
├── rate_limited               # Rate limit exceeded
└── timeout_exceeded           # Request timeout
```

### Database Domain

```
database.
├── connection_initialized     # Connection pool initialized
├── connection_failed          # Connection failed
├── query_executed             # Query executed successfully
├── query_failed               # Query execution failed
├── migration_started          # Migration started
├── migration_completed        # Migration completed
├── migration_failed           # Migration failed
├── health_check_passed        # Health check successful
└── health_check_failed        # Health check failed
```

### External Domain

```
external.
├── api.call_started           # External API call started
├── api.call_completed         # API call completed
├── api.call_failed            # API call failed
├── api.rate_limited           # External rate limit hit
├── webhook.received           # Webhook received
├── webhook.processed          # Webhook processed
└── webhook.failed             # Webhook processing failed
```

### Feature Domains

Use the feature name as domain for business logic:

```
user.
├── registration_started       # User registration initiated
├── registration_completed     # User registered successfully
├── login_completed            # Login successful
├── login_failed               # Login failed
└── account_deleted            # Account deletion completed

order.
├── process_started            # Order processing started
├── payment_completed          # Payment processed
├── fulfillment_started        # Fulfillment initiated
├── process_completed          # Order completed
└── process_failed             # Order processing failed
```

## Required Log Attributes

### All Logs (automatic via logger setup)
- `timestamp` — ISO 8601
- `level` — Log level
- `requestId` — Correlation ID (automatic via middleware)

### Request Logs
- `method` — HTTP method
- `path` — Request path
- `statusCode` — Response status
- `durationMs` — Request duration in milliseconds

### Error Logs
- `error` — Error message
- `errorType` — Error class/constructor name
- `retryable` — Whether error is retryable (boolean)
- `retryCount` — Number of retry attempts (if applicable)

### External API Logs
- `provider` — Service name (stripe, supabase, openai)
- `endpoint` — API endpoint
- `statusCode` — Response status
- `durationMs` — Call duration

## What to Log

### Always Log

- **Request boundaries**: `request.http_received` and `request.http_completed` with method/path/status/duration
- **Authentication events**: `user.login_completed`, `user.login_failed`, `user.token_refreshed`
- **Business transactions**: `order.create_completed`, `user.registration_completed` with entity IDs
- **External calls**: `external.api.call_completed` with provider/endpoint/status/duration
- **Errors**: With full context (what was being attempted, relevant IDs)

### Never Log

- **Secrets**: Passwords, tokens, API keys, session IDs
- **PII without purpose**: Email addresses, names, IP addresses (unless required and compliant)
- **Request/response bodies in full**: Log relevant fields, not entire payloads
- **High-frequency noise**: Per-item loop iterations, cache checks, routine healthchecks

## Logging Patterns

### Lifecycle Pattern

```typescript
logger.info("order.process_started", { orderId, userId })

try {
  // ... processing ...
  logger.info("order.payment_completed", { orderId, amount, provider: "stripe" })
  logger.info("order.process_completed", { orderId, durationMs })
} catch (error) {
  logger.error("order.process_failed", {
    orderId,
    error: error.message,
    errorType: error.constructor.name,
    retryable: isRetryable(error),
  })
  throw error
}
```

### Error Logging

When logging errors, always include:

1. **What was being attempted** (the event name says this)
2. **Relevant entity IDs** (userId, orderId, etc.)
3. **The error itself** (message + type)
4. **Whether it was handled** (retryable, retryCount)

```typescript
// BAD
logger.error("Error", { error })

// GOOD
logger.error("external.api.call_failed", {
  provider: "stripe",
  endpoint: "/v1/charges",
  orderId,
  error: error.message,
  errorType: error.constructor.name,
  retryable: true,
  retryCount: 2,
})
```

## Context Propagation

Every log line in a request should share a **correlation ID** (requestId) so you can trace a request end-to-end.

```
[requestId=abc-123] request.http_received { method: "POST", path: "/api/orders" }
[requestId=abc-123] order.process_started { orderId: "o1" }
[requestId=abc-123] order.payment_completed { orderId: "o1", amount: 99.99 }
[requestId=abc-123] request.http_completed { statusCode: 201, durationMs: 340 }
```

[STACK-SPECIFIC: How to propagate request context — middleware injection, AsyncLocalStorage, request-scoped context, etc.]

## Query Patterns

### Grep Examples

```bash
# All database events
grep '"event":"database\.' logs.json

# All failures across system
grep '_failed"' logs.json

# Specific request trace
grep '"requestId":"abc-123"' logs.json

# Performance issues (>1000ms)
cat logs.json | jq 'select(.durationMs > 1000)'

# Error rate by domain
cat logs.json | jq -r 'select(.level == "error") | .event' | cut -d'.' -f1 | sort | uniq -c
```

## [STACK-SPECIFIC] Logger Setup

> Replace this section with:
> - Which logging library to use (pino, winston, console wrapper, built-in)
> - How to configure it (dev vs production format — pretty print vs JSON)
> - Where the logger instance lives in the project
> - How to import and use it
> - How requestId gets injected automatically

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

## Do's and Don'ts

### Do
- Use structured logging with key-value attributes
- Follow the `domain.component.action_state` naming pattern
- Include context (IDs, values, durations) in every log
- Log lifecycle events (started, completed, failed)
- Include performance metrics (durationMs)
- Log business-relevant events at info level

### Don't
- Use string interpolation in event names
- Log sensitive data (passwords, tokens, PII)
- Spam logs in tight loops (aggregate instead)
- Use vague event names ("processing", "handling", "error")
- Mix naming patterns across the codebase
- Skip error context
- Create hierarchies deeper than 4 levels
