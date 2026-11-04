import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ArticleForm from '../components/ArticleForm'
import { getArticle, updateArticle } from '../api'
import type { Article } from '../types'

function EditArticlePage() {
  const { articleId } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await getArticle(Number(articleId))
        setArticle(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load article.')
      } finally {
        setLoading(false)
      }
    }

    if (articleId && Number.isInteger(Number(articleId))) {
      void loadArticle()
    } else {
      setError('Invalid article ID.')
      setLoading(false)
    }
  }, [articleId])

  async function handleUpdate(data: { title: string; contents: string }) {
    if (!article) return

    const updated = await updateArticle(article.articleId, data)
    navigate(`/articles/${updated.articleId}`)
  }

  if (loading) {
    return <main className="page-container"><p>Loading article...</p></main>
  }

  if (!article) {
    return (
      <main className="page-container">
        <p className="error-message">{error || 'Article not found.'}</p>
        <Link to="/">Back to Articles</Link>
      </main>
    )
  }

  return (
    <main className="page-container form-page">
      <Link to={`/articles/${article.articleId}`} className="back-link">
        ← Back to Article
      </Link>

      <h1>Edit Article</h1>

      <ArticleForm
        initialTitle={article.title}
        initialContents={article.contents}
        submitLabel="Save Changes"
        onSubmit={handleUpdate}
      />
    </main>
  )
}

export default EditArticlePage