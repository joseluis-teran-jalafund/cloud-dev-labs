import { useState } from 'react';
import { usePosts } from '../../contexts/PostContext';
import { Button } from '../atoms/Button';

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

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.postId} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
          <p className="text-gray-700 mb-4">{post.content}</p>
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
      ))}
    </div>
  );
};
