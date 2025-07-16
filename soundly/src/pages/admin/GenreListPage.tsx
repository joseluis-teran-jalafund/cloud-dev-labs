import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { musicService } from '../../services/provider';
import GenreCard from '../../components/molecules/GenreCard';
import Button from '../../components/atoms/Button';
import type { Genre } from '../../types/genre/Genre';

const GenreListPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const data = await musicService.getAllGenres();
        setGenres(data);
      } catch (err) {
        setError('Failed to load genres');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading genres...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Browse Genres</h1>
        <Link to="/admin/genres/new">
          <Button variant="primary">Add New Genre</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <GenreCard key={genre.genreId} genre={genre} />
        ))}
      </div>
    </div>
  );
};

export default GenreListPage;
