import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User,
  type AuthProvider
} from 'firebase/auth';
import { firebaseAuth } from '../services/firebase/FirebaseConfig';
import { 
  loginWithEmail, 
  signupWithEmail, 
  logoutUser, 
  loginWithProvider, 
  linkProviderToAccount 
} from '../services/Auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  linkProvider: (provider: AuthProvider) => Promise<void>;
  loading: boolean;
  authChecked: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  async function signup(email: string, password: string) {
    try {
      const userCredential = await signupWithEmail(email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await loginWithEmail(email, password);
      setCurrentUser(userCredential.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutUser();
      setCurrentUser(null);
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async function signInWithProvider(provider: AuthProvider) {
    try {
      const result = await loginWithProvider(provider);
      setCurrentUser(result.user);
    } catch (error) {
      console.error("Provider login error:", error);
      throw error;
    }
  }

  async function linkProvider(provider: AuthProvider) {
    if (!currentUser) throw new Error("No user logged in");
    try {
      const result = await linkProviderToAccount(provider);
      setCurrentUser(result.user);
    } catch (error) {
      console.error("Account linking error:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    signInWithProvider,
    linkProvider,
    loading,
    authChecked
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
