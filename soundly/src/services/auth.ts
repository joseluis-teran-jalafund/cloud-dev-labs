import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User,
  type AuthError,
  updateProfile,
} from 'firebase/auth';
import { firebaseAuth, firebaseDb } from './firebase/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const handleAuthError = (error: AuthError): string => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email already in use';
    case 'auth/invalid-email':
      return 'Invalid email address';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-not-found':
      return 'User not found';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/popup-closed-by-user':
      return 'Popup closed before completing authentication';
    case 'auth/account-exists-with-different-credential':
      return 'Account exists with different credential';
    default:
      return 'Authentication failed. Please try again.';
  }
};

export const registerWithEmail = async (
  email: string,
  password: string,
  role: 'admin' | 'user' = 'user'
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    await setDoc(doc(firebaseDb, 'users', userCredential.user.uid), {
      email,
      role,
      createdAt: new Date()
    });
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: handleAuthError(error as AuthError) };
  }
};

export const getUserRole = async (uid: string): Promise<'admin' | 'user' | null> => {
  const docRef = doc(firebaseDb, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data.role as 'admin' | 'user';
  }
  return null;
};

export const isAdmin = async (user: User): Promise<boolean> => {
  const role = await getUserRole(user.uid);
  return role === 'admin';
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: handleAuthError(error as AuthError) };
  }
};

export const loginWithGoogle = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const userCredential = await signInWithPopup(firebaseAuth, provider);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: handleAuthError(error as AuthError) };
  }
};

export const loginWithFacebook = async (): Promise<{ user: User | null; error: string | null }> => {
  try {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    const userCredential = await signInWithPopup(firebaseAuth, provider);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: handleAuthError(error as AuthError) };
  }
};

export const logout = async (): Promise<{ success: boolean; error: string | null }> => {
  try {
    await signOut(firebaseAuth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleAuthError(error as AuthError) };
  }
};

export const getCurrentUser = (): User | null => {
  return firebaseAuth.currentUser;
};

export const onAuthStateChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(firebaseAuth, callback);
};

export const getIdToken = async (): Promise<string | null> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error('Error getting ID token:', error);
    return null;
  }
};

export const updateUserProfile = async (
  displayName?: string,
  photoURL?: string
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const user = firebaseAuth.currentUser;
    if (!user) {
      return { success: false, error: 'No user is currently signed in' };
    }
    await updateProfile(user, { displayName, photoURL });
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleAuthError(error as AuthError) };
  }
};

export type AuthUser = User;
export type AuthErrorType = AuthError;
