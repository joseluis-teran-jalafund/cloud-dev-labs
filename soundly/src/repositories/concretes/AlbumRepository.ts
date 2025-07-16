import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { firebaseDb } from '../../services/firebase/FirebaseConfig';
import type { IAlbumRepository } from '../contracts/IAlbumRepository';
import type { Album } from '../../types/album/Album';
import type { Song } from '../../types/song/Song';

export class FirebaseAlbumRepository implements IAlbumRepository {
  private readonly albumsCollection = collection(firebaseDb, 'albums');
  private readonly songsCollection = collection(firebaseDb, 'songs');

  async createAlbum(album: Omit<Album, 'id'>): Promise<Album> {
    const docRef = await addDoc(this.albumsCollection, album);
    return { albumId: docRef.id, ...album };
  }

  async getAlbum(id: string): Promise<Album | null> {
    const docRef = doc(this.albumsCollection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { albumId: docSnap.id, ...docSnap.data() } as Album : null;
  }

  async getAlbumsByArtist(artistId: string): Promise<Album[]> {
    const q = query(this.albumsCollection, where('artistId', '==', artistId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ albumId: doc.id, ...doc.data() } as Album));
  }

  async getAlbumsByGenre(genreId: string): Promise<Album[]> {
    const q = query(this.albumsCollection, where('genreId', '==', genreId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ albumId: doc.id, ...doc.data() } as Album));
  }

  async getAllAlbums(): Promise<Album[]> {
    const querySnapshot = await getDocs(this.albumsCollection);
    return querySnapshot.docs.map(doc => ({ albumId: doc.id, ...doc.data() } as Album));
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    const q = query(this.songsCollection, where('albumId', '==', albumId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        songId: doc.id,
        title: data.title,
        albumId: data.albumId,
        duration: data.duration || 0,
        trackNumber: data.trackNumber || 0,
        audioUrl: data.audioUrl || '',
      } as Song;
    }).sort((a, b) => (a.trackNumber || 0) - (b.trackNumber || 0));
  }

  async updateAlbum(id: string, updates: Partial<Album>): Promise<void> {
    const docRef = doc(this.albumsCollection, id);
    await updateDoc(docRef, updates);
  }

  async deleteAlbum(id: string): Promise<void> {
    const docRef = doc(this.albumsCollection, id);
    await deleteDoc(docRef);
  }
}
