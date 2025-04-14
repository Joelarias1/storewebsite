import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

interface SearchResult {
  id: string;
  type: 'topic' | 'comment';
  title: string;
  content: string;
  category: string;
  categoryId: string;
  author: string;
  date: Date;
  relevance: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchResults: SearchResult[] = [];
  isLoading: boolean = false;
  searchFilters = {
    category: 'all',
    type: 'all',
    sortBy: 'relevance'
  };
  
  // Categorías disponibles para filtrar
  categories = [
    { id: 'gaming', name: 'Gaming' },
    { id: 'tech', name: 'Tecnología' },
    { id: 'movies', name: 'Cine y Series' },
    { id: 'books', name: 'Literatura' },
    { id: 'sports', name: 'Deportes' }
  ];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Obtener el parámetro de búsqueda de la URL
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.performSearch();
      }
    });
  }

  performSearch(): void {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      return;
    }
    
    this.isLoading = true;
    
    // Simular una petición al backend
    setTimeout(() => {
      // Datos de ejemplo
      this.searchResults = [
        {
          id: 'topic1',
          type: 'topic' as 'topic',
          title: 'Los mejores juegos de rol para PS5',
          content: '...aquí encontrarás una lista completa de los mejores juegos de rol para PS5 que han salido este año...',
          category: 'Gaming',
          categoryId: 'gaming',
          author: 'gaming_master',
          date: new Date('2023-08-15'),
          relevance: 98
        },
        {
          id: 'comment1',
          type: 'comment' as 'comment',
          title: 'Re: Debate sobre el futuro de JavaScript',
          content: '...creo que TypeScript va a seguir ganando popularidad debido a sus ventajas en proyectos grandes...',
          category: 'Tecnología',
          categoryId: 'tech',
          author: 'dev_guru',
          date: new Date('2023-08-20'),
          relevance: 85
        },
        {
          id: 'topic2',
          type: 'topic' as 'topic',
          title: 'Análisis profundo: The Last of Us Part II',
          content: '...este juego representa un hito en la narrativa de videojuegos por su forma de abordar temas complejos...',
          category: 'Gaming',
          categoryId: 'gaming',
          author: 'story_lover',
          date: new Date('2023-07-30'),
          relevance: 80
        },
        {
          id: 'topic3',
          type: 'topic' as 'topic',
          title: 'Las mejores series de ciencia ficción de 2023',
          content: '...este año ha sido increíble para los fans de la ciencia ficción con estrenos como...',
          category: 'Cine y Series',
          categoryId: 'movies',
          author: 'sci_fi_fan',
          date: new Date('2023-08-05'),
          relevance: 75
        },
        {
          id: 'comment2',
          type: 'comment' as 'comment',
          title: 'Re: Recomendaciones de libros de fantasía',
          content: '...si te gustó El Nombre del Viento, definitivamente deberías leer La Música del Silencio...',
          category: 'Literatura',
          categoryId: 'books',
          author: 'bookworm',
          date: new Date('2023-08-10'),
          relevance: 70
        }
      ].filter(result => {
        // Aplicar filtros
        if (this.searchFilters.category !== 'all' && result.categoryId !== this.searchFilters.category) {
          return false;
        }
        
        if (this.searchFilters.type !== 'all' && result.type !== this.searchFilters.type) {
          return false;
        }
        
        return true;
      }).sort((a, b) => {
        // Aplicar ordenamiento
        if (this.searchFilters.sortBy === 'relevance') {
          return b.relevance - a.relevance;
        } else if (this.searchFilters.sortBy === 'date') {
          return b.date.getTime() - a.date.getTime();
        }
        return 0;
      });
      
      this.isLoading = false;
    }, 800);
  }

  applyFilters(): void {
    this.performSearch();
  }

  clearFilters(): void {
    this.searchFilters = {
      category: 'all',
      type: 'all',
      sortBy: 'relevance'
    };
    this.performSearch();
  }
} 