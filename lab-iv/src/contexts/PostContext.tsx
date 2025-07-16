import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Post, CreatePostRequest } from '../types/post/Post';
import { PostRepository } from '../repositories/PostRepository';
import { useAuth } from './AuthContext';

interface PostsContextType {
  posts: Post[];
  loading: boolean;
  error: string | null;
  createPost: (postData: CreatePostRequest) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType | null>(null);

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userPosts = await PostRepository.getPostsByUser(currentUser.uid);
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: CreatePostRequest) => {
    try {
      await PostRepository.createPost(postData);
      await fetchPosts();
    } catch (err) {
      setError('Failed to create post');
      throw err;
    }
  };

    const deletePost = async (postId: string) => {
    if (!currentUser) {
        throw new Error('You must be logged in to delete posts');
    }

    try {
        await PostRepository.deletePost(postId, currentUser.uid);
        setPosts(posts.filter(post => post.postId !== postId));
    } catch (err) {
        setError('Failed to delete post: ' + err.message);
        throw err;
    }
    };

  useEffect(() => {
    fetchPosts();
  }, [currentUser]);

  const value = {
    posts,
    loading,
    error,
    createPost,
    deletePost,
    refreshPosts: fetchPosts,
  };

  return (
    <PostsContext.Provider value={value}>
      {children}
    </PostsContext.Provider>
  );
}
