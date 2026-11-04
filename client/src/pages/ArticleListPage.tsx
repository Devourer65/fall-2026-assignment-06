import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../api'
import type { Article } from '../types'

function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadArticles() {
      try {
        setLoading(true)
        setError('')
        const data = await getArticles(submittedSearch)
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load articles.')
      } finally {
        setLoading(false)
      }
    }

    void loadArticles()
  }, [submittedSearch])

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedSearch(search.trim())
  }

  return (
    <main className="page-container">
      <div className="page-heading">
        <div>
          <h1>Articles</h1>
          <p className="page-description">
            Browse articles and join the conversation.
          </p>
        </div>

        <Link to="/articles/new" className="button-link">
          Create Article
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search articles by title..."
          aria-label="Search articles by title"
        />

        <button type="submit">Search</button>

        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setSearch('')
            setSubmittedSearch('')
          }}
        >
          Clear
        </button>
      </form>

      {loading && <p className="status-message">Loading articles...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p className="empty-message">No articles found.</p>
      )}

      <div className="article-list">
        {articles.map((article) => (
          <article className="article-card" key={article.articleId}>
            <h2>
              <Link to={`/articles/${article.articleId}`}>
                {article.title}
              </Link>
            </h2>

            <p>
              {article.contents.length > 180
                ? `${article.contents.slice(0, 180)}...`
                : article.contents}
            </p>

            <Link
              to={`/articles/${article.articleId}`}
              className="read-more"
            >
              Read Article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}

export default ArticleListPage