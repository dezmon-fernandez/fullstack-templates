/**
 * Client-side Supabase client
 *
 * Use this in components for:
 * - Real-time subscriptions
 * - Client-side auth UI (login forms, etc.)
 *
 * For server-side operations (data fetching, mutations),
 * use getSupabaseServerClient() from @/server/supabase instead.
 */
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
)
