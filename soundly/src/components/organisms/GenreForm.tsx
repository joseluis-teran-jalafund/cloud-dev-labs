import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { uploadImage } from '../../services/cloudinary/ImageUpload';
import { musicService } from '../../services/provider';
import Button from '../atoms/Button';
import type { CreateGenreRequest } from '../../types/genre/CreateGenreRequest';

interface GenreFormProps {
  onSuccess?: () => void;
  initialData?: CreateGenreRequest;
}

const GenreForm: React.FC<GenreFormProps> = ({ onSuccess, initialData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateGenreRequest>({
    defaultValues: initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  const onSubmit = async (data: CreateGenreRequest) => {
    try {
      setIsSubmitting(true);
      await musicService.createGenre(data);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating genre:', error);
      setUploadError('Failed to create genre. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Genre Name *
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Genre name is required' })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm ${
            errors.name ? 'border-red-500' : 'border'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Genre Image</label>
        <div className="mt-1 flex items-center">
          {imagePreview && (
            <div className="mr-4 flex-shrink-0">
              <img
                className="h-16 w-16 rounded-md object-cover"
                src={imagePreview}
                alt="Genre preview"
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
          id="featured"
          type="checkbox"
          {...register('featured')}
          className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
          Featured Genre
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
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Save Genre
        </Button>
      </div>
    </form>
  );
};

export default GenreForm;
