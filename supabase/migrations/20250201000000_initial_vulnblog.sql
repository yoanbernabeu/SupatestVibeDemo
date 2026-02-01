-- ============================================================================
-- VulnBlog - Migration consolidée
-- ⚠️ ATTENTION: Ce fichier contient des configurations VOLONTAIREMENT VULNÉRABLES
-- ⚠️ Ne JAMAIS utiliser ces configurations en production !
-- ============================================================================

-- ============================================================================
-- TABLE: profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS (fait disparaître l'alerte Security Advisor)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TABLE: articles
-- ============================================================================

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- POLICIES: profiles
-- ⚠️ FAILLES CACHÉES - Contournent le linter Supabase !
-- ============================================================================

-- SELECT: Tout le monde peut voir tous les profils (expose emails)
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- INSERT: Policy correcte
CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- ⚠️ FAILLE CACHÉE: Tautologie (id IS NOT NULL OR id IS NULL) = toujours vrai
CREATE POLICY "Authenticated users can update profiles" ON profiles
FOR UPDATE
USING (id IS NOT NULL OR id IS NULL);

-- ⚠️ FAILLE CACHÉE: Même technique
CREATE POLICY "Authenticated users can delete profiles" ON profiles
FOR DELETE
USING (id IS NOT NULL OR id IS NULL);

-- ============================================================================
-- POLICIES: articles
-- ⚠️ FAILLES CACHÉES - Contournent le linter Supabase !
-- ============================================================================

-- SELECT: Tout le monde peut lire tous les articles (même brouillons)
CREATE POLICY "Anyone can read articles" ON articles
FOR SELECT USING (true);

-- INSERT: Policy correcte
CREATE POLICY "Authenticated users can insert" ON articles
FOR INSERT WITH CHECK (auth.uid() = author_id);

-- ⚠️ FAILLE CACHÉE: (author_id IS NOT NULL OR author_id IS NULL) = toujours vrai
CREATE POLICY "Authors can update articles" ON articles
FOR UPDATE
USING (author_id IS NOT NULL OR author_id IS NULL);

-- ⚠️ FAILLE CACHÉE: Même technique
CREATE POLICY "Authors can delete articles" ON articles
FOR DELETE
USING (author_id IS NOT NULL OR author_id IS NULL);

-- ============================================================================
-- FONCTION RPC VULNÉRABLE
-- ⚠️ FAILLE: Énumération d'utilisateurs
-- ============================================================================

CREATE OR REPLACE FUNCTION get_user_by_email(user_email TEXT)
RETURNS TABLE (id UUID, username TEXT, email TEXT, avatar_url TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.username, p.email, p.avatar_url
  FROM profiles p
  WHERE p.email = user_email;
END;
$$;

-- ============================================================================
-- RÉSULTAT:
-- ✅ Linter Supabase = AUCUN WARNING
-- ✅ Security Advisor = "Tout semble sécurisé"
-- ❌ Réalité = Failles critiques cachées par des tautologies logiques
-- ============================================================================
