import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ForumService } from '../../services/forum.service';
import { Post } from '../../app/models/post.interface';
import { Category } from '../../app/models/category.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent implements OnInit {
  posts: Post[] = [];
  categories: Category[] = [];
  loading: boolean = false;
  error: string | null = null;
  
  // Parámetros de paginación
  currentPage: number = 0;
  pageSize: number = 10;
  sortBy: string = 'createdAt';
  sortDirection: string = 'desc';
  
  // Flags para modo de prueba
  useTestData: boolean = false;
  
  constructor(private forumService: ForumService) { }

  ngOnInit(): void {
    // Cargar solo datos de prueba
    this.createTestCategories();
    this.createTestPosts();
    this.useTestData = true;
    
    // Ordenar los posts según el criterio inicial
    this.sortTestPosts(this.sortBy);
  }
  
  loadCategories(): void {
    this.forumService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        if (this.categories.length === 0) {
          this.createTestCategories();
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
        this.error = 'No se pudieron cargar las categorías. Mostrando datos de prueba.';
        this.createTestCategories();
      }
    });
  }

  loadPosts(): void {
    // Si ya tenemos los datos de prueba, mantenerlos
    if (this.useTestData) {
      this.loading = false;
      return;
    }
    
    this.loading = true;
    this.forumService.getPagedPosts(this.currentPage, this.pageSize, this.sortBy, this.sortDirection).subscribe({
      next: (data) => {
        // Siempre mantener los datos de prueba como pidió el usuario
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar posts:', err);
        // En caso de error, asegurarse de que ya tengamos datos de prueba
        if (!this.useTestData) {
          this.createTestPosts();
          this.useTestData = true;
        }
        this.loading = false;
      }
    });
  }

  loadMore(): void {
    if (this.useTestData) {
      // Si estamos usando datos de prueba, solo agregar más posts de prueba
      this.appendTestPosts();
      return;
    }
    
    this.currentPage++;
    this.loading = true;
    
    this.forumService.getPagedPosts(this.currentPage, this.pageSize, this.sortBy, this.sortDirection).subscribe({
      next: (data) => {
        this.posts = [...this.posts, ...data.content];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar más posts:', err);
        this.error = 'No se pudieron cargar más posts. Por favor, intenta nuevamente más tarde.';
        this.loading = false;
      }
    });
  }
  
  changeSorting(sortBy: string): void {
    this.sortBy = sortBy;
    this.currentPage = 0;
    
    if (this.useTestData) {
      // Ordenar los datos de prueba localmente
      this.sortTestPosts(sortBy);
    } else {
      // Cargar nuevamente desde el API con el nuevo orden
      this.loadPosts();
    }
  }
  
  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    
    if (seconds < 60) {
      return 'hace un momento';
    } else if (minutes < 60) {
      return `hace ${minutes} minutos`;
    } else if (hours < 24) {
      return `hace ${hours} horas`;
    } else {
      return `hace ${days} días`;
    }
  }
  
  // Métodos para crear datos de prueba
  createTestPosts(): void {
    this.posts = [
    {
      id: 1,
        title: 'Guía definitiva para aprender Angular 18 en 2024',
        content: 'Angular 18 trae grandes mejoras en rendimiento y nuevas características que facilitan el desarrollo de aplicaciones modernas. En esta guía exploraremos los conceptos fundamentales, desde la configuración del entorno hasta técnicas avanzadas para optimizar tus aplicaciones. También veremos las mejores prácticas para trabajar con el nuevo sistema de señales y cómo aprovechar al máximo las funcionalidades standalone.',
        userId: 1,
        userName: 'angularDev',
        categoryId: 1,
        categoryName: 'Desarrollo Frontend',
        commentCount: 24,
        createdAt: this.randomDate(7).toISOString(),
        status: 'ACTIVE',
        category: { id: 1, name: 'Desarrollo Frontend' }
    },
    {
      id: 2,
        title: 'Comparativa: React vs Angular vs Vue en 2024',
        content: '¿Cuál es el mejor framework frontend en 2024? Analizamos en profundidad las ventajas y desventajas de cada uno, considerando factores como rendimiento, curva de aprendizaje, soporte de la comunidad, y escalabilidad para proyectos de diferentes tamaños. También incluimos ejemplos de código y casos de uso donde cada framework brilla especialmente.',
        userId: 2,
        userName: 'techExplorer',
        categoryId: 1, 
        categoryName: 'Desarrollo Frontend',
        commentCount: 87,
        createdAt: this.randomDate(14).toISOString(),
        status: 'ACTIVE',
        category: { id: 1, name: 'Desarrollo Frontend' }
    },
    {
      id: 3,
        title: 'Implementando microservicios con Spring Boot y Docker',
        content: 'En este tutorial, mostramos paso a paso cómo diseñar e implementar una arquitectura de microservicios utilizando Spring Boot, Docker y Kubernetes. Aprenderás patrones de diseño comunes, estrategias de comunicación entre servicios, y técnicas para garantizar la resiliencia y escalabilidad de tu aplicación.',
        userId: 3,
        userName: 'javaGuru',
        categoryId: 2,
        categoryName: 'Desarrollo Backend',
        commentCount: 36,
        createdAt: this.randomDate(3).toISOString(),
        status: 'ACTIVE',
        category: { id: 2, name: 'Desarrollo Backend' }
    },
    {
      id: 4,
        title: 'Mejores prácticas para CI/CD con GitHub Actions',
        content: 'GitHub Actions se ha convertido en una herramienta fundamental para la integración y despliegue continuo. En este post, compartimos estrategias avanzadas para configurar flujos de trabajo eficientes, automatizar pruebas, y optimizar el proceso de entrega de software. Incluye ejemplos reales y configuraciones que puedes adaptar a tus proyectos.',
        userId: 4,
        userName: 'devOpsNinja',
        categoryId: 3,
        categoryName: 'DevOps y Cloud',
        commentCount: 19,
        createdAt: this.randomDate(5).toISOString(),
        status: 'ACTIVE',
        category: { id: 3, name: 'DevOps y Cloud' }
    },
    {
      id: 5,
        title: 'Introducción a LangChain: Construyendo aplicaciones con LLMs',
        content: 'LangChain es un framework que simplifica la creación de aplicaciones avanzadas con Modelos de Lenguaje de Gran Escala (LLMs). Este tutorial te guía a través de la configuración inicial, integración con diferentes modelos como GPT-4, y creación de cadenas complejas para aplicaciones de IA generativa con memoria y razonamiento.',
        userId: 5,
        userName: 'aiResearcher',
        categoryId: 4,
        categoryName: 'Inteligencia Artificial',
        commentCount: 42,
        createdAt: this.randomDate(2).toISOString(),
        status: 'ACTIVE',
        category: { id: 4, name: 'Inteligencia Artificial' }
      },
      {
        id: 6,
        title: 'Ofertas de trabajo remoto para desarrolladores en 2024',
        content: 'Hemos recopilado las mejores oportunidades de trabajo remoto para desarrolladores este año. Incluimos estadísticas salariales por tecnología, tips para preparar tu portfolio, y estrategias para destacar en entrevistas técnicas. También analizamos qué habilidades son las más demandadas según región y especialidad.',
        userId: 6,
        userName: 'techRecruiter',
        categoryId: 5,
        categoryName: 'Comunidad y Networking',
        commentCount: 65,
        createdAt: this.randomDate(1).toISOString(),
        status: 'ACTIVE',
        category: { id: 5, name: 'Comunidad y Networking' }
      }
    ];
  }
  
  appendTestPosts(): void {
    const newPosts = [
      {
        id: 7,
        title: 'Optimización avanzada de consultas SQL',
        content: 'Técnicas avanzadas para optimizar consultas complejas en bases de datos relacionales. Analizamos el uso de índices, estrategias de particionamiento, y herramientas de análisis de rendimiento para identificar cuellos de botella. Incluye ejemplos prácticos con MySQL, PostgreSQL y Oracle.',
        userId: 7,
        userName: 'dbWizard',
        categoryId: 2,
        categoryName: 'Desarrollo Backend',
        commentCount: 28,
        createdAt: this.randomDate(4).toISOString(),
        status: 'ACTIVE',
        category: { id: 2, name: 'Desarrollo Backend' }
      },
      {
        id: 8,
        title: 'Seguridad en aplicaciones web modernas',
        content: 'Una guía completa sobre seguridad para aplicaciones web. Cubrimos los principales vectores de ataque como XSS, CSRF, y SQL Injection, además de mejores prácticas para autenticación, autorización, y protección de datos sensibles. También analizamos herramientas y frameworks que pueden ayudarte a fortalecer la seguridad de tus aplicaciones.',
        userId: 8,
        userName: 'securityExpert',
        categoryId: 2,
        categoryName: 'Desarrollo Backend',
        commentCount: 33,
        createdAt: this.randomDate(6).toISOString(),
        status: 'ACTIVE',
        category: { id: 2, name: 'Desarrollo Backend' }
      },
      {
        id: 9,
        title: 'Experiencias con Kubernetes en producción',
        content: 'Lecciones aprendidas después de administrar clusters de Kubernetes en entornos de producción durante más de 3 años. Compartimos configuraciones óptimas, estrategias para gestionar actualizaciones, y técnicas para monitoreo y observabilidad. También abordamos recuperación ante desastres y estrategias de escalado automático.',
        userId: 9,
        userName: 'k8sMaster',
        categoryId: 3,
        categoryName: 'DevOps y Cloud',
        commentCount: 21,
        createdAt: this.randomDate(8).toISOString(),
        status: 'ACTIVE',
        category: { id: 3, name: 'DevOps y Cloud' }
      }
    ];
    
    // Añadir los nuevos posts a la lista existente
    this.posts = [...this.posts, ...newPosts];
    
    // Ordenar según el criterio actual
    this.sortTestPosts(this.sortBy);
  }
  
  createTestCategories(): void {
    this.categories = [
      { id: 1, name: 'Desarrollo Frontend', description: 'HTML, CSS, JavaScript, frameworks y librerías' },
      { id: 2, name: 'Desarrollo Backend', description: 'Lenguajes de servidor, bases de datos y arquitectura' },
      { id: 3, name: 'DevOps y Cloud', description: 'Contenedores, CI/CD, infraestructura y servicios cloud' },
      { id: 4, name: 'Inteligencia Artificial', description: 'Machine learning, deep learning y MLOps' },
      { id: 5, name: 'Comunidad y Networking', description: 'Eventos, oportunidades y colaboración' }
    ];
  }
  
  // Utilidades
  sortTestPosts(sortBy: string): void {
    if (sortBy === 'title') {
      this.posts.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'commentCount') {
      this.posts.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else if (sortBy === 'createdAt') {
      this.posts.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // orden descendente (más reciente primero)
      });
    }
  }
  
  randomDate(daysBack: number): Date {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * daysBack);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    
    const date = new Date(today);
    date.setDate(date.getDate() - randomDays);
    date.setHours(date.getHours() - randomHours);
    date.setMinutes(date.getMinutes() - randomMinutes);
    
    return date;
  }
}