import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'

interface ArticleListProps {
  showDrafts?: boolean
}

export default function ArticleList({ showDrafts = false }: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchArticles()

    // Abonnement Realtime pour mise à jour automatique
    const channel = supabase
      .channel('public:articles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'articles' },
        (payload) => {
          console.log('Realtime update:', payload)
          fetchArticles()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [showDrafts])

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (!showDrafts) {
        query = query.eq('published', true)
      }

      const { data, error } = await query

      if (error) throw error
      setArticles(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun article pour le moment.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <article
          key={article.id}
          className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
            article.published
              ? 'bg-white'
              : 'bg-amber-50 border-l-4 border-amber-500'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {article.profiles?.avatar_url ? (
                <img
                  src={article.profiles.avatar_url}
                  alt={article.profiles.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 font-semibold">
                    {article.profiles?.username?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {article.profiles?.username || 'Utilisateur inconnu'}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(article.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            {!article.published && (
              <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs font-semibold rounded-full">
                BROUILLON
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h2>
          <p className="text-gray-600 line-clamp-3">{article.content}</p>

          <div className="mt-4 flex items-center justify-between">
            <Link
              to={`/article/${article.id}`}
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              Lire la suite →
            </Link>
            <span className="text-xs text-gray-400">ID: {article.id.slice(0, 8)}...</span>
          </div>
        </article>
      ))}
    </div>
  )
}
