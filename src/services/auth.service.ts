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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth'; // URL base para autenticación
  private tokenKey = 'authToken'; // Clave para guardar el token en localStorage
  private isBrowser: boolean;

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
        // Si la respuesta es exitosa y contiene un token
        if (response && response.token) {
          this.storeToken(response.token);
          this.isAuthenticatedSubject.next(true); // Emitir que está autenticado
          // Aquí podrías guardar más datos del usuario si los devuelve el backend
        }
      }),
      catchError(error => {
        console.error('Error en el login:', error);
        this.isAuthenticatedSubject.next(false); // Emitir que no está autenticado
        return of(null); // Devuelve null en caso de error
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

  // Podrías añadir métodos para obtener el rol del usuario, etc.,
  // decodificando el token si es un JWT, o a partir de datos guardados.

} 