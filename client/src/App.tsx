import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import ArticleListPage from './pages/ArticleListPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import CreateArticlePage from './pages/CreateArticlePage'
import EditArticlePage from './pages/EditArticlePage'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="site-header">
          <div className="header-content">
            <Link to="/" className="site-title">
              Assignment 06 Article Manager
            </Link>

            <nav>
              <Link to="/">Home</Link>
              <Link to="/articles/new">Create Article</Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<ArticleListPage />} />
          <Route path="/articles/new" element={<CreateArticlePage />} />
          <Route path="/articles/:articleId" element={<ArticleDetailPage />} />
          <Route
            path="/articles/:articleId/edit"
            element={<EditArticlePage />}
          />
          <Route
            path="*"
            element={
              <main className="page-container">
                <h1>Page Not Found</h1>
                <Link to="/">Return to Articles</Link>
              </main>
            }
          />
        </Routes>

        <footer className="site-footer">
          <p>Assignment 06 Article Manager SPA</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
