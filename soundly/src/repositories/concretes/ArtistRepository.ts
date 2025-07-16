import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firebaseDb } from '../../services/firebase/FirebaseConfig';
import type { IArtistRepository } from '../contracts/IArtistRepository';
import type { Artist } from '../../types/artist/Artist';

export class FirebaseArtistRepository implements IArtistRepository {
  private readonly artistsCollection = collection(firebaseDb, 'artists');

  async createArtist(artist: Omit<Artist, 'id'>): Promise<Artist> {
    const docRef = await addDoc(this.artistsCollection, artist);
    return { artistId: docRef.id, ...artist };
  }

  async getArtist(id: string): Promise<Artist | null> {
    const docRef = doc(this.artistsCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { artistId: docSnap.id, ...docSnap.data() } as Artist : null;
  }

  async getArtistsByGenre(genreId: string): Promise<Artist[]> {
    const q = query(this.artistsCollection, where('genreId', '==', genreId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ artistId: doc.id, ...doc.data() } as Artist));
  }

  async getAllArtists(): Promise<Artist[]> {
    const querySnapshot = await getDocs(this.artistsCollection);
    return querySnapshot.docs.map(doc => ({ artistId: doc.id, ...doc.data() } as Artist));
  }

  async updateArtist(id: string, updates: Partial<Artist>): Promise<void> {
    const docRef = doc(this.artistsCollection, id);
    await updateDoc(docRef, updates);
  }

  async deleteArtist(id: string): Promise<void> {
    const docRef = doc(this.artistsCollection, id);
    await deleteDoc(docRef);
  }
}
