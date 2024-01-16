import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_REACT_APP_SUPABASE_ANON_KEY
console.log(supabaseUrl)
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase