import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadAudio } from '../../services/cloudinary/AudioUpload';
import { musicService } from '../../services/provider';
import type { Song } from '../../types/song/Song';
import Button from '../atoms/Button';

interface SongFormProps {
  albumId: string;
  onSuccess?: () => void;
}

const SongForm: React.FC<SongFormProps> = ({ albumId, onSuccess }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Omit<Song, 'songId'>>({
    defaultValues: { albumId },
  });

  const [audioUploading, setAudioUploading] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  const handleAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAudioUploading(true);
      const audioUrl = await uploadAudio(file);
      setValue('audioUrl', audioUrl);
      setAudioError(null);
    } catch (error) {
      console.error(error);
      setAudioError('Failed to upload audio. Please try again.');
    } finally {
      setAudioUploading(false);
    }
  };

  const onSubmit = async (data: Omit<Song, 'songId'>) => {
    try {
      await musicService.createSong(data);
      onSuccess?.();
    } catch (err) {
      console.error('Error creating song:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Song Title *</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
        />
        {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Track Number</label>
        <input
          type="number"
          {...register('trackNumber', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Duration (seconds)</label>
        <input
          type="number"
          {...register('duration', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Audio File *</label>
        <input type="file" accept="audio/*" onChange={handleAudioChange} />
        {audioUploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {audioError && <p className="text-sm text-red-600">{audioError}</p>}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" variant="primary" disabled={audioUploading}>
          Save Song
        </Button>
      </div>
    </form>
  );
};

export default SongForm;
