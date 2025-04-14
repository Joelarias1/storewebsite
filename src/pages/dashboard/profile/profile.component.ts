import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService, User, PasswordChangeData, UserPreferences } from '../../../services/user.service';

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
  forumCategories: ForumCategory[] = [
    {
      id: 'gaming',
      name: 'Gaming',
      description: 'Discusiones sobre videojuegos y consolas',
      icon: 'gamepad',
      colorClass: 'bg-green-600',
      topicCount: 128
    },
    {
      id: 'tech',
      name: 'Tecnología',
      description: 'Novedades y debates sobre tecnología',
      icon: 'microchip',
      colorClass: 'bg-blue-600',
      topicCount: 93
    },
    {
      id: 'movies',
      name: 'Cine y Series',
      description: 'Estrenos, críticas y recomendaciones',
      icon: 'film',
      colorClass: 'bg-red-600',
      topicCount: 64
    },
    {
      id: 'books',
      name: 'Literatura',
      description: 'Habla sobre tus libros favoritos',
      icon: 'book',
      colorClass: 'bg-yellow-600',
      topicCount: 47
    }
  ];

  // Temas del usuario
  userTopics: UserTopic[] = [];
  recentTopics: UserTopic[] = [
    {
      id: 'topic1',
      title: '¿Cuáles son los mejores juegos de 2023?',
      category: 'Gaming',
      categoryId: 'gaming',
      date: new Date('2023-05-20'),
      replies: 24,
      isFavorite: true
    },
    {
      id: 'topic2',
      title: 'Review: Nueva película de ciencia ficción',
      category: 'Cine y Series',
      categoryId: 'movies',
      date: new Date('2023-05-18'),
      replies: 15,
      isFavorite: false
    },
    {
      id: 'topic3',
      title: 'Debate: ¿Vale la pena comprar un Mac?',
      category: 'Tecnología',
      categoryId: 'tech',
      date: new Date('2023-05-15'),
      replies: 38,
      isFavorite: true
    }
  ];
  favoriteTopics: UserTopic[] = [];
  showingRecentTopics = true;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadRecentTopics();
    // Filtramos los temas favoritos
    this.favoriteTopics = this.recentTopics.filter(topic => topic.isFavorite);
  }

  loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;
        // Inicializar preferencias si no existen
        if (!this.user.preferences) {
          this.user.preferences = { theme: 'dark' };
        }
      },
      error: (error: any) => {
        this.errorMessage = 'No se pudo cargar la información del perfil';
        console.error('Error cargando perfil:', error);
      }
    });
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
    
    this.userService.updateProfile(this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Perfil actualizado correctamente';
        this.isEditingProfile = false;
        // Ocultamos el mensaje después de unos segundos
        setTimeout(() => this.clearMessages(), 5000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el perfil';
        console.error('Error actualizando perfil:', error);
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
          this.errorMessage = 'Error al actualizar la contraseña';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la contraseña';
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

  loadRecentTopics(): void {
    this.showingRecentTopics = true;
    this.userTopics = this.recentTopics;
  }

  loadFavoriteTopics(): void {
    this.showingRecentTopics = false;
    this.userTopics = this.favoriteTopics;
  }

  toggleFavorite(topic: UserTopic): void {
    topic.isFavorite = !topic.isFavorite;
    
    // Actualizamos la lista de favoritos
    if (topic.isFavorite) {
      if (!this.favoriteTopics.some(t => t.id === topic.id)) {
        this.favoriteTopics.push(topic);
      }
    } else {
      this.favoriteTopics = this.favoriteTopics.filter(t => t.id !== topic.id);
    }
    
    // Si estamos viendo favoritos y quitamos un favorito, actualizamos la lista
    if (!this.showingRecentTopics) {
      this.userTopics = this.favoriteTopics;
    }
    
    // En una aplicación real, aquí enviaríamos la actualización al backend
    this.successMessage = topic.isFavorite 
      ? 'Tema añadido a favoritos'
      : 'Tema eliminado de favoritos';
    setTimeout(() => this.clearMessages(), 3000);
  }
} 