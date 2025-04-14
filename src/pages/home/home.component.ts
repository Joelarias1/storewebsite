import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  topics: number;
  posts: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  categories: ForumCategory[] = [
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

  constructor() { }

  ngOnInit(): void {
    // Aquí se podrían cargar las categorías desde un servicio
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