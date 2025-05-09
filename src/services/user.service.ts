import { Injectable } from '@angular/core';
import { Observable, throwError, catchError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

export interface UserPreferences {
  theme: string;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface User {
  id?: number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  joinDate?: Date;
  location?: string;
  bio?: string;
  website?: string;
  avatar?: string;
  social?: SocialLinks;
  preferences?: UserPreferences;
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
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    console.log('UserService usando URL base:', environment.apiUrl);
  }

  /**
   * Obtiene los headers con el token de autenticación
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  /**
   * Obtiene los datos del usuario actual directamente desde el backend
   */
  getCurrentUser(): Observable<User> {
    console.log('Obteniendo perfil de usuario desde:', `${this.apiUrl}/profile`);
    const headers = this.getAuthHeaders();
    
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError(error => {
        console.error('Error obteniendo perfil de usuario:', error);
        return throwError(() => new Error('No se pudo obtener la información del perfil'));
      })
    );
  }

  /**
   * Actualiza el perfil del usuario directamente en el backend
   */
  updateProfile(userData: User): Observable<User> {
    console.log('Actualizando perfil de usuario en:', `${this.apiUrl}/profile`);
    console.log('Datos a enviar:', userData);
    
    const headers = this.getAuthHeaders();
    return this.http.put<User>(`${this.apiUrl}/profile`, userData, { headers }).pipe(
      catchError(error => {
        console.error('Error actualizando perfil de usuario:', error);
        return throwError(() => new Error('Error al actualizar el perfil'));
      })
    );
  }

  /**
   * Cambia la contraseña del usuario en el backend
   */
  changePassword(passwordData: PasswordChangeData): Observable<boolean> {
    console.log('Cambiando contraseña de usuario en:', `${this.apiUrl}/change-password`);
    
    const headers = this.getAuthHeaders();
    return this.http.post<boolean>(`${this.apiUrl}/change-password`, passwordData, { headers }).pipe(
      catchError(error => {
        console.error('Error cambiando contraseña:', error);
        return throwError(() => new Error('Error al cambiar la contraseña'));
      })
    );
  }

  /**
   * Actualiza las preferencias del usuario en el backend
   */
  updatePreferences(preferences: UserPreferences): Observable<any> {
    console.log('Actualizando preferencias de usuario en:', `${this.apiUrl}/preferences`);
    console.log('Preferencias a enviar:', preferences);
    
    const headers = this.getAuthHeaders();
    return this.http.put<any>(`${this.apiUrl}/preferences`, preferences, { headers }).pipe(
      catchError(error => {
        console.error('Error actualizando preferencias:', error);
        return throwError(() => new Error('Error al actualizar las preferencias'));
      })
    );
  }
} 