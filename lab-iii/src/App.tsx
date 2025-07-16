import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { ProfileViewPage } from './pages/ProfileViewPage';
import { AuthRoute } from './routes/AuthRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PostsProvider } from './contexts/PostContext';
import { PostPage } from './pages/PostPage';
import { LoginPage } from './pages/LoginPage';
import { FeedPage } from './pages/FeedPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <PostsProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />            

            <Route element={<AuthRoute />}>
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/edit-profile" element={<ProfileEditPage />} />
              <Route path="/profile" element={<ProfileViewPage />} />
              <Route path="/create-post" element={<PostPage />} />
              <Route path="/posts" element={<FeedPage />} />
            </Route>
          </Routes>
        </PostsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
