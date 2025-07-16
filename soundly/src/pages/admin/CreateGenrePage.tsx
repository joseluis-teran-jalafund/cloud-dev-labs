import React from 'react';
import { useNavigate } from 'react-router';
import GenreForm from '../../components/organisms/GenreForm';

const CreateGenrePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/genres');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Genre</h1>
        <button 
          onClick={() => navigate('/genres')}
          className="text-gray-500 hover:text-gray-700"
        >
          &larr; Back to Genres
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <GenreForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateGenrePage;
