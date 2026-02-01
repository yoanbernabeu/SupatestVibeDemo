import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase, Article } from '../lib/supabase'

interface ArticlePageProps {
  userId?: string
}

export default function ArticlePage({ userId }: ArticlePageProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)

  const isAuthor = userId && article?.author_id === userId

  useEffect(() => {
    fetchArticle()
  }, [id])

  const fetchArticle = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setArticle(data)
      setTitle(data.title)
      setContent(data.content)
      setPublished(data.published)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Article non trouvé')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!id) return
    setSaving(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('articles')
        .update({ title, content, published })
        .eq('id', id)

      if (error) throw error
      setEditing(false)
      fetchArticle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id || !confirm('Supprimer cet article ?')) return

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Article non trouvé'}
        </div>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Retour aux articles
      </Link>

      <article className={`bg-white rounded-lg shadow-md p-8 ${!article.published ? 'border-l-4 border-amber-500' : ''}`}>
        {/* Badge brouillon */}
        {!article.published && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-sm font-medium rounded-full">
              Brouillon - Non publié
            </span>
          </div>
        )}

        {editing ? (
          /* Mode édition */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center">
              <input
                id="published"
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publié
              </label>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
              <button
                onClick={() => {
                  setEditing(false)
                  setTitle(article.title)
                  setContent(article.content)
                  setPublished(article.published)
                }}
                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          /* Mode lecture */
          <>
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

              <div className="flex items-center space-x-3">
                {article.profiles?.avatar_url ? (
                  <img
                    src={article.profiles.avatar_url}
                    alt={article.profiles.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold text-lg">
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
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </header>

            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {article.content}
              </p>
            </div>

            {/* Actions auteur */}
            {isAuthor && (
              <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            )}

            {/* ID article (pour la démo) */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">ID: {article.id}</p>
            </div>
          </>
        )}
      </article>
    </div>
  )
}
