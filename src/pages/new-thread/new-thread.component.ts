import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

interface Category {
  id: string;
  name: string;
}

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
    categoryId: '',
    tags: [] as string[]
  };
  
  // Tag temporal para agregar
  newTag: string = '';
  
  // Estado del formulario
  isSubmitting: boolean = false;
  formErrors: {[key: string]: string} = {};
  
  // Categorías disponibles
  categories: Category[] = [
    { id: 'gaming', name: 'Gaming' },
    { id: 'tech', name: 'Tecnología' },
    { id: 'movies', name: 'Cine y Series' },
    { id: 'books', name: 'Literatura' },
    { id: 'sports', name: 'Deportes' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Obtener el ID de la categoría de los parámetros de ruta
    this.route.params.subscribe(params => {
      if (params['categoryId']) {
        this.categoryId = params['categoryId'];
        this.threadData.categoryId = this.categoryId;
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
    
    // Simulación de envío al backend
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Redirigir a la página del tema creado (simulado)
      this.router.navigate(['/thread', 'new-topic-123']);
    }, 1500);
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