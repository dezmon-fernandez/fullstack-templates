# New Feature: [Feature Name]

> Fill this out, then run: `/generate-next-supabase-prp PRPs/FEATURE.md`

## Feature Overview
**Name**: [Feature name]
**Description**: [What does this feature do?]
**User Story**: As a [user type], I want to [action] so that [benefit]

## Affected Slices
Which existing feature slices does this touch?
- [ ] Creates new slice: `[slice-name]`
- [ ] Modifies: `[existing-slice]`
- [ ] Modifies: `[another-slice]`

## Database Changes
- [ ] New table(s): [table names]
- [ ] New columns: [table.column]
- [ ] New RLS policies: [describe]
- [ ] No database changes

## Rendering Configuration
| Route | Rendering | SEO Required? | Why? |
|-------|-----------|---------------|------|
| `/[route]` | [SSG/SSR/ISR/Dynamic] | [Yes/No] | [Reason] |

**Rendering Modes:**
- `SSG` - Pre-rendered at build time, fastest (use for rarely-changing content)
- `SSR` - Rendered per request (use for personalized or frequently-changing content)
- `ISR` - Static with timed revalidation (use for content that changes periodically)
- `Dynamic` - Forced dynamic, no caching (use for real-time data, auth-dependent content)

## Server Actions Needed
List the Server Actions this feature requires:
- [ ] `fetch[Items]` - Read, public/protected
- [ ] `fetch[Item]` - Read with ID, public/protected
- [ ] `create[Item]` - Mutation, protected
- [ ] `update[Item]` - Mutation, protected
- [ ] `delete[Item]` - Mutation, protected

## SEO Requirements
Does this feature need SEO optimization?

- [ ] **Yes** - Fill out below:
  - Title format: `[Dynamic Title] | [App Name]`
  - Meta description: [What should it say?]
  - Open Graph tags: [Yes/No]
  - Structured data (JSON-LD): [Yes/No, what type?]
- [ ] **No** - Internal/dashboard feature

## Components Needed
- [ ] [ComponentName] - [Description] - [Server/Client Component]
- [ ] [ComponentName] - [Description] - [Server/Client Component]
- [ ] [ComponentName] - [Description] - [Server/Client Component]

## Dependencies
New packages needed:
- [ ] None
- [ ] [package-name] - [why]

## Acceptance Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## Example: User Profile Feature

### Feature Overview
**Name**: User Profile
**Description**: Allow users to view and edit their profile information
**User Story**: As a user, I want to update my profile so that my information is current

### Affected Slices
- [x] Creates new slice: `profile`
- [ ] Modifies: -

### Database Changes
- [x] New table(s): `profiles`
- [ ] New columns: -
- [x] New RLS policies: Users can only read/update their own profile

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Rendering Configuration
| Route | Rendering | SEO Required? | Why? |
|-------|-----------|---------------|------|
| `/profile` | Dynamic | No | Private page, auth-dependent |
| `/users/[userId]` | SSR | Yes | Public profile, needs SEO |

### Server Actions Needed
- [x] `fetchProfile` - Read, protected (own profile)
- [x] `fetchPublicProfile` - Read with userId, public
- [x] `updateProfile` - Mutation, protected

### SEO Requirements
- [x] **Yes** - For public profile pages:
  - Title format: `{display_name}'s Profile | MyApp`
  - Meta description: `{bio}` (first 160 chars)
  - Open Graph tags: Yes (for social sharing)
  - Structured data: Yes (Person schema)
- [ ] **No**

### Components Needed
- [x] ProfileForm - Edit profile form with avatar upload - Client Component
- [x] ProfileCard - Display profile information - Server Component
- [x] AvatarUpload - Handle avatar image upload to Supabase Storage - Client Component

### Dependencies
- [ ] None (using existing Supabase Storage)

### Acceptance Criteria
- [x] User can view their profile at `/profile`
- [x] User can edit display name, bio, and avatar
- [x] Public profiles are accessible at `/users/[userId]`
- [x] Public profiles have proper SEO meta tags
- [x] Avatar uploads work with Supabase Storage
- [x] Profile changes are immediately reflected (no page refresh)
