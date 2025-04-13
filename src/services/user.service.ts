import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  fullName: string;
  username: string;
  email: string;
  role: string;
  joinDate: Date;
  location: string;
  bio: string;
  website: string;
  avatar: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private mockUser: User = {
    fullName: 'Juan Pérez',
    username: 'juanperez',
    email: 'juan.perez@example.com',
    role: 'Administrador',
    joinDate: new Date('2022-01-15'),
    location: 'Santiago, Chile',
    bio: 'Desarrollador full stack apasionado por la tecnología y el diseño de experiencias de usuario.',
    website: 'https://juanperez.dev',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80',
    social: {
      twitter: 'juanperezdev',
      github: 'juanperez',
      linkedin: 'juan-perez'
    }
  };

  constructor() { }

  getCurrentUser(): Observable<User> {
    // Simulamos una petición al backend
    return of(this.mockUser);
  }

  updateProfile(userData: User): Observable<User> {
    // En una aplicación real, aquí haríamos una petición POST al backend
    this.mockUser = {...userData};
    return of(this.mockUser);
  }

  changePassword(passwordData: PasswordChangeData): Observable<boolean> {
    // En una aplicación real, aquí validaríamos la contraseña actual
    // y enviaríamos la nueva contraseña al backend
    return of(true);
  }
} 