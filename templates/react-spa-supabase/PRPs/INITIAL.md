# App: [APP_NAME]

## Overview

**One-liner:** [What does this app do in one sentence?]

**Problem:** [What problem does this solve?]

**Users:** [Who is this for?]

## Features

### MVP (v1)
- [ ] [Feature 1 - be specific about what user can do]
- [ ] [Feature 2]
- [ ] [Feature 3]

### Later (v2+)
- [ ] [Future feature 1]
- [ ] [Future feature 2]

## Data Model

```
[table_name]
  - id: uuid (PK)
  - user_id: uuid (FK -> profiles, ON DELETE CASCADE)
  - [field]: [type] ([constraints])
  - [field]: [type] ([nullable/default])
  - created_at: timestamptz
  - updated_at: timestamptz

[another_table]
  - id: uuid (PK)
  - [parent]_id: uuid (FK -> [parent_table], ON DELETE CASCADE)
  - user_id: uuid (FK -> profiles, ON DELETE CASCADE)
  - [fields...]

Indexes:
  - [table]([column]) for [query purpose]
  - [table]([column1], [column2]) for [query purpose]
```

## Pages

### Public (no auth)
- `/` - [Landing page description]
- `/login` - [Login page]
- `/signup` - [Signup page]

### Authenticated
- `/dashboard` - [Main authenticated view]
- `/[resource]` - [List view]
- `/[resource]/:id` - [Detail view]
- `/settings` - [User settings]

## User Flows

1. **[Flow Name]**
   [Step] → [Step] → [Step]

2. **[Flow Name]**
   [Step] → [Step] → [Step]

## Auth

- [ ] Email/password
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Magic link
- [ ] Email confirmation required?
- [ ] Password reset?

## Integrations (check what applies)

- [ ] Stripe (payments)
- [ ] File uploads (Supabase Storage)
- [ ] AI (Vercel AI SDK)
- [ ] Realtime subscriptions

## Visual Design

### Aesthetic
[Choose one or describe your own:]
- [ ] **Minimal/Clean** - Lots of whitespace, subtle shadows, neutral colors
- [ ] **Bold/Vibrant** - Bright accent colors, strong typography, energetic
- [ ] **Luxury/Cinematic** - Dark backgrounds, gold/metallic accents, serif headings, glows
- [ ] **Playful/Friendly** - Rounded corners, illustrations, warm colors
- [ ] **Corporate/Professional** - Conservative colors, structured layouts, trustworthy
- [ ] **Custom:** [Describe the vibe]

### Color Palette (optional)
- **Primary:** [e.g., deep navy #1a1a2e]
- **Accent:** [e.g., gold #d4af37]
- **Background:** [e.g., dark #0f0f0f or light #fafafa]

### Typography (optional)
- **Headings:** [e.g., serif like Playfair Display, or sans like Inter]
- **Body:** [e.g., Inter, system fonts]

### Key UI Elements
- [ ] Hero with video background
- [ ] Hero with image/gradient
- [ ] Animated transitions (Framer Motion)
- [ ] Card-based layouts
- [ ] Masonry grid
- [ ] Custom glows/shadows
- [ ] Dark mode / Light mode toggle

### Inspiration (optional)
[Link to sites or describe the feel you're going for]

---

# Example: TaskFlow

> Delete everything above and fill in your own app, or use this as reference.

## Overview

**One-liner:** A minimal task manager that shows you what needs to be done today.

**Problem:** Existing tools like Trello and Notion are overkill for solo developers who just need to track tasks across a few projects.

**Users:** Solo developers, freelancers, anyone who wants a simple task tracker.

## Features

### MVP (v1)
- [ ] Create, edit, delete projects with name and color
- [ ] Add tasks to projects with title, description, due date
- [ ] Mark tasks complete/incomplete
- [ ] Dashboard showing all tasks due today across projects
- [ ] Email/password authentication

### Later (v2+)
- [ ] Task priority levels (low, medium, high)
- [ ] Recurring tasks
- [ ] Project sharing/collaboration
- [ ] Stripe subscription for Pro tier

## Data Model

```
profiles
  - id: uuid (PK, references auth.users)
  - email: text (not null)
  - full_name: text
  - avatar_url: text (nullable)
  - created_at: timestamptz

projects
  - id: uuid (PK)
  - user_id: uuid (FK -> profiles, ON DELETE CASCADE)
  - name: text (not null)
  - description: text (nullable)
  - color: text (default: '#6366f1')
  - created_at: timestamptz
  - updated_at: timestamptz

tasks
  - id: uuid (PK)
  - project_id: uuid (FK -> projects, ON DELETE CASCADE)
  - user_id: uuid (FK -> profiles, ON DELETE CASCADE)
  - title: text (not null)
  - description: text (nullable)
  - due_date: date (nullable)
  - completed: boolean (default: false)
  - completed_at: timestamptz (nullable)
  - created_at: timestamptz
  - updated_at: timestamptz

Indexes:
  - tasks(user_id, due_date) for today's tasks query
  - tasks(project_id) for project detail page
  - projects(user_id) for user's project list
```

## Pages

### Public (no auth)
- `/` - Landing page with hero, features, pricing, CTA
- `/login` - Email/password login form
- `/signup` - Email/password registration

### Authenticated
- `/dashboard` - Today's tasks across all projects, quick-add task
- `/projects` - Grid of all projects, create new project button
- `/projects/:id` - Project detail with task list, add/edit/delete tasks
- `/settings` - Profile edit, change password, delete account

## User Flows

1. **New User Onboarding**
   Signup → Redirect to /dashboard → Empty state → "Create your first project" CTA

2. **Daily Workflow**
   Open app → See today's tasks → Check off completed → Add new tasks inline

3. **Project Management**
   /projects → Click project → View tasks → Add task with due date → Back to dashboard

## Auth

- [x] Email/password
- [ ] OAuth (Google, GitHub, etc.)
- [ ] Magic link
- [x] Email confirmation required?
- [x] Password reset?

## Integrations

- [ ] Stripe (payments) - for v2
- [ ] File uploads (Supabase Storage)
- [ ] AI (Vercel AI SDK)
- [ ] Realtime subscriptions

## Visual Design

### Aesthetic
- [x] **Minimal/Clean** - Lots of whitespace, subtle shadows, neutral colors

### Color Palette
- **Primary:** Indigo #6366f1
- **Accent:** Emerald #10b981 (for success states)
- **Background:** Light #fafafa

### Typography
- **Headings:** Inter (bold)
- **Body:** Inter

### Key UI Elements
- [x] Card-based layouts
- [ ] Dark mode / Light mode toggle (v2)
