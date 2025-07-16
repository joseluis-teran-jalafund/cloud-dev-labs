import React, { useState } from 'react';
import Input from '../atoms/Input';
import Button from '../atoms/Button';

type AuthFormProps = {
  type: 'login' | 'register';
  onSubmit: (email: string, password: string) => void;
  loading?: boolean;
};

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit, loading = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Loading...' : type === 'login' ? 'Sign In' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default AuthForm;
