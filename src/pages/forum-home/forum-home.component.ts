import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { Category } from '../../app/models/category.interface';

@Component({
  selector: 'app-forum-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-5xl mx-auto">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-gray-100">Foro de la Comunidad</h1>
          <p class="text-gray-400 mt-2">Explora nuestras categorías y únete a la conversación</p>
        </div>
        
        <!-- Loading state -->
        <div *ngIf="isLoading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- Error message -->
        <div *ngIf="errorMessage" class="bg-red-500/20 border border-red-600 rounded-lg p-4 mb-6">
          <p class="text-red-100">{{ errorMessage }}</p>
        </div>
        
        <!-- Categories -->
        <div *ngIf="!isLoading && categories.length > 0" class="grid md:grid-cols-2 gap-6">
          <div *ngFor="let category of categories" class="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition hover:bg-gray-700/70">
            <a [routerLink]="['/category', category.id]" class="block p-6">
              <h2 class="text-xl font-semibold text-blue-400">{{ category.name }}</h2>
              <p *ngIf="category.description" class="text-gray-400 mt-2">{{ category.description }}</p>
              
              <div class="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>Temas: {{ category.threadCount || 0 }}</span>
                <span class="text-blue-400 font-medium">Explorar →</span>
              </div>
            </a>
          </div>
        </div>
        
        <!-- Empty state -->
        <div *ngIf="!isLoading && categories.length === 0 && !errorMessage" class="text-center py-16 bg-gray-800/50 rounded-lg">
          <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
          </svg>
          <h3 class="text-xl font-medium text-gray-300 mb-2">No hay categorías disponibles</h3>
          <p class="text-gray-500">Estamos trabajando para añadir nuevas categorías pronto.</p>
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
export class ForumHomeComponent implements OnInit {
  categories: Category[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private forumService: ForumService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.forumService.getCategories()
      .subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar categorías:', error);
          this.errorMessage = 'No se pudieron cargar las categorías. Por favor, intenta más tarde.';
          this.isLoading = false;
        }
      });
  }
} 