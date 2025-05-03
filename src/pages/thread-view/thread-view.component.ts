import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../app/models/post.interface';
import { Comment } from '../../app/models/comment.interface';
import { CreateCommentDTO } from '../../app/models/create-comment.dto';

@Component({
  selector: 'app-thread-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './thread-view.component.html',
  styleUrls: ['./thread-view.component.css']
})
export class ThreadViewComponent implements OnInit {
  threadId: number = 0;
  post: Post | null = null;
  comments: Comment[] = [];
  isLoading: boolean = true;
  isLoadingComments: boolean = false;
  newComment: string = '';
  isReplying: boolean = false;
  errorMessage: string = '';
  currentUserId: number = 0;
  isLoggedIn: boolean = false;
  isSendingComment: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Verificar si el usuario está logueado
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!currentUser;
    
    if (currentUser) {
      this.currentUserId = currentUser.id;
    }

    // Obtener el ID del post de los parámetros de ruta
    this.route.params.subscribe(params => {
      if (params['threadId']) {
        this.threadId = Number(params['threadId']);
        this.loadPost();
      } else {
        this.errorMessage = 'ID de tema no válido';
        this.isLoading = false;
      }
    });
  }

  loadPost(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.forumService.getPostById(this.threadId)
      .subscribe({
        next: (post) => {
          this.post = post;
          this.loadComments();
        },
        error: (error) => {
          console.error(`Error al cargar el post ${this.threadId}:`, error);
          this.errorMessage = 'No se pudo cargar el tema. El tema puede no existir o ha sido eliminado.';
          this.isLoading = false;
        }
      });
  }

  loadComments(): void {
    this.isLoadingComments = true;
    
    this.forumService.getCommentsByPost(this.threadId)
      .subscribe({
        next: (comments) => {
          this.comments = comments;
          
          if (this.post) {
            this.post.comments = comments.map(comment => {
              return {
                id: comment.id,
                content: comment.content,
                date: comment.createdAt || new Date().toISOString(),
                likes: 0,
                isLiked: false,
                author: {
                  id: comment.userId,
                  name: comment.userName || 'Usuario',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
                  title: 'Usuario',
                  joinDate: new Date(),
                  postCount: 0
                }
              };
            });
            
            // Actualizar el conteo de comentarios
            this.post.commentCount = this.post.comments.length;
          }
          
          this.isLoadingComments = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(`Error al cargar comentarios del post ${this.threadId}:`, error);
          this.isLoadingComments = false;
          this.isLoading = false;
        }
      });
  }

  // Dar/quitar like a un comentario
  toggleLike(comment: any): void {
    if (!this.isLoggedIn) {
      // Si no está logueado, redirigir al login
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    const isLiked = comment.isLiked;
    
    // Optimistic update
    comment.isLiked = !isLiked;
    comment.likes += isLiked ? -1 : 1;
    

  }

  toggleReplyForm(): void {
    if (!this.isLoggedIn) {
      // Si no está logueado, redirigir al login
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    this.isReplying = !this.isReplying;
    if (!this.isReplying) {
      this.newComment = '';
    }
  }

  // Enviar un nuevo comentario
  submitComment(): void {
    if (!this.newComment.trim() || !this.post || !this.isLoggedIn) {
      return;
    }

    const commentData: CreateCommentDTO = {
      content: this.newComment,
      postId: this.threadId,
      userId: this.currentUserId
    };
    
    this.isReplying = false; 
    this.isSendingComment = true; 
    this.errorMessage = ''; 
    
    console.log('Enviando comentario al servidor:', commentData);
    
    this.forumService.createComment(commentData)
      .subscribe({
        next: (comment) => {
          console.log('Comentario recibido:', comment);
          
          this.newComment = '';
          this.isSendingComment = false; 
          this.errorMessage = ''; 
          
    
          this.loadComments();
        },
        error: (error) => {
          console.error('Error al crear comentario:', error);
          
          if (error.status === 500) {
            this.errorMessage = 'Error en el servidor. El equipo técnico ha sido notificado.';
          } else if (error.status === 400) {
            this.errorMessage = 'Datos inválidos. Por favor revisa la información ingresada.';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'No tienes permiso para realizar esta acción. Por favor inicia sesión nuevamente.';

          } else if (error.status === 404) {
            this.errorMessage = 'No se encontró el recurso solicitado. El post puede haber sido eliminado.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
          } else {
            this.errorMessage = 'Error al publicar comentario. Por favor, intenta más tarde.';
          }
          
          this.isReplying = true; // Volver a mostrar formulario para que pueda reintentar
          this.isSendingComment = false; // Desactivar indicador de carga
        }
      });
  }

  // Función para formatear fecha
  formatDate(date: string | Date): string {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Función para determinar si el usuario puede editar/eliminar un post o comentario
  canModify(authorId: number | undefined): boolean {
    if (!this.isLoggedIn || !authorId) return false;
    
    // El usuario puede modificar si es el autor o es admin/moderador
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return false;
    
    const isAuthor = currentUser.id === authorId;
    const isAdmin = currentUser.role === 'ADMIN';
    const isModerator = currentUser.role === 'MODERATOR';
    
    return isAuthor || isAdmin || isModerator;
  }

  // Eliminar un comentario
  deleteComment(commentId: number): void {
    if (!confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
      return;
    }
    
    this.forumService.deleteComment(commentId, this.currentUserId)
      .subscribe({
        next: () => {
          // Eliminar el comentario de la lista local
          this.comments = this.comments.filter(c => c.id !== commentId);
        },
        error: (error) => {
          console.error(`Error al eliminar comentario ${commentId}:`, error);
          this.errorMessage = 'No se pudo eliminar el comentario. Por favor, intenta más tarde.';
        }
      });
  }

  // Eliminar un post
  deletePost(): void {
    if (!this.post || !this.canModify(this.post.userId)) {
      return;
    }
    
    if (!confirm('¿Estás seguro de que deseas eliminar este tema? Esta acción no se puede deshacer.')) {
      return;
    }
    
    this.forumService.deletePost(this.threadId, this.currentUserId)
      .subscribe({
        next: () => {
          // Redirigir a la página de categoría o a la página principal del foro
          if (this.post?.categoryId) {
            this.router.navigate(['/category', this.post.categoryId]);
          } else {
            this.router.navigate(['/forums']);
          }
        },
        error: (error) => {
          console.error(`Error al eliminar post ${this.threadId}:`, error);
          this.errorMessage = 'No se pudo eliminar el tema. Por favor, intenta más tarde.';
        }
      });
  }

  // Navegar a la página de edición de post
  editPost(): void {
    if (!this.post || !this.canModify(this.post.userId)) {
      return;
    }
    
    this.router.navigate(['/edit-thread', this.threadId]);
  }

  // Desplazarse al formulario de comentarios
  scrollToCommentForm(): void {
    // Si el usuario no está logueado, redirigir al login
    if (!this.isLoggedIn) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    // Hacer scroll al formulario de comentarios
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
      // Hacer focus en el formulario
      commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Enfocar el textarea después de un breve retardo para permitir el scroll
      setTimeout(() => {
        const textarea = commentForm.querySelector('textarea');
        if (textarea) {
          textarea.focus();
        }
      }, 500);
    }
  }
} 