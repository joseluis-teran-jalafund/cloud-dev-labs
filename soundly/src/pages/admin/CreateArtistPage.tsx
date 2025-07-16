import React from 'react';
import { useNavigate } from 'react-router';
import ArtistForm from '../../components/organisms/ArtistForm';
import Button from '../../components/atoms/Button';

const CreateArtistPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/artists');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Artist</h1>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/artists')}
        >
          Cancel
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <ArtistForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateArtistPage;
