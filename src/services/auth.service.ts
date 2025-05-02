import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

// Interfaz para los datos enviados al endpoint de login
export interface LoginCredentials {
  email: string; // O username, dependiendo de tu backend
  password: string;
}

// Interfaz para la respuesta esperada del backend (ajustar según tu backend)
export interface AuthResponse {
  token: string; // Asumiendo que el backend devuelve un token JWT
  userId?: number | string;
  role?: string;
  // Puedes añadir más campos como nombre de usuario, etc.
}

// Interfaz para el usuario almacenado localmente
export interface StoredUser {
  id: number;
  email: string;
  role?: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; // URL base para autenticación
  private tokenKey = 'authToken'; // Clave para guardar el token en localStorage
  private isBrowser: boolean;
  private userKey = 'user'; // Clave para almacenar datos del usuario

  // BehaviorSubject para rastrear el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.isAuthenticatedSubject.next(this.hasToken());
    }
  }

  /**
   * Intenta iniciar sesión llamando al backend.
   */
  login(credentials: LoginCredentials): Observable<AuthResponse | null> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Depuración completa de la respuesta
        console.log('Respuesta completa del servidor:', response);
        console.log('Propiedades de la respuesta:', Object.keys(response));
        
        // Si la respuesta es exitosa y contiene un token
        if (response && response.token) {
          this.storeToken(response.token);
          
          // Depurar cada campo
          console.log('Token recibido:', response.token);
          console.log('userId recibido:', response.userId);
          console.log('role recibido:', response.role);
          
          // Forzar el rol a ADMIN para pruebas si no viene del backend
          const role = response.role || 'ADMIN';
          console.log('Rol a utilizar:', role);
          
          // Almacenar la información del usuario incluyendo el rol
          const userData: StoredUser = {
            id: Number(response.userId) || 0,
            email: credentials.email,
            role: role,
            token: response.token
          };
          
          console.log('Datos de usuario COMPLETOS a guardar:', userData);
          console.log('Verificando role en userData:', userData.role);
          
          // Guardar en localStorage
          if (this.isBrowser) {
            localStorage.setItem(this.userKey, JSON.stringify(userData));
            
            // Verificar lo que se guardó realmente
            const saved = localStorage.getItem(this.userKey);
            console.log('Datos guardados en localStorage:', saved);
            if (saved) {
              const parsedUser = JSON.parse(saved);
              console.log('Usuario parseado de localStorage:', parsedUser);
              console.log('Rol guardado en localStorage:', parsedUser.role);
            }
          }
          
          this.isAuthenticatedSubject.next(true);
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        this.isAuthenticatedSubject.next(false);
        return of(null);
      })
    );
  }

  /**
   * Intenta registrar un nuevo usuario llamando al backend.
   */
  register(userData: any): Observable<any> { // Usar 'any' por ahora, ajustar con DTO si es necesario
    // Asegurarse de enviar solo los datos que espera el backend (RegisterRequestDto)
    const registerData = {
      username: userData.username,
      email: userData.email,
      password: userData.password
      // Añadir otros campos si el backend los espera
    };
    return this.http.post<any>(`${this.apiUrl}/register`, registerData).pipe(
      catchError(error => {
        console.error('Error en el registro:', error);
        // Podríamos devolver el objeto de error para que el componente lo maneje
        return of(error); 
      })
    );
  }

  /**
   * Cierra la sesión eliminando el token y redirigiendo al login.
   */
  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey); // También eliminar los datos del usuario
      this.isAuthenticatedSubject.next(false);
      this.router.navigate(['/login']);
    }
  }

  /**
   * Almacena el token en localStorage (solo si es navegador).
   */
  private storeToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Obtiene el token almacenado (solo si es navegador).
   */
  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null; // Retorna null en el servidor
  }

  /**
   * Verifica si existe un token almacenado (solo si es navegador).
   */
  private hasToken(): boolean {
    return this.isBrowser && !!this.getToken();
  }

  /**
   * Verifica si el usuario actual es administrador.
   */
  isUserAdmin(): boolean {
    const currentUser = this.getCurrentUser();
    console.log('Verificando si el usuario es admin:', currentUser);
    
    if (!currentUser) {
      console.log('No hay usuario actual');
      return false;
    }
    
    // Para pruebas, forzar ADMIN si no hay rol especificado
    if (!currentUser.role) {
      console.log('No hay rol definido, asumiendo ADMIN para pruebas');
      this.setUserRole('ADMIN');
      return true;
    }
    
    const isAdmin = currentUser.role === 'ADMIN';
    console.log(`Usuario con rol ${currentUser.role}, ¿es ADMIN?:`, isAdmin);
    return isAdmin;
  }

  /**
   * Obtiene los datos del usuario actual desde localStorage.
   */
  getCurrentUser(): StoredUser | null {
    try {
      const userData = localStorage.getItem(this.userKey);
      if (!userData) return null;
      
      const user = JSON.parse(userData) as StoredUser;
      
      // Para pruebas, asegurar que tenga un rol
      if (!user.role) {
        user.role = 'ADMIN';
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }
      
      return user;
    } catch (e) {
      console.error('Error al leer datos del usuario:', e);
      return null;
    }
  }
  
  /**
   * Establece explícitamente el rol del usuario actual
   */
  setUserRole(role: string): void {
    const user = this.getCurrentUser();
    if (user) {
      user.role = role;
      localStorage.setItem(this.userKey, JSON.stringify(user));
      console.log('Rol de usuario actualizado a:', role);
    }
  }
} 