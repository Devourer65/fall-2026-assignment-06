import type { Article, Comment } from './types'

const API_URL = '/api'

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = `Request failed (${response.status})`

    try {
      const data = await response.json() as { error?: string }
      if (data.error) message = data.error
    } catch {
      // Keep the default error message if the response has no JSON body.
    }

    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function getArticles(search = '') {
  const query = search
    ? `?title_contains=${encodeURIComponent(search)}`
    : ''

  return request<Article[]>(`/articles${query}`)
}

export function getArticle(id: number) {
  return request<Article>(`/articles/${id}`)
}

export function createArticle(data: {
  title: string
  contents: string
}) {
  return request<Article>('/articles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateArticle(
  id: number,
  data: { title: string; contents: string },
) {
  return request<Article>(`/articles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteArticle(id: number) {
  return request<Article>(`/articles/${id}`, {
    method: 'DELETE',
  })
}

export function getComments(articleId: number) {
  return request<Comment[]>(`/articles/${articleId}/comments`)
}

export function createComment(articleId: number, body: string) {
  return request<Comment>(`/articles/${articleId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  })
}

export function updateComment(
  articleId: number,
  commentId: number,
  body: string,
) {
  return request<Comment>(
    `/articles/${articleId}/comments/${commentId}`,
    {
      method: 'PUT',
      body: JSON.stringify({ body }),
    },
  )
}

export function deleteComment(articleId: number, commentId: number) {
  return request<Comment>(
    `/articles/${articleId}/comments/${commentId}`,
    {
      method: 'DELETE',
    },
  )
}