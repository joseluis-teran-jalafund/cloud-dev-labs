import React, { 
  createContext,
  useContext,
  useEffect,
  useState 
} from 'react';
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
import { 
  createUserProfile, 
  getUserProfile, 
  updateUserProfile,
  calculateAge
} from '../services/Profile';

interface UserProfile {
  address?: string;
  birthDate?: string;
  age?: number;
  createdAt?: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithProvider: (provider: AuthProvider) => Promise<void>;
  linkProvider: (provider: AuthProvider) => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const refreshProfile = async () => {
    if (currentUser) {
      try {
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error refreshing profile:', error);
        throw error;
      }
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('No user logged in');
    
    try {
      if (data.birthDate) {
        data.age = calculateAge(data.birthDate);
      }
      
      await updateUserProfile(currentUser.uid, data);
      await refreshProfile();
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  async function signup(email: string, password: string) {
    try {
      const userCredential = await signupWithEmail(email, password);
      setCurrentUser(userCredential.user);
      await createUserProfile(userCredential.user, {});
      await refreshProfile();
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      const userCredential = await loginWithEmail(email, password);
      setCurrentUser(userCredential.user);
      await refreshProfile();
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async function logout() {
    try {
      await logoutUser();
      setCurrentUser(null);
      setUserProfile(null);
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
      const profile = await getUserProfile(result.user.uid);
      if (!profile) {
        await createUserProfile(result.user, {});
      }
      await refreshProfile();
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
      await refreshProfile();
    } catch (error) {
      console.error("Account linking error:", error);
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);

        if (!profile) {
          await createUserProfile(user, {});
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    signInWithProvider,
    linkProvider,
    updateProfile,
    refreshProfile,
    loading,
    authChecked
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
