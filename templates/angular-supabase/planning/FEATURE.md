# Feature: [Feature Name]

## Overview
[Brief description of what you want to build]

## User Story
As a [user type], I want to [action] so that [benefit].

## Requirements

### Must Have
- [ ] [Required functionality]
- [ ] [Required functionality]

### Nice to Have
- [ ] [Optional enhancement]

## Technical Considerations

### Affected Features
- [ ] `features/auth` - [how affected]
- [ ] `features/[other]` - [how affected]
- [ ] New: `features/[name]`

### Database Changes
- [ ] New table: `[table_name]`
- [ ] New columns: `[table].[column]`
- [ ] RLS policies needed

### External Integrations
- [ ] Stripe
- [ ] AI SDK
- [ ] Other: [specify]

## Out of Scope
- [What this does NOT include]

---

## Example: User Settings Feature

### Overview
Add a settings page where users can update their profile and preferences.

### User Story
As a user, I want to update my profile information so that my account reflects my current details.

### Requirements

#### Must Have
- [ ] Edit display name
- [ ] Upload avatar
- [ ] Change email (with verification)
- [ ] Delete account

#### Nice to Have
- [ ] Dark mode toggle
- [ ] Notification preferences

### Technical Considerations

#### Affected Features
- [ ] `features/auth` - Add profile update methods
- [ ] New: `features/settings`

#### Database Changes
- [ ] Add `avatar_url` to `profiles` table
- [ ] Add `preferences` JSONB column

#### External Integrations
- [ ] Supabase Storage for avatar uploads

### Out of Scope
- Two-factor authentication
- Social login connections
