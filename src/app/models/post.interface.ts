export interface Post {
  id?: number;
  title: string;
  content: string;
  userId: number;
  categoryId: number;
  status?: string;
  createdAt?: string;
  userName?: string;
  categoryName?: string;
  commentCount?: number;
  
  // Propiedades adicionales para ThreadView
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  views?: number;
  date?: string | Date;
  comments?: any[];
  author?: {
    id: number;
    name: string;
    avatar: string;
    title: string;
    joinDate: string | Date;
    postCount: number;
  };
  category?: {
    id: number;
    name: string;
  };
} 