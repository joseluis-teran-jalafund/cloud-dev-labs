import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router';
import { musicService } from '../../services/provider';
import type { Album } from "../../types/album/Album";
import type { Artist } from "../../types/artist/Artist";
import type { Genre } from "../../types/genre/Genre";
import type { Song } from '../../types/song/Song';
import TrackList from '../../components/organisms/TrackList';

const AlbumPage: React.FC = () => {
  const { albumId } = useParams<{ albumId: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentTrackUrl, setCurrentTrackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const albumData = await musicService.getAlbum(albumId!);
        setAlbum(albumData);

        if (albumData) {
          const [artistData, genreData, songsData] = await Promise.all([
            musicService.getArtist(albumData.artistId),
            albumData.genreId ? musicService.getGenre(albumData.genreId) : Promise.resolve(null),
            musicService.getSongsByAlbum(albumId!)
          ]);

          setArtist(artistData);
          setGenre(genreData);
          setSongs(songsData);

          if (songsData.length > 0 && songsData[0].audioUrl) {
            setCurrentTrackUrl(songsData[0].audioUrl);
          }
        }
      } catch (error) {
        console.error('Error loading album data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albumId]);

  const handlePlay = () => {
    audioRef.current?.play();
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!album) return <div className="p-6 text-red-500">Album not found</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="flex-shrink-0">
          <img 
            src={album.coverUrl || 'https://via.placeholder.com/500'} 
            alt={album.title}
            className="w-64 h-64 rounded-lg object-cover shadow-xl"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
          <Link 
            to={`/artists/${artist?.artistId}`} 
            className="text-xl text-gray-700 hover:underline block mb-4"
          >
            {artist?.name || 'Unknown Artist'}
          </Link>

          <div className="flex flex-wrap gap-3 mb-6">
            {genre && (
              <Link 
                to={`/genres/${genre.genreId}`} 
                className="bg-gray-200 rounded-full px-4 py-1 text-sm font-medium hover:bg-gray-300"
              >
                {genre.name}
              </Link>
            )}
            <span className="bg-gray-200 rounded-full px-4 py-1 text-sm font-medium">
              {album.year}
            </span>
            <span className="bg-gray-200 rounded-full px-4 py-1 text-sm font-medium">
              {album.trackCount || 'N/A'} tracks
            </span>
          </div>

          <button
            onClick={handlePlay}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-3 font-bold flex items-center gap-2 mb-6"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Play Album
          </button>
        </div>
      </div>

      <section className="bg-white rounded-lg shadow overflow-hidden">
        <h2 className="sr-only">Track List</h2>
        <TrackList albumId={albumId!} />
      </section>

      {artist && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">More by {artist.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {/* otros álbumes */}
          </div>
        </section>
      )}
    </div>
  );
};

export default AlbumPage;
