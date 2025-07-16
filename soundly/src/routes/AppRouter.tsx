import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../layouts/AdminLayout';
import UserLayout from '../layouts/UserLayout';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/user/HomePage';
import GenrePage from '../pages/user/GenrePage';
import ArtistPage from '../pages/user/ArtistPage';
import AlbumPage from '../pages/user/AlbumPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import GenreListPage from '../pages/admin/GenreListPage';
import GenreDetailPage from '../pages/admin/GenreDetailPage';
import ArtistListPage from '../pages/admin/ArtistListPage';
import AlbumListPage from '../pages/admin/AlbumListPage';
import CreateGenrePage from '../pages/admin/CreateGenrePage';
import CreateArtistPage from '../pages/admin/CreateArtistPage';
import CreateAlbumPage from '../pages/admin/CreateAlbumPage';
import SongListPage from '../pages/admin/SongListPage';
import CreateSongPage from '../pages/admin/CreateSongPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }>
          <Route index element={<HomePage />} />
          <Route path="genres/:genreId" element={<GenrePage />} />
          <Route path="artists/:artistId" element={<ArtistPage />} />
          <Route path="albums/:albumId" element={<AlbumPage />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          
          <Route path="genres">
            <Route index element={<GenreListPage />} />
            <Route path="new" element={<CreateGenrePage />} />
            <Route path=":genreId" element={<GenreDetailPage />} />
          </Route>

          <Route path="artists">
            <Route index element={<ArtistListPage />} />
            <Route path="new" element={<CreateArtistPage />} />
          </Route>

          <Route path="albums">
            <Route index element={<AlbumListPage />} />
            <Route path="new" element={<CreateAlbumPage />} />
          </Route>

          <Route path="songs">
            <Route index element={<SongListPage />} />
          </Route>
          <Route path="albums/:albumId/songs/new" element={<CreateSongPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
