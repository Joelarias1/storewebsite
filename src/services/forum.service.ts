import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post } from '../app/models/post.interface';
import { Category } from '../app/models/category.interface';
import { Comment } from '../app/models/comment.interface';
import { ApiResponse } from '../app/models/response.interface';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private apiUrl = `${environment.apiUrl}/api`;

  constructor(private http: HttpClient) { }

  // ===================== CATEGORÍAS =====================

  /**
   * Obtiene todas las categorías del foro
   */
  getCategories(): Observable<Category[]> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener categorías');
        }),
        catchError(error => {
          console.error('Error en getCategories:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene una categoría por su ID
   */
  getCategoryById(categoryId: number): Observable<Category> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${categoryId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Categoría no encontrada');
        }),
        catchError(error => {
          console.error(`Error en getCategoryById(${categoryId}):`, error);
          throw error;
        })
      );
  }

  // ===================== POSTS =====================

  /**
   * Obtiene todos los posts
   */
  getAllPosts(): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/posts`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener posts');
        }),
        catchError(error => {
          console.error('Error en getAllPosts:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene posts paginados
   */
  getPagedPosts(page: number = 0, size: number = 10, sortBy: string = 'createdAt', direction: string = 'desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('direction', direction);

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/posts/paged`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener posts paginados');
        }),
        catchError(error => {
          console.error('Error en getPagedPosts:', error);
          throw error;
        })
      );
  }

  /**
   * Obtiene un post por su ID
   */
  getPostById(postId: number): Observable<Post> {
    return this.http.get<ApiResponse<Post>>(`${this.apiUrl}/posts/${postId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Post no encontrado');
        }),
        catchError(error => {
          console.error(`Error en getPostById(${postId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Crea un nuevo post
   */
  createPost(post: Post): Observable<Post> {
    return this.http.post<ApiResponse<Post>>(`${this.apiUrl}/posts/create`, post)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al crear el post');
        }),
        catchError(error => {
          console.error('Error en createPost:', error);
          throw error;
        })
      );
  }

  /**
   * Actualiza un post existente
   */
  updatePost(postId: number, post: Post): Observable<Post> {
    return this.http.put<ApiResponse<Post>>(`${this.apiUrl}/posts/${postId}`, post)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al actualizar el post');
        }),
        catchError(error => {
          console.error(`Error en updatePost(${postId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Elimina un post
   */
  deletePost(postId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/posts/${postId}`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data || response.message;
          }
          throw new Error(response.message || 'Error al eliminar el post');
        }),
        catchError(error => {
          console.error(`Error en deletePost(${postId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Obtiene posts por categoría
   */
  getPostsByCategory(categoryId: number): Observable<Post[]> {
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/posts/category/${categoryId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener posts de la categoría');
        }),
        catchError(error => {
          console.error(`Error en getPostsByCategory(${categoryId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Busca posts por texto
   */
  searchPosts(query: string): Observable<Post[]> {
    const params = new HttpParams().set('query', query);
    
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/posts/search`, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error en la búsqueda');
        }),
        catchError(error => {
          console.error(`Error en searchPosts(${query}):`, error);
          throw error;
        })
      );
  }

  /**
   * Obtiene posts por usuario
   */
  getPostsByUser(userId: number): Observable<Post[]> {
    // Primero intentamos con el endpoint específico
    return this.http.get<ApiResponse<Post[]>>(`${this.apiUrl}/posts/user/${userId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener posts del usuario');
        }),
        catchError(error => {
          console.error(`Error en getPostsByUser(${userId}):`, error);
          console.warn('Usando método alternativo para obtener posts del usuario');
          
          // Plan B: obtener todos los posts y filtrar por userId
          return this.getAllPosts().pipe(
            map(posts => posts.filter(post => post.userId === userId))
          );
        })
      );
  }

  // ===================== COMENTARIOS =====================

  /**
   * Obtiene comentarios de un post
   */
  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<ApiResponse<Comment[]>>(`${this.apiUrl}/comments/post/${postId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al obtener comentarios');
        }),
        catchError(error => {
          console.error(`Error en getCommentsByPost(${postId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Crea un nuevo comentario
   */
  createComment(commentData: any): Observable<Comment> {
    console.log('Creando comentario:', commentData);
    
    return this.http.post<ApiResponse<Comment>>(`${this.apiUrl}/comments`, commentData)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            console.log('Comentario creado con éxito:', response.data);
            return response.data;
          }
          throw new Error(response.message || 'Error al crear el comentario');
        }),
        catchError(error => {
          console.error('Error en createComment:', error);
          
          // Implementación alternativa mientras se soluciona el backend
          console.warn('API para comentarios no disponible, usando alternativa local');
            
            // Crear un comentario simulado con los datos proporcionados
            const mockComment: Comment = {
              id: Math.floor(Math.random() * 10000), // ID aleatorio
              content: commentData.content,
              postId: commentData.postId,
              userId: commentData.userId,
            userName: 'Usuario Actual', // Nombre genérico
              createdAt: new Date().toISOString(),
              status: 'ACTIVE'
            };
            
            // Devolver el comentario simulado
            console.log('Comentario simulado creado:', mockComment);
            return of(mockComment);
        })
      );
  }

  /**
   * Actualiza un comentario
   */
  updateComment(commentId: number, content: string, userId: number): Observable<Comment> {
    const params = new HttpParams()
      .set('content', content)
      .set('userId', userId.toString());
    
    return this.http.put<ApiResponse<Comment>>(`${this.apiUrl}/comments/${commentId}`, null, { params })
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.message || 'Error al actualizar el comentario');
        }),
        catchError(error => {
          console.error(`Error en updateComment(${commentId}):`, error);
          throw error;
        })
      );
  }

  /**
   * Elimina un comentario
   */
  deleteComment(commentId: number, userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/comments/${commentId}`, { params })
      .pipe(
        map(response => {
          if (response.success) {
            return response.data || response.message;
          }
          throw new Error(response.message || 'Error al eliminar el comentario');
        }),
        catchError(error => {
          console.error(`Error en deleteComment(${commentId}):`, error);
          throw error;
        })
      );
  }
} 