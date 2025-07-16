export interface Artist {
  artistId?: string;
  name: string;
  imageUrl?: string;
  genreId: string;
  followers?: number;
  bio?: string;
  isVerified?: boolean;
}
