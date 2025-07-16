import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firebaseDb } from '../../services/firebase/FirebaseConfig';
import type { ISongRepository } from '../contracts/ISongRepository';
import type { Song } from '../../types/song/Song';

export class SongRepository implements ISongRepository {
  private readonly songsCollection = collection(firebaseDb, 'songs');

  async createSong(song: Omit<Song, 'songId'>): Promise<Song> {
    const docRef = await addDoc(this.songsCollection, song);
    return { songId: docRef.id, ...song };
  }

  async getSong(songId: string): Promise<Song | null> {
    const docRef = doc(this.songsCollection, songId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { songId: docSnap.id, ...docSnap.data() } as Song : null;
  }

  async getAllSongs(): Promise<Song[]> {
    const snapshot = await getDocs(this.songsCollection);
    return snapshot.docs.map(doc => ({
      songId: doc.id,
      ...(doc.data() as Omit<Song, 'songId'>)
    }));
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    const q = query(this.songsCollection, where('albumId', '==', albumId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      songId: doc.id,
      ...(doc.data() as Omit<Song, 'songId'>)
    })).sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
  }

  async updateSong(songId: string, updates: Partial<Song>): Promise<void> {
    const docRef = doc(this.songsCollection, songId);
    await updateDoc(docRef, updates);
  }

  async deleteSong(songId: string): Promise<void> {
    const docRef = doc(this.songsCollection, songId);
    await deleteDoc(docRef);
  }
}
