# Example: Notes Feature with Next.js App Router

This example demonstrates implementing a Notes feature with SSR and SEO support using Next.js App Router.

## Feature Overview

A simple notes app where users can:
- Create, read, update, delete notes
- View notes list with server-side rendering
- View individual note with dynamic SEO meta tags

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

### Phase 3: Server Actions

```typescript
// src/features/notes/actions/notes.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  noteSchema,
  createNoteSchema,
  type Note,
  type CreateNoteInput,
} from '../schemas/notes.schema'

export async function fetchNotes(): Promise<Note[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return noteSchema.array().parse(data)
}

export async function fetchNote(id: string): Promise<Note> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return noteSchema.parse(data)
}

export async function createNote(input: CreateNoteInput): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const validated = createNoteSchema.parse(input)
  const { error } = await supabase
    .from('notes')
    .insert({ ...validated, user_id: user.id })

  if (error) throw error
  revalidatePath('/notes')
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) throw error
  revalidatePath('/notes')
}
```

### Phase 4: Components

```typescript
// src/features/notes/components/NoteList.tsx
'use client'

import { type ReactElement } from 'react'
import Link from 'next/link'
import { deleteNote } from '../actions/notes'
import type { Note } from '../schemas/notes.schema'

interface NoteListProps {
  notes: Note[]
}

export function NoteList({ notes }: NoteListProps): ReactElement {
  if (!notes.length) {
    return <div className="text-gray-500">No notes yet. Create your first note!</div>
  }

  return (
    <ul className="space-y-2">
      {notes.map((note) => (
        <li key={note.id} className="flex items-center justify-between p-4 border rounded-lg">
          <Link
            href={`/notes/${note.id}`}
            className="text-blue-600 hover:underline font-medium"
          >
            {note.title}
          </Link>
          <form action={deleteNote.bind(null, note.id)}>
            <button
              type="submit"
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  )
}
```

```typescript
// src/features/notes/components/NoteForm.tsx
'use client'

import { type ReactElement } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createNote } from '../actions/notes'
import { createNoteSchema, type CreateNoteInput } from '../schemas/notes.schema'

export function NoteForm(): ReactElement {
  const form = useForm<CreateNoteInput>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: { title: '', content: '' },
  })

  const onSubmit = async (data: CreateNoteInput) => {
    await createNote(data)
    form.reset()
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
      <div>
        <input
          {...form.register('title')}
          placeholder="Note title"
          className="w-full p-2 border rounded"
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>
      <div>
        <textarea
          {...form.register('content')}
          placeholder="Note content (optional)"
          className="w-full p-2 border rounded h-24"
        />
      </div>
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {form.formState.isSubmitting ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  )
}
```

### Phase 5: Public API

```typescript
// src/features/notes/index.ts
export { fetchNotes, fetchNote, createNote, deleteNote } from './actions/notes'
export { NoteList } from './components/NoteList'
export { NoteForm } from './components/NoteForm'
export type { Note, CreateNoteInput } from './schemas/notes.schema'
```

### Phase 6: Pages with SSR and SEO

#### Notes List Page

```typescript
// src/app/(dashboard)/notes/page.tsx
import type { Metadata } from 'next'
import { fetchNotes, NoteList, NoteForm } from '@/features/notes'

export const metadata: Metadata = {
  title: 'My Notes',
  description: 'View and manage your personal notes',
}

export default async function NotesPage() {
  const notes = await fetchNotes()

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>
      <NoteForm />
      <NoteList notes={notes} />
    </main>
  )
}
```

#### Notes List Loading

```typescript
// src/app/(dashboard)/notes/loading.tsx
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="container mx-auto p-4 max-w-2xl space-y-4">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  )
}
```

#### Note Detail Page

```typescript
// src/app/(dashboard)/notes/[noteId]/page.tsx
import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { fetchNote } from '@/features/notes'

type Props = {
  params: Promise<{ noteId: string }>
}

const getNote = cache(async (id: string) => {
  try {
    return await fetchNote(id)
  } catch {
    return null
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { noteId } = await params
  const note = await getNote(noteId)

  if (!note) {
    return { title: 'Note Not Found' }
  }

  return {
    title: note.title,
    description: note.content?.slice(0, 160) ?? 'A personal note',
  }
}

export default async function NoteDetailPage({ params }: Props) {
  const { noteId } = await params
  const note = await getNote(noteId)

  if (!note) notFound()

  return (
    <main className="container mx-auto p-4 max-w-2xl">
      <article>
        <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          Created {new Date(note.created_at).toLocaleDateString()}
        </p>
        {note.content && (
          <div className="prose">{note.content}</div>
        )}
      </article>
    </main>
  )
}
```

#### Note Detail Not Found

```typescript
// src/app/(dashboard)/notes/[noteId]/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container mx-auto p-4 max-w-2xl text-center">
      <h2 className="text-xl font-bold mb-2">Note Not Found</h2>
      <p className="text-gray-500 mb-4">The note you're looking for doesn't exist.</p>
      <Link href="/notes" className="text-blue-500 hover:underline">
        Back to Notes
      </Link>
    </div>
  )
}
```

#### Note Detail Error

```typescript
// src/app/(dashboard)/notes/[noteId]/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto p-4 max-w-2xl text-center">
      <h2 className="text-xl font-bold text-red-600 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-500 mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
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
# Should output the note's title in metadata
```
