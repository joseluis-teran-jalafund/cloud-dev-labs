export interface Post {
  postId?: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  userId: string;
}
