export interface CreateArtistRequest {
  name: string;
  imageUrl?: string;
  genreId: string;
  followers?: number;
  bio?: string;
  isVerified?: boolean;
}
