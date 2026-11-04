import { useState, type FormEvent } from 'react'

interface ArticleFormProps {
  initialTitle?: string
  initialContents?: string
  submitLabel: string
  onSubmit: (data: { title: string; contents: string }) => Promise<void>
}

function ArticleForm({
  initialTitle = '',
  initialContents = '',
  submitLabel,
  onSubmit,
}: ArticleFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [contents, setContents] = useState(initialContents)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !contents.trim()) {
      setError('Please enter both a title and article contents.')
      return
    }

    setError('')
    setSaving(true)

    try {
      await onSubmit({
        title: title.trim(),
        contents: contents.trim(),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <label htmlFor="article-title">Title</label>
      <input
        id="article-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter an article title"
      />

      <label htmlFor="article-contents">Contents</label>
      <textarea
        id="article-contents"
        value={contents}
        onChange={(event) => setContents(event.target.value)}
        placeholder="Write your article here..."
        rows={12}
      />

      {error && <p className="error-message">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

export default ArticleForm