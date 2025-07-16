import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '../../services/cloudinary/ImageUpload';
import { musicService } from '../../services/provider';
import Button from '../atoms/Button';
import type { CreateAlbumRequest } from '../../types/album/CreateAlbumRequest';
import type { Artist } from '../../types/artist/Artist';
import type { Genre } from '../../types/genre/Genre';

interface AlbumFormProps {
  onSuccess?: () => void;
  initialData?: CreateAlbumRequest;
}

const AlbumForm: React.FC<AlbumFormProps> = ({ onSuccess, initialData }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CreateAlbumRequest>({
    defaultValues: initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.coverUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [artistsData, genresData] = await Promise.all([
          musicService.getAllArtists(),
          musicService.getAllGenres()
        ]);
        setArtists(artistsData);
        setGenres(genresData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoadingData(false);
      }
    };
    loadData();
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
      setValue('coverUrl', imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
      setImagePreview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: CreateAlbumRequest) => {
    try {
      setIsSubmitting(true);
      await musicService.createAlbum(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating album:', error);
      setUploadError('Failed to create album. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArtists = watch('genreId') 
    ? artists.filter(artist => artist.genreId === watch('genreId'))
    : artists;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Album Title *
        </label>
        <input
          id="title"
          type="text"
          {...register('title', { required: 'Album title is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.title ? 'border-red-500' : 'border'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            disabled={loadingData}
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
          <label htmlFor="artistId" className="block text-sm font-medium text-gray-700">
            Artist *
          </label>
          <select
            id="artistId"
            {...register('artistId', { required: 'Artist is required' })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.artistId ? 'border-red-500' : 'border'
            }`}
            disabled={loadingData || !watch('genreId')}
          >
            <option value="">Select an artist</option>
            {filteredArtists.map(artist => (
              <option key={artist.artistId} value={artist.artistId}>
                {artist.name}
              </option>
            ))}
          </select>
          {errors.artistId && (
            <p className="mt-1 text-sm text-red-600">{errors.artistId.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">
            Release Year *
          </label>
          <input
            id="year"
            type="number"
            min="1900"
            max={new Date().getFullYear() + 1}
            {...register('year', { 
              required: 'Year is required',
              valueAsNumber: true
            })}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
              errors.year ? 'border-red-500' : 'border'
            }`}
          />
          {errors.year && (
            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="trackCount" className="block text-sm font-medium text-gray-700">
            Track Count
          </label>
          <input
            id="trackCount"
            type="number"
            min="1"
            {...register('trackCount', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Album Cover</label>
        <div className="mt-1 flex items-center">
          {imagePreview && (
            <div className="mr-4 flex-shrink-0">
              <img
                className="h-32 w-32 rounded-md object-cover"
                src={imagePreview}
                alt="Album cover preview"
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
          disabled={isSubmitting || loadingData}
          isLoading={isSubmitting}
        >
          Save Album
        </Button>
      </div>
    </form>
  );
};

export default AlbumForm;
