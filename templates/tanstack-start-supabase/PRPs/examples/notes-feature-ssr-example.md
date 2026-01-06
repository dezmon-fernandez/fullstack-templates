# Example: Notes Feature with SSR

This example demonstrates implementing a Notes feature with full SSR and SEO support.

## Feature Overview

A simple notes app where users can:
- Create, read, update, delete notes
- View notes list with SSR for fast loading
- View individual note with dynamic SEO meta tags
- Real-time updates when notes change

## Implementation

### Phase 1: Database Schema

```sql
-- supabase/migrations/20240115_create_notes.sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "notes_select_own" ON notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notes_insert_own" ON notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notes_update_own" ON notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "notes_delete_own" ON notes
  FOR DELETE USING (auth.uid() = user_id);
```

### Phase 2: Schemas

```typescript
// src/features/notes/schemas/notes.schema.ts
import { z } from 'zod'

export const noteSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  content: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export const createNoteSchema = noteSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
})

export const updateNoteSchema = createNoteSchema.partial()

export type Note = z.infer<typeof noteSchema>
export type CreateNoteInput = z.infer<typeof createNoteSchema>
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>
```

### Phase 3: Server Functions

```typescript
// src/features/notes/server/notes.server.ts
import { createServerFn } from '@tanstack/react-start'
import { getSupabaseServerClient } from '@/server/supabase'
import { authMiddleware } from '@/server/middleware/auth'
import {
  noteSchema,
  createNoteSchema,
  type Note,
  type CreateNoteInput,
} from '../schemas/notes.schema'

// Public read (for SEO - notes could be public)
export const fetchNotes = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Note[]> => {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', context.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return noteSchema.array().parse(data)
  })

export const fetchNote = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<Note> => {
    const supabase = getSupabaseServerClient()
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', data.id)
      .single()

    if (error) throw error
    return noteSchema.parse(note)
  })

export const createNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: CreateNoteInput) => createNoteSchema.parse(data))
  .handler(async ({ data, context }): Promise<Note> => {
    const supabase = getSupabaseServerClient()
    const { data: note, error } = await supabase
      .from('notes')
      .insert({ ...data, user_id: context.user.id })
      .select()
      .single()

    if (error) throw error
    return noteSchema.parse(note)
  })

export const deleteNote = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<void> => {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', data.id)

    if (error) throw error
  })
```

### Phase 4: Hooks (Optional)

> **Skipped for this feature.** Server functions + `router.invalidate()` handle all data needs. TanStack Query only needed for polling, window focus refetch, or optimistic updates.

### Phase 5: Components

```typescript
// src/features/notes/components/NoteList.tsx
import { type ReactElement } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { deleteNote } from '../server/notes.server'
import type { Note } from '../schemas/notes.schema'

interface NoteListProps {
  notes: Note[]
}

export function NoteList({ notes }: NoteListProps): ReactElement {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    await deleteNote({ data: { id } })
    router.invalidate()
  }

  if (!notes.length) {
    return <div>No notes yet.</div>
  }

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <Link to="/notes/$noteId" params={{ noteId: note.id }}>
            {note.title}
          </Link>
          <button onClick={() => handleDelete(note.id)}>Delete</button>
        </li>
      ))}
    </ul>
  )
}
```

```typescript
// src/features/notes/components/NoteForm.tsx
import { type ReactElement } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNote } from '../server/notes.server'
import { createNoteSchema, type CreateNoteInput } from '../schemas/notes.schema'

export function NoteForm(): ReactElement {
  const router = useRouter()

  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' },
  })

  const onSubmit = async (data: CreateNoteInput) => {
    await createNote({ data })
    router.invalidate()
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('title')} placeholder="Title" />
      <textarea {...form.register('content')} placeholder="Content" />
      <button type="submit">Create Note</button>
    </form>
  )
}
```

### Phase 6: Public API

```typescript
// src/features/notes/index.ts
export { fetchNotes, fetchNote, createNote, deleteNote } from './server/notes.server'
export { NoteList } from './components/NoteList'
export { NoteForm } from './components/NoteForm'
export type { Note, CreateNoteInput } from './schemas/notes.schema'
```

### Phase 7: Routes with SSR and SEO

> Loader calls server functions. Component gets data via `useLoaderData()`. Pass as props.

```typescript
// src/routes/_authed/notes.tsx
import { createFileRoute } from '@tanstack/react-router'
import { fetchNotes, NoteList, NoteForm } from '@/features/notes'

export const Route = createFileRoute('/_authed/notes')({
  head: () => ({
    title: 'My Notes | NotesApp',
    meta: [{ name: 'description', content: 'View and manage your personal notes' }],
  }),
  ssr: true,
  loader: () => fetchNotes(),
  component: NotesPage,
})

function NotesPage() {
  const notes = Route.useLoaderData()
  return (
    <>
      <NoteForm />
      <NoteList notes={notes} />
    </>
  )
}
```

```typescript
// src/routes/_authed/notes.$noteId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { fetchNote } from '@/features/notes'

export const Route = createFileRoute('/_authed/notes/$noteId')({
  head: ({ loaderData }) => ({
    title: `${loaderData.title} | NotesApp`,
    meta: [{ name: 'description', content: loaderData.content?.slice(0, 160) || '' }],
  }),
  ssr: true,
  loader: ({ params }) => fetchNote({ data: { id: params.noteId } }),
  component: NoteDetailPage,
})

function NoteDetailPage() {
  const note = Route.useLoaderData()
  return (
    <article>
      <h1>{note.title}</h1>
      <p>{note.content}</p>
    </article>
  )
}
```

## Validation

```bash
# Build should succeed
pnpm build

# Check SSR output
curl -s http://localhost:3000/notes | grep -o '<title>.*</title>'
# Should output: <title>My Notes | NotesApp</title>

# Check dynamic SEO
curl -s http://localhost:3000/notes/[note-id] | grep 'og:title'
# Should output the note's title in og:title meta tag
```
