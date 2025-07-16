export interface Post {
  postId?: string;
  title: string;
  content: string;
  imageUrl?: string;
  userId: string;
  createdAt: Date;
}
