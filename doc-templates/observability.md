# Observability Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Observability answers: **"What is happening in production right now, and why?"** It's built on three pillars: **logs** (see `docs/logging.md`), **metrics**, and **traces**. You don't need all three from day one, but design so they can be added incrementally.

## Priority Order for MVPs

1. **Structured logging** (see `docs/logging.md`) — highest ROI, start here
2. **Health checks** — know if the app is up and can reach its dependencies
3. **Request metrics** — response times and error rates
4. **Business metrics** — signups, conversions, key user actions
5. **Distributed tracing** — add when you have multiple services or complex request flows

## Health Checks

Every deployable should expose a health endpoint.

### Liveness (`/healthz` or `/api/health`)

"Is the process running?" Returns 200 with minimal work. Used by orchestrators (k8s, ECS) to know if the process is alive.

```json
{ "status": "ok", "timestamp": "2025-01-15T10:30:00Z" }
```

### Readiness (`/readyz` or `/api/health/ready`)

"Can this instance serve traffic?" Checks critical dependencies.

```json
{
  "status": "ok",
  "checks": {
    "database": { "status": "ok", "latency_ms": 12 },
    "supabase": { "status": "ok" }
  }
}
```

If any critical check fails, return 503. Non-critical dependencies (cache, email) can be degraded without failing readiness.

### Rules

- Health checks must not have side effects
- Timeout dependency checks (2-3s max)
- Cache dependency check results briefly (5-10s) to avoid hammering downstream
- Don't require authentication on health endpoints

## Request Metrics

Track these for every HTTP handler:

| Metric | Type | Description |
|--------|------|-------------|
| `http_requests_total` | Counter | Total requests by method, path, status |
| `http_request_duration_ms` | Histogram | Response time distribution |
| `http_requests_in_flight` | Gauge | Currently processing requests |

### What to Alert On

- **Error rate** > threshold (e.g., 5xx > 1% for 5 minutes)
- **Latency** p95 or p99 above SLO (e.g., p95 > 500ms)
- **Health check** failures (readiness returning 503)

## Business Metrics

Track key user actions as structured log events or explicit metrics:

```typescript
// As structured log (good starting point)
logger.info("user_signed_up", { userId, method: "email", plan: "free" })

// As explicit metric (when you need aggregation/alerting)
metrics.increment("user.signup", { method: "email", plan: "free" })
```

Choose metrics that answer: "Is the product working for users?" Not vanity metrics.

## Correlation IDs

Every inbound request gets a unique ID. Pass it through all downstream calls and include it in every log line.

```
[requestId=abc-123] order created { userId: "u1", orderId: "o1" }
[requestId=abc-123] payment initiated { orderId: "o1", provider: "stripe" }
[requestId=abc-123] payment succeeded { orderId: "o1", duration_ms: 340 }
```

This lets you reconstruct the full lifecycle of any request.

### Implementation Pattern

1. Extract or generate ID in middleware (`x-request-id` header or UUID)
2. Store in request-scoped context
3. Logger automatically includes it in every log line

[STACK-SPECIFIC: How to implement — middleware setup, context storage mechanism, logger integration]

## [STACK-SPECIFIC] Instrumentation Setup

> Replace with:
> - Which metrics/tracing library (if any) — OpenTelemetry, Prometheus client, Vercel Analytics, etc.
> - Middleware for automatic request metrics
> - How to add custom metrics
> - Integration with hosting platform's observability (Vercel, Supabase dashboard)

## [STACK-SPECIFIC] Client-Side Observability

> Replace with:
> - Error tracking (Sentry, LogRocket, or built-in)
> - Web Vitals collection (CLS, LCP, FID/INP)
> - How client errors flow back to your logging/alerting system

## Supabase Observability

Applies across all Supabase-backed templates:

- **Dashboard**: Supabase provides built-in metrics for API requests, auth events, database stats, and Edge Function invocations
- **Database**: Use `pg_stat_statements` for slow query identification
- **Edge Functions**: Logs available in Supabase dashboard; use structured logging inside functions
- **RLS performance**: Index all columns used in RLS policies — unindexed RLS is the #1 silent perf killer
- **Connection pooling**: Monitor active connections via Supabase dashboard; use connection pooler URL for serverless

## When to Add What

| Stage | Add |
|-------|-----|
| **Day 1** | Structured logging, health check endpoint |
| **First users** | Error tracking (client + server), basic request metrics |
| **Growing** | Business metrics, alerting on error rate/latency |
| **Scaling** | Distributed tracing, detailed performance monitoring |

Don't build observability infrastructure before you need it. Start with logs and a health check, add layers as the product grows.
