import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../../services/cloudinary/CloudinaryConfig';
import type { Artist } from '../../types/artist/Artist';
import type { Genre } from '../../types/genre/Genre';
import { musicService } from '../../services/provider';
import { fill } from '@cloudinary/url-gen/actions/resize';

const GenreDetailPage: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [genreData, artistsData] = await Promise.all([
          musicService.getGenre(genreId!),
          musicService.getArtistsByGenre(genreId!)
        ]);
        
        if (!genreData) {
          throw new Error('Genre not found');
        }

        setGenre(genreData);
        setArtists(artistsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <Link 
          to="/" 
          className="text-green-600 hover:underline mt-4 inline-block"
        >
          Browse all genres
        </Link>
      </div>
    );
  }

  if (!genre) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Genre not found</h2>
        <Link 
          to="/" 
          className="text-green-600 hover:underline mt-4 inline-block"
        >
          Browse all genres
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-48 h-48 flex-shrink-0 shadow-xl rounded-lg overflow-hidden">
          <AdvancedImage
            cldImg={cld.image(getPublicId(genre.imageUrl || 'default-public-id')).resize(fill().width(800).height(400))}
            className="w-full h-full object-cover"
            alt={genre.name}
          />
        </div>
        
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{genre.name}</h1>
          {genre.description && (
            <p className="text-gray-600 mb-4">{genre.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {artists.length} {artists.length === 1 ? 'artist' : 'artists'}
            </span>
            {genre.featured && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>
        </div>
      </div>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
          <Link 
            to={`/artists/new?genre=${genre.genreId}`}
            className="text-sm text-green-600 hover:underline"
          >
            Add New Artist
          </Link>
        </div>
        
        {artists.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No artists found in this genre</p>
            <Link
              to={`/artists/new?genre=${genre.genreId}`}
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add First Artist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.artistId} artist={artist} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const getPublicId = (url: string) => {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    return parts.slice(uploadIndex + 2).join('/').replace(/\..+$/, '');
  };

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => (
  <Link 
    to={`/artists/${artist.artistId}`} 
    className="group text-center transition-transform hover:scale-105"
  >
    <div className="relative aspect-square overflow-hidden rounded-full shadow-lg mb-3 mx-auto">
      <AdvancedImage
        cldImg={cld.image(getPublicId(artist.imageUrl || 'default-public-id')).resize(fill().width(800).height(400))}
        className="w-full h-full object-cover"
        alt={artist.name}
      />
      {artist.isVerified && (
        <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
    <h3 className="font-medium group-hover:text-green-500 transition-colors">
      {artist.name}
    </h3>
    {artist.followers && (
      <p className="text-xs text-gray-500 mt-1">
        {new Intl.NumberFormat().format(artist.followers)} followers
      </p>
    )}
  </Link>
);

export default GenreDetailPage;
