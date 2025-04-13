import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css']
})
export class TopicsComponent {
  // Datos simulados de temas
  topics = [
    {
      id: 1,
      title: 'Tendencias de desarrollo web en 2024',
      category: 'Desarrollo Frontend',
      categoryId: 1,
      author: 'CarlosDev',
      content: 'Discusión sobre las tendencias actuales en el desarrollo web frontend, incluyendo frameworks y herramientas populares.',
      createdAt: '2024-05-15',
      views: 1289,
      comments: 64,
      status: 'active'
    },
    {
      id: 2,
      title: 'Debugging avanzado en JavaScript',
      category: 'Desarrollo Frontend',
      categoryId: 1,
      author: 'AnaDeveloper',
      content: 'Técnicas y herramientas para depurar código JavaScript complejo de manera efectiva.',
      createdAt: '2024-05-12',
      views: 978,
      comments: 42,
      status: 'active'
    },
    {
      id: 3,
      title: 'Mejores prácticas para API REST',
      category: 'Desarrollo Backend',
      categoryId: 2,
      author: 'RobertCoder',
      content: 'Cómo diseñar y estructurar APIs REST eficientes y mantenibles.',
      createdAt: '2024-05-10',
      views: 856,
      comments: 37,
      status: 'active'
    },
    {
      id: 4,
      title: 'TypeScript vs JavaScript: cuándo usar cada uno',
      category: 'Desarrollo Frontend',
      categoryId: 1,
      author: 'MariaScript',
      content: 'Comparación de TypeScript y JavaScript, ventajas, desventajas y casos de uso.',
      createdAt: '2024-05-05',
      views: 743,
      comments: 29,
      status: 'active'
    },
    {
      id: 5,
      title: 'Introducción a Docker para desarrolladores',
      category: 'DevOps y Cloud',
      categoryId: 3,
      author: 'DevOpsGuru',
      content: 'Una guía básica para empezar a usar Docker en proyectos de desarrollo.',
      createdAt: '2024-05-02',
      views: 629,
      comments: 25,
      status: 'active'
    }
  ];
  
  // Datos simulados de categorías
  categories = [
    { id: 1, name: 'Desarrollo Frontend' },
    { id: 2, name: 'Desarrollo Backend' },
    { id: 3, name: 'DevOps y Cloud' },
    { id: 4, name: 'Inteligencia Artificial' },
    { id: 5, name: 'Comunidad y Networking' }
  ];
  
  // Filtros
  filters = {
    category: 0,
    status: 'all',
    search: ''
  };
  
  // Opciones de estados
  statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Activos' },
    { value: 'reported', label: 'Reportados' },
    { value: 'hidden', label: 'Ocultos' }
  ];
  
  get filteredTopics() {
    return this.topics.filter(topic => {
      // Filtro por categoría
      if (this.filters.category > 0 && topic.categoryId !== this.filters.category) {
        return false;
      }
      
      // Filtro por estado
      if (this.filters.status !== 'all' && topic.status !== this.filters.status) {
        return false;
      }
      
      // Filtro por búsqueda
      if (this.filters.search && !topic.title.toLowerCase().includes(this.filters.search.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }
  
  resetFilters(): void {
    this.filters = {
      category: 0,
      status: 'all',
      search: ''
    };
  }
  
  hideTopic(id: number): void {
    const topic = this.topics.find(t => t.id === id);
    if (topic) {
      topic.status = topic.status === 'hidden' ? 'active' : 'hidden';
    }
  }
  
  deleteTopic(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tema?')) {
      this.topics = this.topics.filter(t => t.id !== id);
    }
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'reported':
        return 'Reportado';
      case 'hidden':
        return 'Oculto';
      default:
        return 'Desconocido';
    }
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reported':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hidden':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
} 