import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import AuthTemplate from '../components/organisms/AuthTemplate';
import AuthForm from '../components/organisms/AuthForm';
import SocialButtons from '../components/molecules/SocialButtons';
import { loginWithEmail, loginWithGoogle, loginWithFacebook } from '../services/auth';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const from = location.state?.from?.pathname || '/';

  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleEmailLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError('');
      await loginWithEmail(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to login with Google');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithFacebook();
      navigate('/');
    } catch (err) {
      setError('Failed to login with Facebook');
      console.error('Facebook login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate
      title="Sign in to your account"
      subtitle="Enjoy your favorite music"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Sign up"
    >
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
      <AuthForm type="login" onSubmit={handleEmailLogin} loading={loading} />
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        <SocialButtons 
          onGoogleClick={handleGoogleLogin}
          onFacebookClick={handleFacebookLogin}
          loading={loading}
        />
      </div>
    </AuthTemplate>
  );
};

export default LoginPage;
