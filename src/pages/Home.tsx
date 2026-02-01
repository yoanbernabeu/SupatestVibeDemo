import ArticleList from '../components/ArticleList'

export default function Home() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue sur VulnBlog
        </h1>
        <p className="text-gray-600">
          Découvrez les derniers articles de notre communauté.
        </p>
      </div>

      <ArticleList />
    </div>
  )
}
