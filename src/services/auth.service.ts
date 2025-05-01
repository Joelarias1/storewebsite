import { Injectable } from '@angular/core';
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

  // BehaviorSubject para rastrear el estado de autenticación
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

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
   * Cierra la sesión eliminando el token y redirigiendo al login.
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Almacena el token en localStorage.
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * Obtiene el token almacenado.
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Verifica si existe un token almacenado.
   */
  private hasToken(): boolean {
    return !!this.getToken();
  }

  // Podrías añadir métodos para obtener el rol del usuario, etc.,
  // decodificando el token si es un JWT, o a partir de datos guardados.

} 