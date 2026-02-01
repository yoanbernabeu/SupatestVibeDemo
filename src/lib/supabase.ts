import { createClient } from '@supabase/supabase-js'

// Configuration Supabase
// Note: La clé anon est publique et exposée côté client - c'est normal avec Supabase
// La sécurité repose sur les Row Level Security (RLS) policies
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface Profile {
  id: string
  username: string
  email: string
  avatar_url: string | null
  created_at: string
}

export interface Article {
  id: string
  title: string
  content: string
  author_id: string
  published: boolean
  created_at: string
  // Relation jointe
  profiles?: Profile
}
