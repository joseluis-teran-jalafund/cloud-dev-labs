import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { musicService } from '../../services/provider';
import Button from '../../components/atoms/Button';
import type { Album } from '../../types/album/Album';
import type { Artist } from '../../types/artist/Artist';

const AlbumListPage: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const getArtistName = (artistId: string): string => {
    const artist = artists.find((a) => a.artistId === artistId);
    return artist?.name || 'Unknown';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [albumData, artistData] = await Promise.all([
          musicService.getAllAlbums(),
          musicService.getAllArtists(),
        ]);
        setAlbums(albumData);
        setArtists(artistData);
      } catch (err) {
        setError('Failed to load albums or artists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading albums...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Album Catalog</h1>
        <Link to="/admin/albums/new">
          <Button variant="primary">Add New Album</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {albums.slice(0, 5).map((album) => (
          <Link 
            key={album.albumId} 
            to={`/admin/albums/${album.albumId}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <img 
                src={album.coverUrl || 'https://via.placeholder.com/300'} 
                alt={album.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate group-hover:text-indigo-600">{album.title}</h3>
                <p className="text-gray-500 text-sm">{album.year}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracks</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {albums.map((album) => (
              <tr key={album.albumId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded object-cover" 
                      src={album.coverUrl || 'https://via.placeholder.com/150'} 
                      alt={album.title} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{album.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {getArtistName(album.artistId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {album.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {album.trackCount || 'N/A'} tracks
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/admin/albums/edit/${album.albumId}`} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/admin/albums/${album.albumId}/songs/new`} 
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Add Song
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => console.log('Delete', album.albumId)}
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">{Math.min(10, albums.length)}</span> of{' '}
          <span className="font-medium">{albums.length}</span> albums
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={true}>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default AlbumListPage;
