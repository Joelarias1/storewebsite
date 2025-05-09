import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService, User, PasswordChangeData, UserPreferences } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ForumService } from '../../../services/forum.service';
import { Post } from '../../../app/models/post.interface';

// Interfaz para las categorías del foro
interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
  topicCount: number;
}

// Interfaz para los temas del usuario
interface UserTopic {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  date: Date;
  replies: number;
  isFavorite: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Estados
  isLoading = true;
  isEditingProfile = false;
  isChangingPassword = false;
  successMessage = '';
  errorMessage = '';
  
  // Datos del usuario
  user: User | null = null;
  
  // Datos de cambio de contraseña
  passwordData: PasswordChangeData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  // Categorías del foro
  forumCategories: ForumCategory[] = [];

  // Posts del usuario
  userPosts: Post[] = [];
  favoritePosts: Post[] = [];
  showingFavorites = false;
  isLoadingPosts = false;
  
  // Lista de IDs de posts favoritos
  favoritePostIds: number[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private forumService: ForumService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadUserPosts();
    
    // Establecer algunos IDs favoritos de ejemplo (en un sistema real esto vendría de la base de datos)
    this.favoritePostIds = [1, 3, 5]; 
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;
        
        // Inicializar preferencias si no existen
        if (!this.user.preferences) {
          this.user.preferences = { theme: 'dark' };
        }
        
        // Inicializar social si no existe
        if (!this.user.social) {
          this.initializeSocial();
        }
        
        console.log('Perfil cargado correctamente:', this.user);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error cargando perfil:', error);
        
        // Creamos un usuario simulado básico para permitir que la interfaz funcione
        this.user = {
          fullName: 'Usuario de Prueba',
          username: 'usuario',
          email: 'usuario@example.com',
          role: 'USER',
          joinDate: new Date(),
          bio: 'Usuario de prueba creado por error de conexión.',
          social: { twitter: '', github: '', linkedin: '' },
          preferences: { theme: 'dark' }
        };
        
        this.errorMessage = 'No se pudo conectar con el servidor. Usando perfil de prueba. Verifica tu conexión y asegúrate que el servidor esté en ejecución.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Inicializa el objeto social en el usuario si no existe
   */
  initializeSocial(): void {
    if (!this.user) return;
    
    this.user.social = {
      twitter: '',
      github: '',
      linkedin: ''
    };
    
    console.log('Objeto social inicializado');
  }

  toggleEditProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
    // Limpiamos los mensajes cuando entramos/salimos del modo edición
    this.clearMessages();
  }

  toggleChangePassword(): void {
    this.isChangingPassword = !this.isChangingPassword;
    // Reseteamos el formulario de cambio de contraseña
    this.passwordData = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    // Limpiamos los mensajes
    this.clearMessages();
  }

