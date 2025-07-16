import React, { useEffect, useState } from "react";
import DashboardCard from "../../components/admin/DashboardCard";
import { musicService } from "../../services/provider";

const AdminDashboard: React.FC = () => {
  const [genresCount, setGenresCount] = useState<number>(0);
  const [artistsCount, setArtistsCount] = useState<number>(0);
  const [albumsCount, setAlbumsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [genres, artists, albums] = await Promise.all([
          musicService.getAllGenres(),
          musicService.getAllArtists(),
          musicService.getAllAlbums(),
        ]);
        setGenresCount(genres.length);
        setArtistsCount(artists.length);
        setAlbumsCount(albums.length);
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Genres"
          value={genresCount}
          icon={<MusicNoteIcon />}
          linkTo="/admin/genres"
          linkText="See All"
        />

        <DashboardCard
          title="Artists"
          value={artistsCount}
          icon={<UserGroupIcon />}
          linkTo="/admin/artists"
          linkText="Manage"
        />

        <DashboardCard
          title="Albums"
          value={albumsCount}
          icon={<AlbumIcon />}
          linkTo="/admin/albums"
          linkText="Explore"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <p className="text-gray-600">Coming Soon...</p>
        )}
      </div>
    </div>
  );
};

const MusicNoteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const UserGroupIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a3 3 0 11-6 0 3 3 0 016 0zM7 10a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const AlbumIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
    />
  </svg>
);

export default AdminDashboard;
