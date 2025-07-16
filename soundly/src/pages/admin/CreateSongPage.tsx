import React from 'react';
import { useNavigate, useParams } from 'react-router';
import SongForm from '../../components/organisms/SongForm';
import Button from '../../components/atoms/Button';

const CreateSongPage: React.FC = () => {
  const { albumId } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate(`/admin/albums/${albumId}`);
  };

  if (!albumId) {
    return <p>Missing album ID.</p>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add New Song</h1>
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <SongForm albumId={albumId} onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateSongPage;