  saveProfile(): void {
    if (!this.user) return;
    
    // Validaciones básicas
    if (!this.user.fullName || !this.user.username || !this.user.email) {
      this.errorMessage = 'Por favor completa los campos obligatorios';
      return;
    }
    
    // Asegurarnos de que social existe antes de guardar
    if (!this.user.social) {
      this.initializeSocial();
    }
    
    this.userService.updateProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Perfil actualizado correctamente';
        this.isEditingProfile = false;
        
        // Ocultamos el mensaje después de unos segundos
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (error) => {
        console.error('Error actualizando perfil:', error);
        this.errorMessage = 'Error al actualizar el perfil. Verifica tu conexión con el servidor.';
      }
    });
  }

  changePassword(): void {
    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    
    if (this.passwordData.newPassword.length < 8) {
      this.errorMessage = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }
    
    this.userService.changePassword(this.passwordData).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = 'Contraseña actualizada correctamente';
          this.isChangingPassword = false;
          // Ocultamos el mensaje después de unos segundos
          setTimeout(() => this.clearMessages(), 5000);
        } else {
          this.errorMessage = 'Error al actualizar la contraseña. Inténtalo nuevamente.';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la contraseña. Inténtalo nuevamente.';
        console.error('Error cambiando contraseña:', error);
      }
    });
  }

  selectTheme(theme: string): void {
    if (!this.user || !this.user.preferences) return;
    
    this.user.preferences.theme = theme;
    this.saveThemePreference();
  }

  saveThemePreference(): void {
    if (!this.user || !this.user.preferences) return;
    
    this.userService.updatePreferences(this.user.preferences).subscribe({
      next: () => {
        this.successMessage = 'Tema actualizado correctamente';
        // Aplicar tema inmediatamente
        document.documentElement.setAttribute('data-theme', this.user?.preferences?.theme || 'dark');
        // Ocultamos el mensaje después de unos segundos
        setTimeout(() => this.clearMessages(), 3000);
      },
      error: (error: any) => {
        this.errorMessage = 'Error al actualizar el tema';
        console.error('Error actualizando tema:', error);
      }
    });
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  /**
   * Carga las publicaciones del usuario actual
   */
  loadUserPosts(): void {
    if (!this.user || !this.user.id) {
      console.error('No hay un usuario válido para cargar posts');
      return;
    }
    
    this.isLoadingPosts = true;
    this.showingFavorites = false;
    
    this.forumService.getPostsByUser(this.user.id).subscribe({
      next: (posts) => {
        this.userPosts = posts;
        this.isLoadingPosts = false;
        console.log('Posts del usuario cargados:', posts);
      },
      error: (error) => {
        console.error('Error cargando posts del usuario:', error);
        
        // Crear posts simulados para pruebas
        this.userPosts = [
          {
            id: 1,
            title: 'Problemas con renderizado en Angular 17',
            content: 'Descripción del problema...',
            userId: this.user?.id || 1,
            categoryId: 1,
            categoryName: 'Angular',
            commentCount: 24,
            createdAt: '2023-05-20'
          },
          {
            id: 2,
            title: '¿Cómo implementar microservicios con Spring Boot?',
            content: 'Descripción del problema...',
            userId: this.user?.id || 1,
            categoryId: 2,
            categoryName: 'Spring',
            commentCount: 15,
            createdAt: '2023-05-18'
          },
          {
            id: 3,
            title: 'Configuración óptima de Docker para entornos de desarrollo',
            content: 'Descripción del problema...',
            userId: this.user?.id || 1,
            categoryId: 3,
            categoryName: 'DevOps',
            commentCount: 38,
            createdAt: '2023-05-15'
          }
        ];
        
        this.isLoadingPosts = false;
      }
    });
  }

  /**
   * Carga las publicaciones favoritas del usuario
   */
  loadFavoritePosts(): void {
    this.isLoadingPosts = true;
    this.showingFavorites = true;
    
    // En un sistema real, se obtendría de la API
    // Por ahora simulamos filtrando los posts que consideramos favoritos
    setTimeout(() => {
      this.favoritePosts = this.userPosts.filter(post => this.favoritePostIds.includes(post.id || 0));
      this.isLoadingPosts = false;
    }, 500);
  }

  /**
   * Verifica si un post es favorito
   */
  isFavoritePost(post: Post): boolean {
    return this.favoritePostIds.includes(post.id || 0);
  }

  /**
   * Cambia el estado de favorito de un post
   */
  toggleFavoritePost(post: Post): void {
    if (!post.id) return;
    
    if (this.isFavoritePost(post)) {
      // Remover de favoritos
      this.favoritePostIds = this.favoritePostIds.filter(id => id !== post.id);
      this.successMessage = `"${post.title}" removido de favoritos`;
    } else {
      // Agregar a favoritos
      this.favoritePostIds.push(post.id);
      this.successMessage = `"${post.title}" agregado a favoritos`;
    }
    
    // Actualizar lista de favoritos si estamos en esa vista
    if (this.showingFavorites) {
      this.favoritePosts = this.userPosts.filter(post => this.favoritePostIds.includes(post.id || 0));
    }
    
    setTimeout(() => this.clearMessages(), 3000);
  }

  // Método para volver al dashboard
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
} 