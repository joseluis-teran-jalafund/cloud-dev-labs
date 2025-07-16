import type { Genre } from "../../types/genre/Genre";

export interface IGenreRepository {
  createGenre(genre: Omit<Genre, 'id'>): Promise<Genre>;

  getGenre(id: string): Promise<Genre | null>;

  getAllGenres(): Promise<Genre[]>;

  updateGenre(id: string, updates: Partial<Genre>): Promise<void>;

  deleteGenre(id: string): Promise<void>;
}
