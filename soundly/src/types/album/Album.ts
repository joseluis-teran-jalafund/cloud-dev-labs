export interface Album {
  albumId?: string;
  title: string;
  artistId: string;
  coverUrl?: string;
  year: number;
  genreId: string;
  trackCount?: number;
  duration?: number;
}
