import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthTemplate } from '../components/templates/AuthTemplate';
import { Input } from '../components/atoms/Input';
import { Button } from '../components/atoms/Button';
import { ProviderLinks } from '../components/organisms/ProviderLinks';
import { googleProvider, facebookProvider } from '../services/firebase/FirebaseConfig';
import { useNavigate } from 'react-router';

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, signInWithProvider } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      navigate('/edit-profile', { replace: true });
    } catch (err) {
      setError('Failed to create an account. Please try again.');
      console.error(err);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await signInWithProvider(googleProvider);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError('Failed to sign up with Google');
      console.error(err);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      await signInWithProvider(facebookProvider);
      navigate('/profile', { replace: true });
    } catch (err) {
      setError('Failed to sign up with Facebook');
      console.error(err);
    }
  };

  return (
    <AuthTemplate
      title="Create an Account"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Login"
    >
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>

      <div className="space-y-6">
        <ProviderLinks
          onGoogleClick={handleGoogleSignup}
          onFacebookClick={handleFacebookSignup}
          showOr={true}
          className="mb-6"
        />

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </AuthTemplate>
  );
};
