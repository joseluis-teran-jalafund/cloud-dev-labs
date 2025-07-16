import type { Album } from "../../types/album/Album";
import type { Song } from "../../types/song/Song";

export interface IAlbumRepository {
  createAlbum(album: Omit<Album, 'id'>): Promise<Album>;

  getAlbum(id: string): Promise<Album | null>;

  getAlbumsByArtist(artistId: string): Promise<Album[]>;

  getAlbumsByGenre(genreId: string): Promise<Album[]>;

  getAllAlbums(): Promise<Album[]>;

  getSongsByAlbum(albumId: string): Promise<Song[]>;

  updateAlbum(id: string, updates: Partial<Album>): Promise<void>;

  deleteAlbum(id: string): Promise<void>;
}
