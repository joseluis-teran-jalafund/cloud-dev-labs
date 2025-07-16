import React, { useRef, useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { useNavigate } from 'react-router';
import { uploadImage } from '../../services/cloudinary/UploadImage';

export const PostForm = ({ onSuccess }: PostFormProps) => {
  const { createPost } = usePosts();
  const { currentUser } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await uploadImage(image);
      }

      await createPost({
        title,
        content,
        imageUrl: imageUrl || undefined,
        userId: currentUser.uid,
      });

      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      onSuccess?.();
      navigate('/');
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Create New Post</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Post Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-2"
          >
            {image ? 'Change Image' : 'Add Image'}
          </Button>
          
          {imagePreview && (
            <div className="mt-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-h-64 w-full object-contain rounded-md"
              />
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="mt-2 w-full"
              >
                Remove Image
              </Button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Posting...' : 'Create Post'}
        </Button>
      </form>
    </div>
  );
};
