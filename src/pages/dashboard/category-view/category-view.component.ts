import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Topic {
  id: number;
  title: string;
  author: string;
  authorAvatar: string;
  lastActivity: string;
  replies: number;
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isHot: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: number;
  posts: number;
}

@Component({
  selector: 'app-category-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {
  categoryId: number = 0;
  category: Category | null = null;
  
  topicsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  
  searchQuery: string = '';
  sortBy: 'recent' | 'popular' | 'unanswered' = 'recent';
  
  // Datos simulados de temas para esta categoría
  topics: Topic[] = [];
  
  constructor(private route: ActivatedRoute) {}
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      this.loadCategory();
      this.loadTopics();
    });
  }
  
  loadCategory() {
    // Simulación de carga de datos desde una API
    // En una implementación real, aquí iría una llamada al servicio
    const categories = [
      {
        id: 1,
        name: 'Desarrollo Frontend',
        description: 'Discusiones sobre HTML, CSS, JavaScript y frameworks como Angular, React y Vue.',
        icon: 'code',
        color: 'blue',
        topics: 156,
        posts: 2345
      },
      {
        id: 2,
        name: 'Desarrollo Backend',
        description: 'Temas sobre Node.js, Python, Java, PHP y bases de datos.',
        icon: 'server',
        color: 'green',
        topics: 143,
        posts: 1892
      },
      {
        id: 3,
        name: 'DevOps y Cloud',
        description: 'Docker, Kubernetes, AWS, Azure, CI/CD y automatización.',
        icon: 'cloud',
        color: 'purple',
        topics: 87,
        posts: 1104
      },
      {
        id: 4,
        name: 'Inteligencia Artificial',
        description: 'Machine Learning, Deep Learning, NLP y herramientas de IA.',
        icon: 'brain',
        color: 'red',
        topics: 64,
        posts: 823
      },
      {
        id: 5,
        name: 'Comunidad y Networking',
        description: 'Eventos, oportunidades laborales, networking y colaboración.',
        icon: 'users',
        color: 'amber',
        topics: 42,
        posts: 615
      }
    ];
    
    this.category = categories.find(c => c.id === this.categoryId) || null;
  }
  
  loadTopics() {
    // Simulación de carga de datos desde una API
    // En una implementación real, aquí iría una llamada al servicio
    const mockTopics: Topic[] = [
      {
        id: 1,
        title: '¿Cuál es la mejor forma de aprender React en 2023?',
        author: 'María González',
        authorAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        lastActivity: '2023-09-15T14:30:00',
        replies: 28,
        views: 342,
        isPinned: true,
        isLocked: false,
        isHot: true
      },
      {
        id: 2,
        title: 'Problemas con la implementación de Redux Toolkit',
        author: 'Carlos Rodríguez',
        authorAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        lastActivity: '2023-09-14T09:45:00',
        replies: 12,
        views: 186,
        isPinned: false,
        isLocked: false,
        isHot: false
      },
      {
        id: 3,
        title: 'Next.js vs Remix: ¿Cuál elegir para mi próximo proyecto?',
        author: 'Ana Martínez',
        authorAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
        lastActivity: '2023-09-13T18:20:00',
        replies: 35,
        views: 421,
        isPinned: false,
        isLocked: false,
        isHot: true
      },
      {
        id: 4,
        title: 'Consejos para mejorar el rendimiento de aplicaciones Angular',
        author: 'Miguel Sánchez',
        authorAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
        lastActivity: '2023-09-12T11:15:00',
        replies: 19,
        views: 245,
        isPinned: false,
        isLocked: false,
        isHot: false
      },
      {
        id: 5,
        title: '[ANUNCIO] Nuevo curso de Vue.js 3 disponible en nuestra plataforma',
        author: 'Admin',
        authorAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        lastActivity: '2023-09-11T15:00:00',
        replies: 8,
        views: 312,
        isPinned: true,
        isLocked: true,
        isHot: false
      }
    ];
    
    this.topics = mockTopics;
    
    // Calcular el número total de páginas
    this.totalPages = Math.ceil(this.topics.length / this.topicsPerPage);
  }
  
  changePage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }
  
  prevPage() {
    this.changePage(this.currentPage - 1);
  }
  
  nextPage() {
    this.changePage(this.currentPage + 1);
  }
  
  searchTopics() {
    // En una implementación real, aquí iría la lógica de búsqueda
    console.log(`Buscando temas con: ${this.searchQuery}`);
  }
  
  sortTopics(sortBy: 'recent' | 'popular' | 'unanswered') {
    this.sortBy = sortBy;
    // En una implementación real, aquí iría la lógica de ordenamiento
    console.log(`Ordenando por: ${sortBy}`);
  }
  
  createNewTopic() {
    // En una implementación real, aquí iría la navegación al formulario de nuevo tema
    console.log('Crear nuevo tema');
  }
  
  getColorClass(color: string): string {
    const colorMap: {[key: string]: string} = {
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'amber': 'bg-amber-100 text-amber-800 border-amber-200',
      'indigo': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'teal': 'bg-teal-100 text-teal-800 border-teal-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return colorMap[color] || colorMap['blue'];
  }
} 