import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zypyviskemdvvqnjnnui.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)





