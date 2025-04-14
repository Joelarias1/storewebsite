import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: number;
  posts: number;
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
  // Datos simulados de categorías
  categories: ForumCategory[] = [
    {
      id: 1,
      name: 'Desarrollo Frontend',
      description: 'Discusiones sobre HTML, CSS, JavaScript y frameworks como Angular, React y Vue.',
      icon: 'code',
      color: 'blue',
      topics: 156,
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
      topics: 143,
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
      topics: 87,
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
      topics: 64,
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
      topics: 42,
      posts: 615,
      lastPost: {
        title: 'Próximos eventos tech en Latinoamérica',
        author: 'community_lead',
        date: new Date('2023-08-18')
      }
    }
  ];
  
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
  
  constructor() { }

  ngOnInit(): void {
    // Calcular estadísticas totales
    this.stats.totalTopics = this.categories.reduce((sum, cat) => sum + cat.topics, 0);
    this.stats.totalPosts = this.categories.reduce((sum, cat) => sum + cat.posts, 0);
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
} 