import { firebaseDb } from './firebase/FirebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { type User } from 'firebase/auth';

interface UserProfile {
  address?: string;
  birthDate?: string;
  age?: number;
  createdAt?: Date;
}

export const createUserProfile = async (user: User, profileData: UserProfile) => {
  try {
    await setDoc(doc(firebaseDb, 'users', user.uid), {
      ...profileData,
      email: user.email,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const docRef = doc(firebaseDb, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() as UserProfile : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, profileData: Partial<UserProfile>) => {
  try {
    await updateDoc(doc(firebaseDb, 'users', userId), profileData);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const monthDiff = today.getMonth() - birthDateObj.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  
  return age;
};
