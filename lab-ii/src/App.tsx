import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { HomePage } from './pages/HomePage';
import { SignUpPage } from './pages/SignUpPage';
import { ProfileEditPage } from './pages/ProfileEditPage';
import { ProfileViewPage } from './pages/ProfileViewPage';
import { AuthRoute } from './routes/AuthRoute';
import { ProtectedRoute } from './routes/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route element={<AuthRoute />}>
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/edit-profile" element={<ProfileEditPage />} />
            <Route path="/profile" element={<ProfileViewPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
