import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { musicService } from '../../services/provider';
import type { Album } from "../../types/album/Album";
import type { Artist } from "../../types/artist/Artist";
import type { Genre } from "../../types/genre/Genre";
import AlbumCard from '../../components/molecules/AlbumCard';
import ArtistCard from '../../components/molecules/ArtistCard';

const GenrePage: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [genre, setGenre] = useState<Genre | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [genreData, artistsData, albumsData] = await Promise.all([
          musicService.getGenre(genreId!),
          musicService.getArtistsByGenre(genreId!),
          musicService.getAlbumsByGenre(genreId!)
        ]);
        
        setGenre(genreData);
        setArtists(artistsData);
        setAlbums(albumsData);
      } catch (error) {
        console.error('Error loading genre data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [genreId]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!genre) return <div className="p-6 text-red-500">Genre not found</div>;

  return (
    <div className="p-6">
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-800 rounded-xl p-8 mb-8 overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">{genre.name}</h1>
          <p className="text-purple-200 max-w-2xl">
            Explore {artists.length} artists and {albums.length} albums in this genre
          </p>
        </div>
        <div className="absolute inset-0 bg-noise opacity-20"></div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.slice(0, 6).map(artist => (
            <ArtistCard key={artist.artistId} artist={artist} />
          ))}
        </div>
        {artists.length > 6 && (
          <div className="mt-4 text-center">
            <Link 
              to={`/artists?genre=${genreId}`} 
              className="text-indigo-600 hover:underline"
            >
              View all artists →
            </Link>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Popular Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {albums.slice(0, 5).map(album => (
            <AlbumCard key={album.albumId} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default GenrePage;
