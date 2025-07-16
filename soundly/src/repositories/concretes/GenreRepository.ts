import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { firebaseDb } from '../../services/firebase/FirebaseConfig';
import type { IGenreRepository } from '../contracts/IGenreRepository';
import type { Genre } from '../../types/genre/Genre';

export class FirebaseGenreRepository implements IGenreRepository {
  private readonly genresCollection = collection(firebaseDb, 'genres');

  async createGenre(genre: Omit<Genre, 'id'>): Promise<Genre> {
    const docRef = await addDoc(this.genresCollection, genre);
    return { genreId: docRef.id, ...genre };
  }

  async getGenre(id: string): Promise<Genre | null> {
    const docRef = doc(this.genresCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { genreId: docSnap.id, ...docSnap.data() } as Genre : null;
  }

  async getAllGenres(): Promise<Genre[]> {
    const querySnapshot = await getDocs(this.genresCollection);
    return querySnapshot.docs.map(doc => ({ genreId: doc.id, ...doc.data() } as Genre));
  }

  async updateGenre(id: string, updates: Partial<Genre>): Promise<void> {
    const docRef = doc(this.genresCollection, id);
    await updateDoc(docRef, updates);
  }

  async deleteGenre(id: string): Promise<void> {
    const docRef = doc(this.genresCollection, id);
    await deleteDoc(docRef);
  }
}
