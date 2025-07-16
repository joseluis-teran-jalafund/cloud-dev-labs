import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { musicService } from '../../services/provider';
import Button from '../../components/atoms/Button';
import type { Song } from '../../types/song/Song';
import type { Artist } from '../../types/artist/Artist';
import type { Album } from '../../types/album/Album';

const SongListPage: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getArtistName = (artistId: string): string => {
    const artist = artists.find((a) => a.artistId === artistId);
    return artist?.name || 'Unknown';
  };

  const getAlbumTitle = (albumId: string): string => {
    const album = albums.find((a) => a.albumId === albumId);
    return album?.title || 'Unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumData, artistData, songData] = await Promise.all([
          musicService.getAllAlbums(),
          musicService.getAllArtists(),
          musicService.getAllSongs(),
        ]);
        
        setAlbums(albumData);
        setArtists(artistData);
        setSongs(songData);
      } catch (err) {
        setError('Failed to load songs, artists, or albums');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading songs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Song Catalog</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Album</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {songs.map((song) => (
              <tr key={song.songId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-900">{song.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{getArtistName(song.artistId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{getAlbumTitle(song.albumId)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{song.duration || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/admin/songs/edit/${song.songId}`} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => console.log('Delete', song.songId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, songs.length)}</span> of{' '}
          <span className="font-medium">{songs.length}</span> songs
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={true}>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default SongListPage;
