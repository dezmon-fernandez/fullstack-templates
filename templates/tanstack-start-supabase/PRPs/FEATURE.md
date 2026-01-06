# New Feature: [Feature Name]

> Fill this out, then run: `/generate-tanstack-start-prp PRPs/FEATURE.md`

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

## SSR Configuration
| Route | SSR Mode | SEO Required? | Why? |
|-------|----------|---------------|------|
| `/[route]` | [Full/Data-only/Client] | [Yes/No] | [Reason] |

**SSR Modes:**
- `Full` (ssr: true) - Best for SEO, server renders HTML
- `Data-only` (ssr: 'data-only') - Server fetches, client renders
- `Client` (ssr: false) - For browser-only features (canvas, WebRTC, etc.)

## Server Functions Needed
List the server functions this feature requires:
- [ ] `fetch[Items]` - GET, public/protected
- [ ] `fetch[Item]` - GET with ID, public/protected
- [ ] `create[Item]` - POST, protected
- [ ] `update[Item]` - POST, protected
- [ ] `delete[Item]` - POST, protected

## SEO Requirements
Does this feature need SEO optimization?

- [ ] **Yes** - Fill out below:
  - Title format: `[Dynamic Title] | [App Name]`
  - Meta description: [What should it say?]
  - Open Graph tags: [Yes/No]
  - Structured data (JSON-LD): [Yes/No, what type?]
- [ ] **No** - Internal/dashboard feature

## Components Needed
- [ ] [ComponentName] - [Description]
- [ ] [ComponentName] - [Description]
- [ ] [ComponentName] - [Description]

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

### SSR Configuration
| Route | SSR Mode | SEO Required? | Why? |
|-------|----------|---------------|------|
| `/profile` | Data-only | No | Private page, no SEO needed |
| `/users/$userId` | Full | Yes | Public profile, needs SEO |

### Server Functions Needed
- [x] `fetchProfile` - GET, protected (own profile)
- [x] `fetchPublicProfile` - GET with userId, public
- [x] `updateProfile` - POST, protected

### SEO Requirements
- [x] **Yes** - For public profile pages:
  - Title format: `{display_name}'s Profile | MyApp`
  - Meta description: `{bio}` (first 160 chars)
  - Open Graph tags: Yes (for social sharing)
  - Structured data: Yes (Person schema)
- [ ] **No**

### Components Needed
- [x] ProfileForm - Edit profile form with avatar upload
- [x] ProfileCard - Display profile information
- [x] AvatarUpload - Handle avatar image upload to Supabase Storage

### Dependencies
- [ ] None (using existing Supabase Storage)

### Acceptance Criteria
- [x] User can view their profile at `/profile`
- [x] User can edit display name, bio, and avatar
- [x] Public profiles are accessible at `/users/$userId`
- [x] Public profiles have proper SEO meta tags
- [x] Avatar uploads work with Supabase Storage
- [x] Profile changes are immediately reflected (no page refresh)
