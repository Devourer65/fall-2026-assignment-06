import { useEffect, useState, type FormEvent } from 'react'
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from '../api'
import type { Comment } from '../types'

interface CommentsSectionProps {
  articleId: number
}

function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newBody, setNewBody] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingBody, setEditingBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadComments() {
      try {
        setLoading(true)
        setError('')
        const data = await getComments(articleId)
        setComments(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load comments.')
      } finally {
        setLoading(false)
      }
    }

    void loadComments()
  }, [articleId])

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!newBody.trim()) {
      setError('Comment cannot be empty.')
      return
    }

    try {
      setError('')
      const comment = await createComment(articleId, newBody.trim())
      setComments((current) => [...current, comment])
      setNewBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add comment.')
    }
  }

  function startEditing(comment: Comment) {
    setEditingId(comment.commentId)
    setEditingBody(comment.body)
    setError('')
  }

  async function handleEdit(
    event: FormEvent<HTMLFormElement>,
    commentId: number,
  ) {
    event.preventDefault()

    if (!editingBody.trim()) {
      setError('Comment cannot be empty.')
      return
    }

    try {
      setError('')
      const updated = await updateComment(
        articleId,
        commentId,
        editingBody.trim(),
      )

      setComments((current) =>
        current.map((comment) =>
          comment.commentId === commentId ? updated : comment,
        ),
      )

      setEditingId(null)
      setEditingBody('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update comment.')
    }
  }

  async function handleDelete(commentId: number) {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return
    }

    try {
      setError('')
      await deleteComment(articleId, commentId)
      setComments((current) =>
        current.filter((comment) => comment.commentId !== commentId),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete comment.')
    }
  }

  if (loading) {
    return <p className="status-message">Loading comments...</p>
  }

  return (
    <section className="comments-section">
      <h2>Comments ({comments.length})</h2>

      {error && <p className="error-message">{error}</p>}

      {comments.length === 0 ? (
        <p className="empty-message">No comments yet.</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <div className="comment-card" key={comment.commentId}>
              {editingId === comment.commentId ? (
                <form
                  onSubmit={(event) =>
                    void handleEdit(event, comment.commentId)
                  }
                >
                  <textarea
                    value={editingBody}
                    onChange={(event) => setEditingBody(event.target.value)}
                    rows={3}
                  />

                  <div className="button-group">
                    <button type="submit">Save</button>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setEditingId(null)
                        setEditingBody('')
                        setError('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="comment-body">{comment.body}</p>

                  <div className="button-group">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => startEditing(comment)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void handleDelete(comment.commentId)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleAdd}>
        <h3>Add a Comment</h3>

        <textarea
          value={newBody}
          onChange={(event) => setNewBody(event.target.value)}
          placeholder="Write a comment..."
          rows={4}
        />

        <button type="submit">Post Comment</button>
      </form>
    </section>
  )
}

export default CommentsSection