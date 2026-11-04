import { Link, useNavigate } from 'react-router-dom'
import ArticleForm from '../components/ArticleForm'
import { createArticle } from '../api'

function CreateArticlePage() {
  const navigate = useNavigate()

  async function handleCreate(data: { title: string; contents: string }) {
    const article = await createArticle(data)
    navigate(`/articles/${article.articleId}`)
  }

  return (
    <main className="page-container form-page">
      <Link to="/" className="back-link">← Back to Articles</Link>

      <h1>Create Article</h1>
      <p className="page-description">Write and publish a new article.</p>

      <ArticleForm
        submitLabel="Create Article"
        onSubmit={handleCreate}
      />
    </main>
  )
}

export default CreateArticlePage