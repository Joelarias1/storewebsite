import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User, PasswordChangeData } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (error) => {
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

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
} 