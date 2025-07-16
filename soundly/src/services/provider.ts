import { FirebaseAlbumRepository } from "../repositories/concretes/AlbumRepository";
import { FirebaseArtistRepository } from "../repositories/concretes/ArtistRepository";
import { FirebaseGenreRepository } from "../repositories/concretes/GenreRepository";
import { SongRepository } from "../repositories/concretes/SongRepository";
import { MusicService } from './music';

const genreRepository = new FirebaseGenreRepository();
const artistRepository = new FirebaseArtistRepository();
const albumRepository = new FirebaseAlbumRepository();
const songRepository = new SongRepository();

export const musicService = new MusicService(
  genreRepository,
  artistRepository,
  albumRepository,
  songRepository
);
