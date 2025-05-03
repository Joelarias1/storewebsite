import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { AuthService } from '../../services/auth.service';
import { Post } from '../../app/models/post.interface';
import { Category } from '../../app/models/category.interface';

@Component({
  selector: 'app-forum-category',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-8" *ngIf="!isLoading">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-200">{{ isMyTopicsRoute ? 'Mis Temas' : (category?.name || 'Categoría') }}</h1>
              <p *ngIf="category && category.description && !isMyTopicsRoute" class="text-gray-400 mt-1">{{ category.description }}</p>
              <p *ngIf="isMyTopicsRoute" class="text-gray-400 mt-1">Lista de temas que has creado</p>
            </div>
            <button 
              *ngIf="isLoggedIn && !isMyTopicsRoute"
              (click)="createNewThread()" 
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Nuevo tema
            </button>
          </div>
        </div>
        
        <!-- Loading state -->
        <div *ngIf="isLoading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- Error message -->
        <div *ngIf="errorMessage" class="bg-red-500/20 border border-red-600 rounded-lg p-4 mb-6">
          <p class="text-red-100">{{ errorMessage }}</p>
        </div>
        
        <!-- Empty state -->
        <div *ngIf="!isLoading && posts.length === 0 && !errorMessage" class="text-center py-16 bg-gray-800/50 rounded-lg">
          <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <h3 class="text-xl font-medium text-gray-300 mb-2">{{ isMyTopicsRoute ? 'No has creado temas todavía' : 'No hay temas en esta categoría' }}</h3>
          <p class="text-gray-500 mb-6">{{ isMyTopicsRoute ? 'Crea un tema nuevo para participar en la comunidad' : '¡Sé el primero en crear un tema!' }}</p>
          <button 
            *ngIf="isLoggedIn && !isMyTopicsRoute"
            (click)="createNewThread()" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            Crear nuevo tema
          </button>
          <a 
            *ngIf="isMyTopicsRoute"
            routerLink="/forums" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition inline-block"
          >
            Ir al foro
          </a>
          <a 
            *ngIf="!isLoggedIn && !isMyTopicsRoute"
            [routerLink]="['/login']" 
            [queryParams]="{returnUrl: router.url}" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition inline-block"
          >
            Iniciar sesión para crear tema
          </a>
        </div>
        
        <!-- Threads list -->
        <div *ngIf="!isLoading && posts.length > 0" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div class="divide-y divide-gray-700">
            <div *ngFor="let post of posts" class="p-4 hover:bg-gray-700/50 transition">
              <div class="flex items-start">
                <div class="flex-1">
                  <a [routerLink]="['/thread', post.id]" class="block">
                    <h2 class="text-lg font-medium text-blue-400 hover:text-blue-300 transition">{{ post.title }}</h2>
                  </a>
                  <div class="flex flex-wrap items-center text-xs text-gray-400 mt-1 gap-x-4">
                    <span>Por: {{ post.userName || 'Usuario' }}</span>
                    <span>{{ formatDate(post.createdAt) }}</span>
                  </div>
                </div>
                <div class="text-center text-xs text-gray-500 ml-4">
                  <span class="block text-gray-300">{{ post.commentCount || 0 }}</span>
                  <span>Respuestas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      min-height: calc(100vh - 200px);
    }
  `]
})
export class ForumCategoryComponent implements OnInit {
  categoryId: number = 0;
  category: Category | null = null;
  posts: Post[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  isMyTopicsRoute: boolean = false;
  currentUserId: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private forumService: ForumService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.authService.getCurrentUser();
    
    // Verificar si estamos en la ruta 'mis temas'
    this.isMyTopicsRoute = this.router.url.includes('/my-topics');
    
    if (this.isLoggedIn) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.currentUserId = currentUser.id;
      }
    }
    
    if (this.isMyTopicsRoute) {
      this.loadUserPosts();
    } else {
      this.route.params.subscribe(params => {
        if (params['categoryId']) {
          this.categoryId = Number(params['categoryId']);
          this.loadCategoryAndPosts();
        } else {
          this.errorMessage = 'ID de categoría no válido';
          this.isLoading = false;
        }
      });
    }
  }

  loadCategoryAndPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    // Cargar información de la categoría
    this.forumService.getCategoryById(this.categoryId)
      .subscribe({
        next: (category) => {
          this.category = category;
          this.loadPosts();
        },
        error: (error) => {
          console.error(`Error al cargar la categoría ${this.categoryId}:`, error);
          this.errorMessage = 'No se pudo cargar la categoría. Por favor, intenta más tarde.';
          this.isLoading = false;
        }
      });
  }

  loadPosts(): void {
    this.forumService.getPostsByCategory(this.categoryId)
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(`Error al cargar posts de la categoría ${this.categoryId}:`, error);
          this.errorMessage = 'No se pudieron cargar los temas. Por favor, intenta más tarde.';
          this.isLoading = false;
        }
      });
  }
  
  loadUserPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    if (!this.isLoggedIn || this.currentUserId === 0) {
      this.errorMessage = 'Debes iniciar sesión para ver tus temas';
      this.isLoading = false;
      return;
    }
    
    this.forumService.getPostsByUser(this.currentUserId)
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(`Error al cargar posts del usuario ${this.currentUserId}:`, error);
          this.errorMessage = 'No se pudieron cargar tus temas. Por favor, intenta más tarde.';
          this.isLoading = false;
        }
      });
  }

  createNewThread(): void {
    this.router.navigate(['/new-thread', this.categoryId]);
  }

  formatDate(date: string | Date | undefined): string {
    if (!date) return 'Fecha desconocida';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 