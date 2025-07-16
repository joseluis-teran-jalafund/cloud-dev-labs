import React from 'react';
import { Link } from 'react-router';
import type { Artist } from '../../types/artist/Artist';

const ArtistCard: React.FC<{ artist: Artist }> = ({ artist }) => {
  return (
    <Link to={`/artists/${artist.artistId}`} className="group text-center">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <img 
            src={artist.imageUrl || 'https://via.placeholder.com/300'} 
            alt={artist.name}
            className="w-40 h-40 rounded-full object-cover group-hover:ring-4 group-hover:ring-indigo-300 transition-all"
          />
          {artist.isVerified && (
            <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="font-medium group-hover:text-indigo-600">{artist.name}</h3>
        <p className="text-sm text-gray-500">{artist.followers || 0} followers</p>
      </div>
    </Link>
  );
};

export default ArtistCard;
