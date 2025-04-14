import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interfaces definidas localmente
interface Author {
  id: string;
  name: string;
  avatar: string;
  title: string;
  joinDate: Date;
  postCount: number;
}

interface Comment {
  id: string;
  author: Author;
  content: string;
  date: Date;
  likes: number;
  isLiked: boolean;
}

interface Thread {
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
    setTimeout(() => {
      // Definir datos simulados aquí mismo
      const author: Author = {
        id: 'user123',
        name: 'dev_master',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80',
        title: 'Master Coder',
        joinDate: new Date('2022-01-10'),
        postCount: 356
      };
      
      const comments: Comment[] = [
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
          content: `¡Excelente post! Muy útil para entender las novedades de Angular 16. <br><br> \n                     ¿Alguien ha probado ya los signals en producción? Creo que el rendimiento mejora bastante, algo así:\n                     <pre><code class="language-typescript">\n// Ejemplo de uso de signal\nconst counter = signal(0);\n\n// Efecto que se ejecuta cuando counter cambia\neffect(() => {\n  console.log('El contador es:', counter());\n});\n\ncounter.set(5);\nconsole.log(doubleCount()); // 10\n                     </code></pre>`,
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

      // Crear el objeto thread completo
      const mockThreadData: Thread = {
        id: '1', // Usamos un ID fijo para el ejemplo
        title: 'Mejores prácticas con Angular 16',
        category: { id: '1', name: 'Desarrollo Frontend' },
        author: author,
        content: `\nAngular 16 ha traído consigo un montón de novedades interesantes que mejoran la experiencia de desarrollo y el rendimiento de las aplicaciones. En este post, vamos a explorar algunas de las **mejores prácticas** para aprovechar al máximo esta nueva versión.\n\n### 1. Signals para la gestión del estado\n\nUna de las características más destacadas son los **Signals**. Ofrecen un nuevo paradigma para la gestión del estado reactivo que es más granular y eficiente que \`async\` pipe y \`ChangeDetectionStrategy.OnPush\`.\n\n\`\`\`typescript\nimport { signal, computed } from '@angular/core';\n\nconst count = signal(0);\nconst doubleCount = computed(() => count() * 2);\n\nconsole.log(doubleCount()); // 0\n\ncount.set(5);\nconsole.log(doubleCount()); // 10\n\`\`\`\n\n### 2. Required Inputs\n\nAhora puedes marcar los \`@Input()\` como obligatorios, lo que mejora la seguridad y la claridad de los componentes.\n\n\`\`\`typescript\n@Component({ /* ... */ })\nexport class MyComponent {\n  @Input({ required: true }) userName!: string;\n}\n\`\`\`\n\n### 3. DestroyRef para la limpieza\n\nEl nuevo \`DestroyRef\` simplifica la gestión de la desuscripción de Observables y otras tareas de limpieza.\n\n\`\`\`typescript\n@Component({ /* ... */ })\nexport class DataFetcherComponent {\n  private destroyRef = inject(DestroyRef);\n\n  constructor(private dataService: DataService) {\n    const subscription = this.dataService.getData().subscribe(/* ... */);\n    this.destroyRef.onDestroy(() => subscription.unsubscribe());\n  }\n}\n\`\`\`\n\n### 4. Standalone Components por defecto\n\nAngular CLI ahora genera \`standalone components\` por defecto, fomentando una arquitectura más modular y simplificada.\n\n---\n\nEstas son solo algunas de las mejoras clave. ¿Qué otras prácticas recomiendan ustedes para trabajar con Angular 16? ¡Compartan sus experiencias en los comentarios!`,
        date: new Date('2023-08-25T09:00:00'),
        tags: ['angular', 'frontend', 'javascript', 'typescript', 'signals'],
        views: 1358,
        comments: comments,
        isLocked: false,
        isPinned: true
      };

      // Comprobar si el ID de la ruta coincide con el ID del mock local
      if (this.threadId === mockThreadData.id) {
        this.thread = { ...mockThreadData, id: this.threadId }; 
      } else {
        console.warn(`Mock data not found for thread ID: ${this.threadId}`);
        this.thread = null;
      }
      this.isLoading = false;
    }, 500); 
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