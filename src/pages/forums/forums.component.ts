import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../services/forum.service';
import { Category } from '../../app/models/category.interface';

interface ForumCategory extends Category {
  icon?: string;
  color?: string;
  posts?: number;
  lastPost?: {
    title: string;
    author: string;
    date: Date;
  };
}

@Component({
  selector: 'app-forums',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css']
})
export class ForumsComponent implements OnInit {
  // Datos de categorías
  categories: ForumCategory[] = [];
  
  // Estadísticas generales del foro
  stats = {
    totalTopics: 0,
    totalPosts: 0,
    totalUsers: 876,
    newestUser: 'tech_newbie',
    onlineUsers: 42
  };

  // Filtros y búsqueda
  searchQuery: string = '';
  forumView: 'grid' | 'list' = 'grid';
  
  // Estado de la carga
  loading: boolean = true;
  error: string | null = null;
  
  // Mapeo de iconos y colores (para mostrar visualmente)
  private readonly iconMap: { [key: string]: string } = {
    'Desarrollo Frontend': 'code',
    'Desarrollo Backend': 'server',
    'DevOps y Cloud': 'cloud',
    'Inteligencia Artificial': 'brain',
    'Comunidad y Networking': 'users'
  };
  
  private readonly colorMap: { [key: string]: string } = {
    'Desarrollo Frontend': 'blue',
    'Desarrollo Backend': 'green',
    'DevOps y Cloud': 'purple',
    'Inteligencia Artificial': 'red',
    'Comunidad y Networking': 'amber'
  };
  
  constructor(private forumService: ForumService) { }

  ngOnInit(): void {
    this.loadCategories();
  }
  
  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.forumService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.map(category => this.enhanceCategory(category));
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
        this.error = 'Error al cargar las categorías. Por favor, intenta nuevamente.';
        this.loading = false;
        
        // Usar datos de respaldo en caso de error
        this.loadFallbackData();
      }
    });
  }
  
  private enhanceCategory(category: Category): ForumCategory {
    return {
      ...category,
      icon: this.getIconForCategory(category.name),
      color: this.getColorForCategory(category.name),
      posts: Math.floor(Math.random() * 1000) + 100, // Simulamos número de posts hasta tener datos reales
      lastPost: this.getLastPostForCategory(category.id)
    };
  }
  
  private getIconForCategory(categoryName: string): string {
    return this.iconMap[categoryName] || 'code';
  }
  
  private getColorForCategory(categoryName: string): string {
    return this.colorMap[categoryName] || 'blue';
  }
  
  private getLastPostForCategory(categoryId?: number): { title: string, author: string, date: Date } | undefined {
    if (!categoryId) return undefined;
    
    // En una implementación real, obtendríamos el último post de la categoría desde el backend
    // Por ahora, devolvemos datos simulados
    return {
      title: `Tema reciente en categoría ${categoryId}`,
      author: 'usuario_' + Math.floor(Math.random() * 999),
      date: new Date(Date.now() - Math.floor(Math.random() * 10 * 24 * 60 * 60 * 1000))
    };
  }
  
  private calculateStats(): void {
    this.stats.totalTopics = this.categories.reduce((sum, cat) => sum + (cat.threadCount || 0), 0);
    this.stats.totalPosts = this.categories.reduce((sum, cat) => sum + (cat.posts || 0), 0);
  }
  
  private loadFallbackData(): void {
    // Datos de respaldo en caso de que falle la carga desde el backend
    this.categories = [
      {
        id: 1,
        name: 'Desarrollo Frontend',
        description: 'Discusiones sobre HTML, CSS, JavaScript y frameworks como Angular, React y Vue.',
        icon: 'code',
        color: 'blue',
        threadCount: 156,
        posts: 2345,
        lastPost: {
          title: 'Mejores prácticas con Angular 16',
          author: 'dev_master',
          date: new Date('2023-08-25')
        }
      },
      {
        id: 2,
        name: 'Desarrollo Backend',
        description: 'Temas sobre Node.js, Python, Java, PHP y bases de datos.',
        icon: 'server',
        color: 'green',
        threadCount: 143,
        posts: 1892,
        lastPost: {
          title: 'Optimización de consultas en MongoDB',
          author: 'database_guru',
          date: new Date('2023-08-23')
        }
      },
      {
        id: 3,
        name: 'DevOps y Cloud',
        description: 'Docker, Kubernetes, AWS, Azure, CI/CD y automatización.',
        icon: 'cloud',
        color: 'purple',
        threadCount: 87,
        posts: 1104,
        lastPost: {
          title: 'Configuración de GitHub Actions',
          author: 'ci_expert',
          date: new Date('2023-08-22')
        }
      },
      {
        id: 4,
        name: 'Inteligencia Artificial',
        description: 'Machine Learning, Deep Learning, NLP y herramientas de IA.',
        icon: 'brain',
        color: 'red',
        threadCount: 64,
        posts: 823,
        lastPost: {
          title: 'Implementando ChatGPT en proyectos web',
          author: 'ai_lover',
          date: new Date('2023-08-20')
        }
      },
      {
        id: 5,
        name: 'Comunidad y Networking',
        description: 'Eventos, oportunidades laborales, networking y colaboración.',
        icon: 'users',
        color: 'amber',
        threadCount: 42,
        posts: 615,
        lastPost: {
          title: 'Próximos eventos tech en Latinoamérica',
          author: 'community_lead',
          date: new Date('2023-08-18')
        }
      }
    ];
    
    this.calculateStats();
  }
  
  getColorClass(color: string): string {
    const colorMap: {[key: string]: string} = {
      'blue': 'bg-blue-600 text-white',
      'green': 'bg-green-600 text-white',
      'purple': 'bg-purple-600 text-white',
      'red': 'bg-red-600 text-white',
      'amber': 'bg-yellow-600 text-white',
      'indigo': 'bg-indigo-600 text-white',
      'teal': 'bg-teal-600 text-white',
      'gray': 'bg-gray-600 text-white'
    };
    
    return colorMap[color] || colorMap['blue'];
  }
  
  toggleView(view: 'grid' | 'list'): void {
    this.forumView = view;
  }
  
  // Método para recargar las categorías
  refreshCategories(): void {
    this.loadCategories();
  }
} 