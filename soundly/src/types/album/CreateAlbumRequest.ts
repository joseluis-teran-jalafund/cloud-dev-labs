export interface CreateAlbumRequest {
  title: string;
  artistId: string;
  coverUrl?: string;
  year: number;
  genreId: string;
  trackCount?: number;
  duration?: number;
}
