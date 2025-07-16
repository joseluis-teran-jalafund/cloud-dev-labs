import type { IAlbumRepository } from "../repositories/contracts/IAlbumRepository";
import type { IArtistRepository } from "../repositories/contracts/IArtistRepository";
import type { IGenreRepository } from "../repositories/contracts/IGenreRepository";
import type { ISongRepository } from "../repositories/contracts/ISongRepository";

import type { Album } from "../types/album/Album";
import type { Artist } from "../types/artist/Artist";
import type { Genre } from "../types/genre/Genre";
import type { Song } from "../types/song/Song";

export class MusicService {
  constructor(
    private genreRepository: IGenreRepository,
    private artistRepository: IArtistRepository,
    private albumRepository: IAlbumRepository,
    private songRepository: ISongRepository
  ) {}

  async createGenre(genreData: Omit<Genre, 'id'>): Promise<Genre> {
    return this.genreRepository.createGenre(genreData);
  }

  async getAllGenres(): Promise<Genre[]> {
    return this.genreRepository.getAllGenres();
  }

  async getGenre(id: string): Promise<Genre | null> {
    return this.genreRepository.getGenre(id);
  }

  async deleteGenre(id: string): Promise<void> {
    return this.genreRepository.deleteGenre(id);
  }

  async createArtist(artistData: Omit<Artist, 'id'>): Promise<Artist> {
    const genre = await this.genreRepository.getGenre(artistData.genreId);
    if (!genre) {
      throw new Error('Genre does not exist');
    }
    return this.artistRepository.createArtist(artistData);
  }

  async getArtist(id: string): Promise<Artist | null> {
    return this.artistRepository.getArtist(id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return this.artistRepository.getAllArtists();
  }

  async getArtistsByGenre(genreId: string): Promise<Artist[]> {
    return this.artistRepository.getArtistsByGenre(genreId);
  }

  async createAlbum(albumData: Omit<Album, 'id'>): Promise<Album> {
    const artist = await this.artistRepository.getArtist(albumData.artistId);
    if (!artist) {
      throw new Error('Artist does not exist');
    }
    return this.albumRepository.createAlbum(albumData);
  }

  async getAllAlbums(): Promise<Album[]> {
    return this.albumRepository.getAllAlbums();
  }

  async getAlbumsByArtist(artistId: string): Promise<Album[]> {
    return this.albumRepository.getAlbumsByArtist(artistId);
  }

  async getAlbumsByGenre(genreId: string): Promise<Album[]> {
    return this.albumRepository.getAlbumsByGenre(genreId);
  }

  async getAlbum(id: string): Promise<Album | null> {
    return this.albumRepository.getAlbum(id);
  }

  async getSongsByAlbum(albumId: string): Promise<Song[]> {
    return this.albumRepository.getSongsByAlbum(albumId);
  }

  async createSong(songData: Omit<Song, 'id'>): Promise<Song> {
    const album = await this.albumRepository.getAlbum(songData.albumId);
    if (!album) {
      throw new Error("Album does not exist");
    }
    return this.songRepository.createSong(songData);
  }

  async getSong(id: string): Promise<Song | null> {
    return this.songRepository.getSong(id);
  }

  async updateSong(id: string, updates: Partial<Song>): Promise<void> {
    return this.songRepository.updateSong(id, updates);
  }

  async deleteSong(id: string): Promise<void> {
    return this.songRepository.deleteSong(id);
  }

  async getAllSongs(): Promise<Song[]> {
    return this.songRepository.getAllSongs();
  }

  async getSongsByAlbumFromSongRepo(albumId: string): Promise<Song[]> {
    return this.songRepository.getSongsByAlbum(albumId);
  }
}
