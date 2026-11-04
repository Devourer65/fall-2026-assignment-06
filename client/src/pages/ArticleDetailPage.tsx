import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteArticle, getArticle } from '../api'
import CommentsSection from '../components/CommentsSection'
import type { Article } from '../types'

function ArticleDetailPage() {
  const { articleId } = useParams()
  const navigate = useNavigate()

  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadArticle() {
      try {
        setLoading(true)
        setError('')

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

  async function handleDelete() {
    if (!article || !window.confirm('Are you sure you want to delete this article?')) {
      return
    }

    try {
      await deleteArticle(article.articleId)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete article.')
    }
  }

  if (loading) {
    return <main className="page-container"><p>Loading article...</p></main>
  }

  if (error || !article) {
    return (
      <main className="page-container">
        <p className="error-message">{error || 'Article not found.'}</p>
        <Link to="/">Back to Articles</Link>
      </main>
    )
  }

  return (
    <main className="page-container">
      <Link to="/" className="back-link">← Back to Articles</Link>

      <article className="article-detail">
        <h1>{article.title}</h1>
        <p className="article-contents">{article.contents}</p>

        {error && <p className="error-message">{error}</p>}

        <div className="button-group article-actions">
          <Link
            to={`/articles/${article.articleId}/edit`}
            className="button-link"
          >
            Edit Article
          </Link>

          <button
            type="button"
            className="danger-button"
            onClick={() => void handleDelete()}
          >
            Delete Article
          </button>
        </div>
      </article>

      <CommentsSection articleId={article.articleId} />
    </main>
  )
}

export default ArticleDetailPage