# New App: [App Name]

> Fill this out, then run: `/generate-tanstack-start-prp PRPs/INITIAL.md`

## App Overview
**Name**: [Your app name]
**Description**: [One sentence describing what it does]
**Target Users**: [Who will use this?]

## Core Features
List the main features (each becomes a vertical slice):

1. **[Feature 1]**: [Description]
2. **[Feature 2]**: [Description]
3. **[Feature 3]**: [Description]

## Data Model
Define your entities:

### [Entity 1]
```
- field1: type (required/optional)
- field2: type
- field3: type
```

### [Entity 2]
```
- field1: type
- field2: type
```

## Pages & Routes
List the pages with SSR requirements:

| Route | Description | Auth? | SSR Mode | SEO? |
|-------|-------------|-------|----------|------|
| `/` | Landing page | No | Full | Yes |
| `/login` | Login form | No | Full | No |
| `/dashboard` | Main dashboard | Yes | Data-only | No |
| `/[feature]` | [Feature] list | Yes | Full | Yes |
| `/[feature]/$id` | [Feature] detail | Yes | Full | Yes |

**SSR Modes:**
- `Full` (ssr: true) - Server renders HTML, best for SEO
- `Data-only` (ssr: 'data-only') - Server fetches data, client renders
- `Client` (ssr: false) - Everything on client, for browser-only APIs

## Integrations
Check what you need:

- [ ] Supabase Auth (Email/Password)
- [ ] Supabase Auth (OAuth - Google, GitHub, etc.)
- [ ] Supabase Storage (file uploads)
- [ ] Supabase Realtime (live updates)
- [ ] Stripe (payments)
- [ ] Vercel AI SDK
- [ ] Other: ___

## Visual Design

### Theme
- **Style**: [Modern / Minimal / Bold / Playful / Corporate]
- **Primary Color**: [e.g., Blue #3B82F6]
- **Accent Color**: [e.g., Amber #F59E0B]
- **Background**: [Light / Dark / Both]

### Typography
- **Headings**: [e.g., Inter, bold]
- **Body**: [e.g., Inter, regular]

### Component Style
- [Rounded corners / Sharp edges]
- [Subtle shadows / Flat]
- [Bordered cards / Borderless]

## Deployment Target
- [ ] Vercel
- [ ] Netlify
- [ ] Cloudflare Workers
- [ ] Node.js Server
- [ ] Other: ___

---

## Example: Task Manager App

### App Overview
**Name**: TaskFlow
**Description**: A collaborative task management app with real-time updates
**Target Users**: Small teams and freelancers

### Core Features
1. **Tasks**: Create, edit, complete, and delete tasks with due dates
2. **Projects**: Organize tasks into projects with team sharing
3. **Dashboard**: Overview of upcoming tasks and project progress

### Data Model

#### Task
```
- title: string (required)
- description: string (optional)
- status: enum ['todo', 'in_progress', 'done']
- due_date: date (optional)
- project_id: uuid (optional)
- user_id: uuid (required)
```

#### Project
```
- name: string (required)
- description: string (optional)
- color: string (optional)
- user_id: uuid (required)
```

### Pages & Routes
| Route | Description | Auth? | SSR Mode | SEO? |
|-------|-------------|-------|----------|------|
| `/` | Landing page | No | Full | Yes |
| `/login` | Login form | No | Full | No |
| `/signup` | Registration | No | Full | No |
| `/dashboard` | Task overview | Yes | Data-only | No |
| `/tasks` | All tasks | Yes | Full | Yes |
| `/tasks/$taskId` | Task detail | Yes | Full | Yes |
| `/projects` | Project list | Yes | Full | Yes |
| `/projects/$projectId` | Project detail | Yes | Full | Yes |

### Integrations
- [x] Supabase Auth (Email/Password)
- [ ] Supabase Auth (OAuth)
- [ ] Supabase Storage
- [x] Supabase Realtime (live task updates)
- [ ] Stripe
- [ ] Vercel AI SDK

### Visual Design
**Theme**:
- Style: Modern/Minimal
- Primary: Indigo #6366F1
- Accent: Emerald #10B981
- Background: Both (light default, dark mode toggle)

**Typography**:
- Headings: Inter, semibold
- Body: Inter, regular

**Component Style**:
- Rounded corners (lg)
- Subtle shadows
- Bordered cards

### Deployment Target
- [x] Vercel
