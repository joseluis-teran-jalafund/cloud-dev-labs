import type { Song } from "../../types/song/Song";

export interface ISongRepository {
  createSong(song: Omit<Song, 'songId'>): Promise<Song>;

  getSong(songId: string): Promise<Song | null>;

  getAllSongs(): Promise<Song[]>;

  getSongsByAlbum(albumId: string): Promise<Song[]>;

  updateSong(songId: string, updates: Partial<Song>): Promise<void>;

  deleteSong(songId: string): Promise<void>;
}
