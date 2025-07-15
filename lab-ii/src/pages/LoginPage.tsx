import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/organisms/AuthForm';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { useLocation, useNavigate } from 'react-router';

export const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/profile';

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to log in');
      console.error(err);
    }
  };

  return (
    <AuthTemplate
      title="Login with Email"
      footerText="Don't have an account?"
      footerLink="/signup"
      footerLinkText="Sign up"
    >
      <AuthForm type="login" onSubmit={handleLogin} error={error} />
    </AuthTemplate>
  );
};
