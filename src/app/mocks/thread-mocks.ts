// src/app/mocks/thread-mocks.ts

// --- Interfaces ---
export interface Author {
  id: string;
  name: string;
  avatar: string;
  title: string;
  joinDate: Date;
  postCount: number;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  date: Date;
  likes: number;
  isLiked: boolean;
}

export interface Thread {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  };
  author: Author;
  content: string;
  date: Date;
  tags: string[];
  views: number;
  comments: Comment[];
  isLocked: boolean;
  isPinned: boolean;
}

// --- Datos Simulados Simplificados ---

const mockAuthor: Author = {
  id: 'user123',
  name: 'dev_master',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
  title: 'Master Coder',
  joinDate: new Date('2022-01-10'),
  postCount: 356
};

const mockComments: Comment[] = [
  {
    id: 'comment1',
    author: {
      id: 'user456',
      name: 'angular_fan',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
      title: 'Frontend Enthusiast',
      joinDate: new Date('2022-05-15'),
      postCount: 128
    },
    content: '¡Excelente post! Muy útil para entender las novedades de Angular 16. ¿Alguien ha probado ya los signals en producción? (Aquí iría un bloque de código de ejemplo)',
    date: new Date('2023-08-25T10:30:00'),
    likes: 15,
    isLiked: false
  },
  {
    id: 'comment2',
    author: {
      id: 'user789',
      name: 'react_dev',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
      title: 'React Developer',
      joinDate: new Date('2021-11-20'),
      postCount: 85
    },
    content: 'Aunque uso React, este artículo es muy interesante. Angular ha avanzado mucho. Buen trabajo.',
    date: new Date('2023-08-25T11:15:00'),
    likes: 8,
    isLiked: true
  }
];

export const MOCK_THREAD: Thread = {
  id: '1',
  title: 'Mejores prácticas con Angular 16',
  category: { id: '1', name: 'Desarrollo Frontend' },
  author: mockAuthor,
  content: 'Contenido principal del post sobre Angular 16. \nAquí se explicarían los Signals, Required Inputs, DestroyRef, etc. \n**Este texto está en negrita.**\n*Este texto está en cursiva.*\n(Se omiten los bloques de código complejos para evitar errores de sintaxis en los mocks.)',
  date: new Date('2023-08-25T09:00:00'),
  tags: ['angular', 'frontend', 'javascript', 'typescript', 'signals'],
  views: 1358,
  comments: mockComments,
  isLocked: false,
  isPinned: true
};
