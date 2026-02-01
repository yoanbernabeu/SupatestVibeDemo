import { useState } from 'react'
import ArticleForm from '../components/ArticleForm'
import ArticleList from '../components/ArticleList'
import Profile from '../components/Profile'

interface DashboardProps {
  userId: string
}

type Tab = 'articles' | 'create' | 'profile'

export default function Dashboard({ userId }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('articles')
  const [refreshKey, setRefreshKey] = useState(0)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'articles', label: 'Mes Articles' },
    { id: 'create', label: 'Créer un Article' },
    { id: 'profile', label: 'Mon Profil' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Tableau de bord
      </h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'articles' && (
        <div key={refreshKey}>
          <ArticleList showDrafts />
        </div>
      )}

      {activeTab === 'create' && (
        <ArticleForm
          authorId={userId}
          onSuccess={() => {
            setRefreshKey((k) => k + 1)
            setActiveTab('articles')
          }}
        />
      )}

      {activeTab === 'profile' && <Profile userId={userId} />}
    </div>
  )
}
