import React from 'react';
import { Link } from 'react-router';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../../services/cloudinary/CloudinaryConfig';
import type { Genre } from '../../types/genre/Genre';
import { fill } from '@cloudinary/url-gen/actions/resize';

interface GenreCardProps {
  genre: Genre;
  onDelete?: (id: string) => void;
  showAdminControls?: boolean;
}

const getPublicId = (url: string) => {
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  return parts.slice(uploadIndex + 2).join('/').replace(/\..+$/, '');
};

const GenreCard: React.FC<GenreCardProps> = ({ 
  genre, 
  onDelete, 
  showAdminControls = false 
}) => {
  return (
    <div className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link to={`/genres/${genre.genreId}`} className="block">
        <div className="aspect-square">
          <AdvancedImage
            cldImg={cld.image(getPublicId(genre.imageUrl || 'default-public-id')).resize(fill().width(800).height(400))}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            alt={genre.name}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white text-lg font-bold">{genre.name}</h3>
          {genre.description && (
            <p className="text-gray-200 text-sm mt-1 line-clamp-2">
              {genre.description}
            </p>
          )}
        </div>
      </Link>

      {showAdminControls && (
        <div className="absolute top-2 right-2 flex gap-2">
          <Link 
            to={`/genres/${genre.genreId}/edit`}
            className="bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow"
            aria-label="Edit genre"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          
          <button
            onClick={() => onDelete && onDelete(genre.genreId || 'genreId')}
            className="bg-white/90 hover:bg-white text-red-600 p-2 rounded-full shadow"
            aria-label="Delete genre"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {genre.featured && (
        <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
          Featured
        </div>
      )}
    </div>
  );
};

export default GenreCard;
