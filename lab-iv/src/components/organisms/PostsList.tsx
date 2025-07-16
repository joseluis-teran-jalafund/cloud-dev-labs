import { useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { Button } from '../atoms/Button';
import { fill } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from '@cloudinary/react';
import cld from '../../services/cloudinary/CloudinaryConfig';

export const PostsList = () => {
  const { posts, loading, error, deletePost } = usePosts();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;
  if (posts.length === 0) return <div>No posts yet. Create your first post!</div>;

  const handleDelete = async (postId: string) => {
    setDeletingId(postId);
    try {
      await deletePost(postId);
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  const getPublicId = (url: string) => {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    return parts.slice(uploadIndex + 2).join('/').replace(/\..+$/, '');
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.postId} className="bg-white shadow rounded-lg overflow-hidden">
          {post.imageUrl && (
            <div className="w-full h-64 bg-gray-100 overflow-hidden">
              <AdvancedImage
                cldImg={cld.image(getPublicId(post.imageUrl)).resize(fill().width(800).height(400))}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h3 className="font-semibold text-xl">{post.title}</h3>
            <p className="text-gray-600 mt-2">{post.content}</p>
            <div className="text-sm text-gray-500">
              Posted on {post.createdAt.toLocaleDateString()}
            </div>
            <Button
              onClick={() => deletePost(post.postId!)}
              variant="danger"
              className="mt-4"
            >
              Delete Post
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
