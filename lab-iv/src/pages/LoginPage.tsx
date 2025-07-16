import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthForm } from '../components/organisms/AuthForm';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { useNavigate } from 'react-router';

export const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate('/', { state: { from: '/login' } });
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
