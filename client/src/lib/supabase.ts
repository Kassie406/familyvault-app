import { createClient } from "@supabase/supabase-js";

// TEMP: Hardcoded for testing - replace with env vars once working
const supabaseUrl = 'https://zzconzlitecbawulnbey.supabase.co';
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Y29uemxpdGVjYmF3dWxuYmV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNjQyMDYsImV4cCI6MjA1MzkzOTgwNn0.eyHSCCQKtvfGCJfrDqbGrQ1SqyVCZm_IMMJ0lr7qd4';

export const supabase = createClient(supabaseUrl, supabaseAnon);

// TODO: Replace with env vars once testing complete:
// export const supabase = createClient(
//   import.meta.env.VITE_SUPABASE_URL,
//   import.meta.env.VITE_SUPABASE_ANON_KEY
// );