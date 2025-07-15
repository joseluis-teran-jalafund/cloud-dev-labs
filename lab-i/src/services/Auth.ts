import { 
  type User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  linkWithPopup,
  type AuthProvider
} from 'firebase/auth';
import { 
  firebaseAuth,
  googleProvider,
  facebookProvider 
} from './firebase/FirebaseConfig';

export const loginWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const signupWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(firebaseAuth, email, password);
};

export const logoutUser = () => {
  return signOut(firebaseAuth);
};

export const loginWithProvider = (provider: AuthProvider) => {
  return signInWithPopup(firebaseAuth, provider);
};

export const linkProviderToAccount = (provider: AuthProvider) => {
  if (!firebaseAuth.currentUser) throw new Error("No user logged in");
  return linkWithPopup(firebaseAuth.currentUser, provider);
};

export { 
  type User,
  googleProvider,
  facebookProvider
};
