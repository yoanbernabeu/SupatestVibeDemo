import { useEffect, useState } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ArticlePage from './pages/ArticlePage'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAuth, setShowAuth] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        setShowAuth(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              VulnBlog
            </Link>

            <nav className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Accueil
              </Link>

              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <span className="text-sm text-gray-500">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Connexion
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {showAuth && !user ? (
          <div className="mb-8">
            <button
              onClick={() => setShowAuth(false)}
              className="mb-4 text-gray-600 hover:text-gray-900"
            >
              ← Retour
            </button>
            <Auth onAuthSuccess={() => setShowAuth(false)} />
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/article/:id"
              element={<ArticlePage userId={user?.id} />}
            />
            <Route
              path="/dashboard"
              element={
                user ? (
                  <Dashboard userId={user.id} />
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Accès réservé
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Vous devez être connecté pour accéder au tableau de bord.
                    </p>
                    <button
                      onClick={() => setShowAuth(true)}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                      Se connecter
                    </button>
                  </div>
                )
              }
            />
          </Routes>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>
            VulnBlog - Application de démonstration pour tests de sécurité
          </p>
          <p className="mt-1 text-red-600 font-medium">
            ⚠️ Cette application contient des failles de sécurité volontaires !
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
