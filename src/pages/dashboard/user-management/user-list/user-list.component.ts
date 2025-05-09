import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserManagementService, User, UserStatus } from '../../../../services/user-management.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  searchTerm: string = '';
  sortField: string = 'username';
  sortDirection: 'asc' | 'desc' = 'asc';
  retryCount = 0;
  maxRetries = 3;
  processingUserId: number | null = null; // Para seguimiento del usuario que está siendo procesado

  constructor(private userService: UserManagementService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = this.processUserData(data);
        this.applyFilters();
        this.isLoading = false;
        this.retryCount = 0; // Resetear contador de reintentos al tener éxito
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = err.message || 'Ocurrió un error al cargar los usuarios. Por favor, intenta nuevamente.';
        this.isLoading = false;
        
        // Reintentar automáticamente (máximo 3 veces) con un retardo incremental
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          const retryDelay = this.retryCount * 1000; // 1s, 2s, 3s
          
          console.log(`Reintentando en ${retryDelay/1000} segundos... (intento ${this.retryCount}/${this.maxRetries})`);
          
          setTimeout(() => {
            this.loadUsers();
          }, retryDelay);
        } else {
          // Cargar datos de respaldo para demostración después de agotar reintentos
          this.loadFallbackData();
        }
      }
    });
  }

  deleteUser(id: number): void {
    // Encontrar el nombre del usuario para personalizar mensajes
    const user = this.users.find(u => u.id === id);
    if (!user) return;
    
    const userName = user.fullName || user.username;
    const userRole = user.role || 'Usuario';
    
    // Mensaje de confirmación personalizado
    const confirmMessage = `¿Estás seguro que deseas eliminar al usuario ${userName}?\n\n` +
      `Rol: ${userRole}\n` +
      `Email: ${user.email}\n\n` +
      `Esta acción no se puede deshacer y eliminará todos los datos asociados a este usuario.`;
      
    if (!confirm(confirmMessage)) {
      return;
    }
    
    this.processingUserId = id;
    this.error = null;
    this.successMessage = null;
    
    console.log(`Iniciando proceso de eliminación para usuario ID ${id} (${userName})`);
    
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        console.log('Respuesta recibida:', response);
        
        // Actualizar la UI quitando el usuario de la lista
        this.users = this.users.filter(user => user.id !== id);
        this.applyFilters();
        
        this.successMessage = `El usuario ${userName} ha sido eliminado correctamente.`;
        this.processingUserId = null;
        
        // Auto-esconder mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.error = err.message || 'Ocurrió un error al eliminar el usuario. Por favor, intenta nuevamente.';
        this.processingUserId = null;
        
        // Auto-esconder mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = [...this.users];
    
    // Aplicar filtro de búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.filteredUsers = this.filteredUsers.filter(user => 
        user.username.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.fullName && user.fullName.toLowerCase().includes(term))
      );
    }
    
    // Aplicar ordenamiento
    this.sortUsers();
  }

  sortUsers(field?: string): void {
    if (field) {
      // Si se hace clic en el mismo campo, invertir la dirección
      if (field === this.sortField) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortField = field;
        this.sortDirection = 'asc';
      }
    }
    
    this.filteredUsers.sort((a, b) => {
      // @ts-ignore
      let aValue = a[this.sortField];
      // @ts-ignore
      let bValue = b[this.sortField];
      
      // Para manejar valores nulos/undefined
      if (!aValue) aValue = '';
      if (!bValue) bValue = '';
      
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue) 
        : aValue - bValue;
        
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Procesar los datos de usuarios para asegurarse de que todos los campos necesarios existan
  private processUserData(users: User[]): User[] {
    return users.map(user => {
      // Generar nombre completo si no existe basado en username
      if (!user.fullName) {
        user.fullName = this.capitalizeFirstLetter(user.username);
      }
      
      // Generar avatar placeholder si no existe
      if (!user.avatar) {
        // Aquí podrías generar un avatar con servicios como UI Avatars o similar
        user.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}&background=random&color=fff&size=128`;
      }
      
      // Establecer fecha de creación si no existe
      if (!user.createdAt) {
        user.createdAt = new Date().toISOString().split('T')[0];
      }
      
      return user;
    });
  }

  // Capitalizar la primera letra de cada palabra
  private capitalizeFirstLetter(text: string): string {
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Datos de respaldo para demostración en caso de error
  private loadFallbackData(): void {
    this.users = [
      { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN', status: 'ACTIVE', fullName: 'Administrador', createdAt: '2023-01-01' },
      { id: 2, username: 'usuario1', email: 'usuario1@example.com', role: 'USER', status: 'ACTIVE', fullName: 'Usuario Uno', createdAt: '2023-01-15' },
      { id: 3, username: 'usuario2', email: 'usuario2@example.com', role: 'USER', status: 'INACTIVE', fullName: 'Usuario Dos', createdAt: '2023-02-10' }
    ];
    this.applyFilters();
  }

  // Cambiar el estado de un usuario
  toggleUserStatus(user: User): void {
    if (!user.id) return;
    
    this.processingUserId = user.id;
    const isCurrentlyActive = user.status === 'ACTIVE';
    const newStatus = isCurrentlyActive ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    const actionText = isCurrentlyActive ? 'desactivar' : 'activar';

    if (confirm(`¿Estás seguro que deseas ${actionText} al usuario ${user.username}?`)) {
      if (isCurrentlyActive) {
        this.deactivateUser(user.id);
      } else {
        this.activateUser(user.id);
      }
    } else {
      this.processingUserId = null; // Si se cancela el diálogo, limpiar el ID en proceso
    }
  }

  // Activar un usuario
  activateUser(id: number): void {
    this.userService.activateUser(id).subscribe({
      next: (updatedUser) => {
        // Actualizar el usuario en la lista local
        this.updateUserInList(id, updatedUser);
        this.successMessage = `Usuario activado correctamente.`;
        this.processingUserId = null;
        
        // Auto-esconder mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error(`Error al activar usuario ${id}:`, err);
        this.error = `Error al activar usuario: ${err.message || 'Error desconocido'}`;
        this.processingUserId = null;
        
        // Auto-esconder mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  // Desactivar un usuario
  deactivateUser(id: number): void {
    this.userService.deactivateUser(id).subscribe({
      next: (updatedUser) => {
        // Actualizar el usuario en la lista local
        this.updateUserInList(id, updatedUser);
        this.successMessage = `Usuario desactivado correctamente.`;
        this.processingUserId = null;
        
        // Auto-esconder mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error(`Error al desactivar usuario ${id}:`, err);
        this.error = `Error al desactivar usuario: ${err.message || 'Error desconocido'}`;
        this.processingUserId = null;
        
        // Auto-esconder mensaje de error después de 5 segundos
        setTimeout(() => {
          this.error = null;
        }, 5000);
      }
    });
  }

  // Actualizar un usuario en la lista local después de modificarlo
  private updateUserInList(id: number, updatedUser: User): void {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      this.applyFilters(); // Reordenar y filtrar la lista actualizada
    }
  }
} 