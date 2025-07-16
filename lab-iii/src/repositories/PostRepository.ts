import type { Post, CreatePostDTO } from '../types/Post';
import { firebaseDb } from '../services/firebase/FirebaseConfig';
import { 
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
  getDoc 
} from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const postsCollection = collection(firebaseDb, 'posts');

export const PostRepository = {
  async createPost(postData: CreatePostDTO): Promise<Post> {
    try {
      const docRef = await addDoc(postsCollection, {
        ...postData,
        createdAt: new Date(),
      });
      
      return {
        postId: docRef.id,
        ...postData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error as FirebaseError;
    }
  },

  async getPostsByUser(userId: string): Promise<Post[]> {
    try {
      const q = query(postsCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        postId: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Post[];
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error as FirebaseError;
    }
  },

  async deletePost(postId: string, userId: string): Promise<void> {
    try {
      const postRef = doc(firebaseDb, 'posts', postId);
      const postSnap = await getDoc(postRef);
      
      if (!postSnap.exists()) {
        throw new Error('Post not found');
      }
      
      const postData = postSnap.data();
      if (postData.userId !== userId) {
        throw new Error('You can only delete your own posts');
      }

      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
};
