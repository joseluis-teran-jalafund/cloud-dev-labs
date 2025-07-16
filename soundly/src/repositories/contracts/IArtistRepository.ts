import type { Artist } from "../../types/artist/Artist";

export interface IArtistRepository {
  createArtist(artist: Omit<Artist, 'id'>): Promise<Artist>;

  getArtist(id: string): Promise<Artist | null>;

  getArtistsByGenre(genreId: string): Promise<Artist[]>;

  getAllArtists(): Promise<Artist[]>;

  updateArtist(id: string, updates: Partial<Artist>): Promise<void>;

  deleteArtist(id: string): Promise<void>;
}
