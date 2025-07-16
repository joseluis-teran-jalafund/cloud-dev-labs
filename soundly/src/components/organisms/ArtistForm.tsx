import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '../../services/cloudinary/ImageUpload';
import { musicService } from '../../services/provider';
import Button from '../atoms/Button';
import type { CreateArtistRequest } from '../../types/artist/CreateArtistRequest';
import type { Genre } from '../../types/genre/Genre';

interface ArtistFormProps {
  onSuccess?: () => void;
  initialData?: CreateArtistRequest;
}

const ArtistForm: React.FC<ArtistFormProps> = ({ onSuccess, initialData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateArtistRequest>({
    defaultValues: initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const data = await musicService.getAllGenres();
        setGenres(data);
      } catch (error) {
        console.error('Error loading genres:', error);
      } finally {
        setLoadingGenres(false);
      }
    };
    loadGenres();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsSubmitting(true);
      setUploadError(null);
      const imageUrl = await uploadImage(file);
      setValue('imageUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: CreateArtistRequest) => {
    try {
      setIsSubmitting(true);
      await musicService.createArtist(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating artist:', error);
      setUploadError('Failed to create artist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Artist Name *
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Artist name is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.name ? 'border-red-500' : 'border'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="genreId" className="block text-sm font-medium text-gray-700">
          Genre *
        </label>
        <select
          id="genreId"
          {...register('genreId', { required: 'Genre is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.genreId ? 'border-red-500' : 'border'
          }`}
          disabled={loadingGenres}
        >
          <option value="">Select a genre</option>
          {genres.map(genre => (
            <option key={genre.genreId} value={genre.genreId}>
              {genre.name}
            </option>
          ))}
        </select>
        {errors.genreId && (
          <p className="mt-1 text-sm text-red-600">{errors.genreId.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Biography
        </label>
        <textarea
          id="bio"
          rows={4}
          {...register('bio')}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Artist Image</label>
        <div className="mt-1 flex items-center">
          {imagePreview && (
            <div className="mr-4 flex-shrink-0">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={imagePreview}
                alt="Artist preview"
              />
            </div>
          )}
          <label className="cursor-pointer">
            <span className="rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              {imagePreview ? 'Change Image' : 'Upload Image'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
          </label>
        </div>
        {uploadError && (
          <p className="mt-1 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isVerified"
          type="checkbox"
          {...register('isVerified')}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-700">
          Verified Artist
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => onSuccess?.()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || loadingGenres}
          isLoading={isSubmitting}
        >
          Save Artist
        </Button>
      </div>
    </form>
  );
};

export default ArtistForm;
