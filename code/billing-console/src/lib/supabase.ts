import { createClient } from '@supabase/supabase-js'

// The anon key is public by design (it ships in every client bundle; access
// control is RLS plus the billing-api allowlist). Baked fallbacks make the
// build immune to env plumbing failures, e.g. Vercel sensitive env vars
// pulling as empty strings.
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iwmjssxsonuomxqgtlua.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bWpzc3hzb251b214cWd0bHVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTEzMjEsImV4cCI6MjA3MzAyNzMyMX0.OaJhvWOCRkWBt6Q6URqRdx_EDwSzhxrooyNp9-UYNIQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
