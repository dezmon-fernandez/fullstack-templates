# Security Standards

> Base template — specialize for target stack. Replace `[STACK-SPECIFIC]` sections.

## Philosophy

Security is a system property, not a feature. Every template should be secure by default — developers shouldn't need to remember to "add security." The patterns below are the baseline, not extra credit.

## Input Validation

Validate **all** external input at the boundary where it enters your system. Internal code trusts validated data.

### Boundaries to Validate

| Boundary | What to Validate |
|----------|-----------------|
| Form submissions | All fields via Zod schema before processing |
| URL params / search params | Type, format, and range |
| API request bodies | Full schema validation |
| API responses (external) | Shape matches expected schema |
| File uploads | Type, size, name (never trust client-provided MIME type) |
| Webhook payloads | Signature verification + schema validation |

### Rules

- **Validate, don't sanitize.** Reject bad input rather than trying to clean it. Sanitization is error-prone.
- **Validate on the server.** Client validation is UX, not security. Always re-validate server-side.
- **Use Zod schemas as the single source of truth.** Define once, validate everywhere.
- **Fail closed.** If validation is ambiguous, reject the input.

```typescript
// Server Action / API route — always validate
const result = createItemSchema.safeParse(input)
if (!result.success) {
  return { error: result.error.flatten().fieldErrors }
}
// From here, result.data is safe to use
```

## Authentication

### Rules

- **Use `getUser()`, not `getSession()`** for server-side auth verification. `getSession()` reads from the JWT without verifying it — `getUser()` calls the Supabase auth server.
- **Check auth at the layout/middleware level**, not in individual pages or actions.
- **Never trust client-provided user IDs.** Always derive the user ID from the authenticated session server-side.
- **Token storage**: Use HTTP-only cookies (Supabase SSR handles this). Never store tokens in localStorage.

```typescript
// CORRECT — derive user from session
const { data: { user } } = await supabase.auth.getUser()
if (!user) throw new AuthenticationError()
const userId = user.id

// WRONG — trusting client-provided ID
const userId = formData.get('userId') // attacker can set this to anything
```

## Authorization

### Row Level Security (RLS)

RLS is the primary authorization mechanism for Supabase-backed apps. Every table with user data must have RLS enabled.

```sql
-- Enable RLS (do this for EVERY table)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Users can only read their own items
CREATE POLICY "Users read own items"
  ON items FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert items as themselves
CREATE POLICY "Users insert own items"
  ON items FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Rules

- **RLS returns empty arrays, not errors**, when blocking access. Always test that unauthorized users get empty results, not that they get errors.
- **Index every column used in RLS policies.** Unindexed RLS is the #1 silent performance killer.
- **Test RLS policies explicitly.** Use Supabase's `service_role` key to verify that policies work as expected.
- **Default deny.** If no policy exists for an operation, RLS blocks it. This is correct — add policies explicitly.

## Secrets Management

### Environment Variables

| Type | Convention | Access |
|------|-----------|--------|
| Public (client-safe) | `[STACK-SPECIFIC PREFIX]` (e.g., `NEXT_PUBLIC_`, `VITE_`) | Client + server |
| Private (server-only) | No prefix | Server only |
| Infrastructure | Managed by platform | Neither (CI/CD, hosting) |

### Rules

- **Never commit secrets.** `.env.local` is in `.gitignore`. Use `.env.example` with placeholder values.
- **Never log secrets.** See logging standards — structured logging prevents accidental interpolation.
- **Never expose server secrets to the client.** Check framework prefix rules.
- **Rotate compromised secrets immediately.** Supabase keys can be rotated in the dashboard.
- **Use the minimum privilege key.** `anon` key for client code, `service_role` only in trusted server-side code (never in Edge Functions exposed to users).

## [STACK-SPECIFIC] Server-Side Security

> Replace with:
> - CSRF protection (framework-provided or manual)
> - CORS configuration
> - Rate limiting approach
> - Server Action / API route security patterns
> - Middleware security checks

## [STACK-SPECIFIC] Client-Side Security

> Replace with:
> - XSS prevention (framework's built-in escaping, dangerouslySetInnerHTML rules)
> - Content Security Policy headers
> - Secure cookie configuration
> - Client-side route protection patterns

## [STACK-SPECIFIC] Headers

> Replace with:
> - Security headers to set (X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security, etc.)
> - Where to configure them (middleware, next.config, server config)

## Common Vulnerabilities to Avoid

| Vulnerability | Prevention |
|--------------|-----------|
| **SQL Injection** | Use Supabase client (parameterized queries). Never build SQL strings. |
| **XSS** | Framework auto-escapes JSX. Never use `dangerouslySetInnerHTML` with user content. |
| **CSRF** | Server Actions have built-in CSRF protection. API routes need manual CSRF tokens if cookie-based. |
| **IDOR** | Always filter by `auth.uid()` in queries and RLS policies. Never trust client-provided resource IDs for authorization. |
| **Mass Assignment** | Validate with Zod schema that only allows expected fields. Don't spread raw input into database calls. |
| **Open Redirect** | Validate redirect URLs against an allowlist. Don't redirect to user-provided URLs. |

## Dependency Security

- Run `pnpm audit` periodically (or in CI)
- Pin exact versions in templates to avoid supply chain surprises
- Prefer well-maintained packages with active security response
- Review new dependencies before adding — check GitHub issues, last publish date, maintainer reputation
