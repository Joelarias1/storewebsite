import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../app/models/category.interface';
import { Post } from '../../app/models/post.interface';

@Component({
  selector: 'app-new-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-thread.component.html',
  styleUrls: ['./new-thread.component.css']
})
export class NewThreadComponent implements OnInit {
  // Categoría seleccionada (vendrá del parámetro de ruta)
  categoryId: string = '';
  
  // Datos del nuevo tema
  threadData = {
    title: '',
    content: '',
    categoryId: 0,
    userId: 0,
    tags: [] as string[]
  };
  
  // Tag temporal para agregar
  newTag: string = '';
  
  // Estado del formulario
  isSubmitting: boolean = false;
  formErrors: {[key: string]: string} = {};
  errorMessage: string = '';
  
  // Categorías disponibles
  categories: Category[] = [];
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forumService: ForumService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Cargar las categorías desde el backend
    this.loadCategories();
    
    // Obtener el usuario actual
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.threadData.userId = currentUser.id;
    } else {
      // Si no hay usuario logueado, redirigir al login
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    // Obtener el ID de la categoría de los parámetros de ruta
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.threadData.categoryId = Number(this.categoryId);
      }
    });
  }

  // Cargar categorías desde el backend
  loadCategories(): void {
    this.loading = true;
    this.forumService.getCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          this.loading = false;
          this.errorMessage = 'No se pudieron cargar las categorías. Por favor, intenta más tarde.';
        }
      });
  }

  // Agregar un tag
  addTag(): void {
    const tag = this.newTag.trim();
    if (tag && !this.threadData.tags.includes(tag)) {
      this.threadData.tags.push(tag);
      this.newTag = '';
    }
  }

  // Eliminar un tag
  removeTag(tag: string): void {
    this.threadData.tags = this.threadData.tags.filter(t => t !== tag);
  }

  // Validar el formulario
  validateForm(): boolean {
    this.formErrors = {};
    
    if (!this.threadData.title.trim()) {
      this.formErrors['title'] = 'El título es obligatorio';
    } else if (this.threadData.title.length < 5) {
      this.formErrors['title'] = 'El título debe tener al menos 5 caracteres';
    }
    
    if (!this.threadData.content.trim()) {
      this.formErrors['content'] = 'El contenido es obligatorio';
    } else if (this.threadData.content.length < 20) {
      this.formErrors['content'] = 'El contenido debe tener al menos 20 caracteres';
    }
    
    if (!this.threadData.categoryId) {
      this.formErrors['category'] = 'Debes seleccionar una categoría';
    }
    
    return Object.keys(this.formErrors).length === 0;
  }

  // Enviar el formulario
  submitThread(): void {
    if (!this.validateForm()) {
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // Crear objeto post para enviar al backend
    const post: Post = {
      title: this.threadData.title,
      content: this.threadData.content,
      userId: this.threadData.userId,
      categoryId: this.threadData.categoryId
    };
    
    this.forumService.createPost(post)
      .subscribe({
        next: (createdPost) => {
          this.isSubmitting = false;
          // Redirigir a la página del tema creado
          this.router.navigate(['/thread', createdPost.id]);
        },
        error: (error) => {
          this.isSubmitting = false;
          console.error('Error al crear el post:', error);
          this.errorMessage = error.message || 'Error al crear el post. Por favor, intenta más tarde.';
        }
      });
  }

  // Cancelar la creación
  cancelCreation(): void {
    // Si venimos de una categoría, volvemos a ella
    if (this.categoryId) {
      this.router.navigate(['/category', this.categoryId]);
    } else {
      // Si no, volvemos a la página principal del foro
      this.router.navigate(['/forums']);
    }
  }
} 