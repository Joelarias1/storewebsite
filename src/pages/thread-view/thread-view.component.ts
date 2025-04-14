import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importar la interfaz y los datos simulados
import { Thread, MOCK_THREAD } from '../../app/mocks/thread-mocks';

@Component({
  selector: 'app-thread-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './thread-view.component.html',
  styleUrls: ['./thread-view.component.css']
})
export class ThreadViewComponent implements OnInit {
  threadId: string = '';
  thread: Thread | null = null;
  isLoading: boolean = true;
  newComment: string = '';
  isReplying: boolean = false;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.threadId = params['threadId'];
      this.loadThread();
    });
  }

  loadThread(): void {
    this.isLoading = true;
    // Simular carga de datos usando el mock importado
    setTimeout(() => {
      // Comprobamos si el ID de la ruta coincide con el ID del mock
      if (this.threadId === MOCK_THREAD.id) {
        // Asignamos una copia del mock para evitar mutaciones accidentales
        this.thread = { ...MOCK_THREAD, id: this.threadId };
      } else {
        // Manejar el caso donde el ID no coincide (ej. mostrar error o nada)
        console.warn(`Mock data not found for thread ID: ${this.threadId}`);
        this.thread = null;
      }
      this.isLoading = false;
    }, 500); // Reducimos el tiempo de carga simulado
  }

  // Simular la acción de "Me gusta" en un comentario
  toggleLike(comment: Comment): void {
    comment.isLiked = !comment.isLiked;
    comment.likes += comment.isLiked ? 1 : -1;
    // En una aplicación real, aquí enviaríamos la actualización al backend
  }

  // Mostrar/ocultar el formulario de respuesta
  toggleReplyForm(): void {
    this.isReplying = !this.isReplying;
    if (!this.isReplying) {
      this.newComment = '';
    }
  }

  // Enviar un nuevo comentario
  submitComment(): void {
    if (!this.newComment.trim() || !this.thread) return; // Añadir chequeo de thread

    const newCommentData = { // No necesita tipo explícito aquí
      id: 'comment' + (this.thread.comments.length + 1),
      author: {
        id: 'currentUser',
        name: 'UsuarioActual',
        avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
        title: 'Nuevo Usuario',
        joinDate: new Date(),
        postCount: 1
      },
      content: this.newComment,
      date: new Date(),
      likes: 0,
      isLiked: false
    };
    
    this.thread.comments.push(newCommentData);
    this.newComment = '';
    this.isReplying = false;
  }
} 