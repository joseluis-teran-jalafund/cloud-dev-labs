import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { musicService } from '../../services/provider';
import type { Album } from "../../types/album/Album";
import type { Artist } from "../../types/artist/Artist";
import type { Genre } from "../../types/genre/Genre";
import AlbumCard from '../../components/molecules/AlbumCard';

const ArtistPage: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [artistData, albumsData] = await Promise.all([
          musicService.getArtist(artistId!),
          musicService.getAlbumsByArtist(artistId!)
        ]);
        
        setArtist(artistData);
        setAlbums(albumsData);
        
        if (artistData?.genreId) {
          const genreData = await musicService.getGenre(artistData.genreId);
          setGenre(genreData);
        }
      } catch (error) {
        console.error('Error loading artist data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [artistId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!artist) return <div className="p-6 text-red-500">Artist not found</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <img 
            src={artist.imageUrl || 'https://via.placeholder.com/300'} 
            alt={artist.name}
            className="w-64 h-64 rounded-full object-cover shadow-lg"
          />
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
          {genre && (
            <Link 
              to={`/genres/${genre.genreId}`} 
              className="inline-block bg-gray-200 rounded-full px-4 py-1 text-sm font-medium mb-4 hover:bg-gray-300"
            >
              {genre.name}
            </Link>
          )}
          <p className="text-gray-700 mb-4">{artist.bio || 'No biography available'}</p>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              <strong>{artist.followers || 0}</strong> followers
            </span>
            {artist.isVerified && (
              <span className="flex items-center text-blue-500">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Artist
              </span>
            )}
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-6">Discography</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.map(album => (
            <AlbumCard key={album.albumId} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ArtistPage;
