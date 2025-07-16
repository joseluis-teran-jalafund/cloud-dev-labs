import React from 'react';
import { useNavigate } from 'react-router';
import AlbumForm from '../../components/organisms/AlbumForm';
import Button from '../../components/atoms/Button';

const CreateAlbumPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/albums');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Album</h1>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/albums')}
        >
          Cancel
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <AlbumForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateAlbumPage;
