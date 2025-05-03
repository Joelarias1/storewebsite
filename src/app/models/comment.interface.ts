export interface Comment {
  id?: number;
  content: string;
  postId: number;
  userId: number;
  status?: string;
  createdAt?: string;
  userName?: string;
} 