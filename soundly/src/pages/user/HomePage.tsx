import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { musicService } from '../../services/provider';
import type { Genre } from '../../types/genre/Genre';
import type { Artist } from '../../types/artist/Artist';
import type { Album } from '../../types/album/Album';
import AlbumCard from '../../components/molecules/AlbumCard';
import ArtistCard from '../../components/molecules/ArtistCard';
import GenreCard from '../../components/molecules/GenreCard';

const HomePage: React.FC = () => {
  const [featuredGenres, setFeaturedGenres] = useState<Genre[]>([]);
  const [popularArtists, setPopularArtists] = useState<Artist[]>([]);
  const [newReleases, setNewReleases] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [genresData, artistsData, albumsData] = await Promise.all([
          musicService.getAllGenres(),
          musicService.getAllArtists(),
          musicService.getAllAlbums()
        ]);

        setFeaturedGenres(genresData.slice(0, 6));
        setPopularArtists(
          artistsData
            .sort((a, b) => (b.followers || 0) - (a.followers || 0))
            .slice(0, 6)
        );
        setNewReleases(
          albumsData
            .sort((a, b) => b.year - a.year)
            .slice(0, 6)
        );
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-800 rounded-xl p-8 text-white overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">Welcome to Soundly</h1>
          <p className="text-lg mb-6 max-w-2xl">
            Discover new music, explore your favorite artists, and create perfect playlists.
          </p>
          <button className="bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
            Explore Now
          </button>
        </div>
        <div className="absolute inset-0 bg-noise opacity-10"></div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Browse Genres</h2>
          <Link to="/genres" className="text-green-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {featuredGenres.map(genre => (
            <GenreCard key={genre.genreId} genre={genre} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
          <Link to="/artists" className="text-green-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {popularArtists.map(artist => (
            <ArtistCard key={artist.artistId} artist={artist} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Releases</h2>
          <Link to="/albums" className="text-green-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {newReleases.map(album => (
            <AlbumCard key={album.albumId} album={album} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
