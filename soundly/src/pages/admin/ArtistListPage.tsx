import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { musicService } from '../../services/provider';
import Button from '../../components/atoms/Button';
import type { Artist } from '../../types/artist/Artist';
import type { Genre } from '../../types/genre/Genre';

const ArtistListPage: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
    const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const getGenreName = (genreId: string): string => {
    const genre = genres.find((g) => g.genreId === genreId);
    return genre?.name || 'Unknown';
  };

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const [artistData, genreData] = await Promise.all([
          musicService.getAllArtists(),
          musicService.getAllGenres(),
        ]);
        setArtists(artistData);
        setGenres(genreData);
      } catch (err) {
        setError('Failed to load artists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtists();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading artists...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artists</h1>
        <Link to="/admin/artists/new">
          <Button variant="primary">Add New Artist</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Followers</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {artists.map((artist) => (
              <tr key={artist.artistId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={artist.imageUrl || 'https://via.placeholder.com/150'} 
                      alt={artist.name} 
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{artist.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {getGenreName(artist.genreId)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {artist.followers || 0} followers
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {artist.isVerified ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      Verified
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/admin/artists/edit/${artist.artistId}`} 
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </Link>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => console.log('Delete', artist.artistId)}
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">{artists.length}</span> artists
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={true}>Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
};

export default ArtistListPage;
