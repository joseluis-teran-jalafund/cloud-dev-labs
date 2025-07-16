import React from 'react';
import { Link } from 'react-router';
import type { Album } from '../../types/album/Album';

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  return (
    <Link to={`/albums/${album.albumId}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <img 
          src={album.coverUrl || 'https://via.placeholder.com/300'} 
          alt={album.title}
          className="w-full aspect-square object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate group-hover:text-indigo-600">{album.title}</h3>
          <p className="text-gray-500 text-sm">{album.year}</p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;
