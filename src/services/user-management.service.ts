import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, throwError, switchMap, delay, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
  status?: string;
  fullName?: string;
  avatar?: string;
  createdAt?: string;
}

// Enumeración simplificada de estados posibles para un usuario
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
    console.log('UserService usando URL base:', environment.apiUrl);
    console.log('Modo mock habilitado:', environment.useBackendMock);
  }

  // Crear un método para obtener headers con token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    console.log('Token obtenido para autenticación:', token ? 'presente' : 'ausente');
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
      console.log('Headers con authorization:', headers.has('Authorization'));
    } else {
      console.warn('No hay token disponible para la solicitud');
    }
    
    return headers;
  }

  // Obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    console.log('Realizando solicitud GET a', this.apiUrl);
    
    // Si el mock está habilitado, retornar datos simulados
    if (environment.useBackendMock) {
      console.log('Usando datos mock para getAllUsers');
      return of(this.getMockUsers());
    }
    
    return this.http.get<User[] | ApiResponse<User[]>>(this.apiUrl, { headers }).pipe(
      map(response => {
        // Verificar si la respuesta tiene estructura ApiResponse o es un array directo
        if (Array.isArray(response)) {
          console.log('Respuesta recibida como array:', response.length, 'usuarios');
          return response;
        } else if ('success' in response && response.success && response.data) {
          console.log('Respuesta recibida como ApiResponse exitosa');
          return response.data;
        } else if ('success' in response) {
          console.error('Error en ApiResponse:', response.message);
          throw new Error(response.message || 'Error al obtener usuarios');
        } else {
          console.error('Formato de respuesta inesperado');
          throw new Error('Formato de respuesta inesperado');
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Error en getAllUsers:', error);
        // Si es un error de conexión, usar datos mock
        if (error instanceof HttpErrorResponse && error.status === 0) {
          console.log('Error de conexión, usando datos mock');
          return of(this.getMockUsers());
        }
        
        // Si es un error HTTP, mostrar detalles
        if (error instanceof HttpErrorResponse) {
          console.error(`Código de estado: ${error.status}, mensaje: ${error.statusText}`);
        }
        return throwError(() => new Error('Error al obtener usuarios. Por favor, intenta más tarde.'));
      })
    );
  }

  // Obtener un usuario por ID
  getUserById(id: number): Observable<User> {
    const headers = this.getAuthHeaders();
    console.log(`Realizando solicitud GET a ${this.apiUrl}/${id}`);
    
    return this.http.get<ApiResponse<User> | User>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(response => {
        console.log('Respuesta recibida de getUserById:', response);
        
        // Verificar si la respuesta tiene estructura ApiResponse o es un objeto directo
        if (!('success' in response)) {
          console.log('Respuesta directa de objeto usuario');
          return response as User;
        } else if (response.success && response.data) {
          console.log('Respuesta ApiResponse con éxito');
          return response.data;
        } else {
          console.error('Error en la respuesta ApiResponse');
          throw new Error(response.message || 'Usuario no encontrado');
        }
      }),
      catchError(error => {
        console.error(`Error en getUserById(${id}):`, error);
        return throwError(() => error);
      })
    );
  }

  // Crear un nuevo usuario
  createUser(userData: User): Observable<User> {
    const headers = this.getAuthHeaders();
    console.log('Realizando solicitud POST a', this.apiUrl);
    console.log('Datos a enviar:', userData);
    
    // Si el mock está habilitado, simular creación
    if (environment.useBackendMock) {
      console.log('Usando datos mock para createUser');
      const mockUser = {...userData, id: Math.floor(Math.random() * 1000) + 10};
      return of(mockUser);
    }
    
    return this.http.post<ApiResponse<User> | User>(this.apiUrl, userData, { headers }).pipe(
      map(response => {
        console.log('Respuesta recibida de createUser:', response);
        
        // Verificar si la respuesta tiene estructura ApiResponse o es un objeto directo
        if (!('success' in response)) {
          console.log('Respuesta directa de objeto usuario');
          return response as User;
        } else if (response.success && response.data) {
          console.log('Respuesta ApiResponse con éxito');
          return response.data;
        } else {
          console.error('Error en la respuesta ApiResponse');
          throw new Error(response.message || 'Error al crear el usuario');
        }
      }),
      catchError(error => {
        console.error('Error en createUser:', error);
        return throwError(() => error);
      })
    );
  }

  // Actualizar un usuario existente
  updateUser(id: number, userData: User): Observable<User> {
    const headers = this.getAuthHeaders();
    console.log(`Intentando actualizar usuario con ID ${id}`, userData);
    console.log('Headers de la solicitud:', headers.keys());
    
    // Si el mock está habilitado, simular actualización
    if (environment.useBackendMock) {
      console.log('Usando datos mock para updateUser');
      const mockUser = {...userData, id: id};
      return of(mockUser);
    }
    
    // Formateamos el objeto para que coincida con UserManagementRequest en el backend
    const formattedData: Record<string, any> = {
      username: userData.username,
      email: userData.email,
      // Los siguientes campos deben seguir el formato que espera el backend
      role: userData.role,
      status: userData.status
    };
    
    // La contraseña es opcional en actualizaciones
    if (userData.password && userData.password.trim() !== '') {
      formattedData['password'] = userData.password;
    }
    
    // Estos campos no están en UserManagementRequest, el backend los ignorará
    // pero los enviamos por si acaso se han añadido posteriormente
    if (userData.fullName) {
      formattedData['fullName'] = userData.fullName;
    }
    
    if (userData.avatar && userData.avatar.trim() !== '') {
      formattedData['avatar'] = userData.avatar;
    }
    
    console.log('Datos formateados a enviar al backend:', formattedData);
    
    return this.http.put<ApiResponse<User> | User>(`${this.apiUrl}/${id}`, formattedData, { 
      headers,
      observe: 'response'  // Para obtener la respuesta HTTP completa
    }).pipe(
      map(response => {
        console.log('Respuesta HTTP completa:', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers.keys(),
          body: response.body
        });
        
        const responseData = response.body;
        
        // Verificar si la respuesta tiene estructura ApiResponse o es un objeto directo
        if (!responseData) {
          console.error('Respuesta vacía del servidor');
          throw new Error('Respuesta vacía del servidor');
        } else if (!('success' in responseData)) {
          console.log('Respuesta directa de objeto usuario');
          return responseData as User;
        } else if (responseData.success && responseData.data) {
          console.log('Respuesta ApiResponse con éxito');
          return responseData.data;
        } else {
          console.error('Error en la respuesta ApiResponse:', responseData.message);
          throw new Error(responseData.message || 'Error al actualizar el usuario');
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error(`Error en updateUser(${id}):`, error);
        
        if (error instanceof HttpErrorResponse) {
          console.error(`Código HTTP: ${error.status}, Mensaje: ${error.message}`);
          console.error('Cuerpo de la respuesta:', error.error);
          
          // Intenta extraer un mensaje más descriptivo de la respuesta
          let errorMsg = 'Error al actualizar el usuario';
          if (error.error && typeof error.error === 'object') {
            if ('message' in error.error) {
              errorMsg = error.error.message;
            } else if ('error' in error.error) {
              errorMsg = error.error.error;
            }
          }
          
          return throwError(() => new Error(errorMsg));
        }
        
        return throwError(() => error);
      })
    );
  }

  // Cambiar el estado de un usuario (activar o desactivar)
  changeUserStatus(id: number, newStatus: UserStatus): Observable<User> {
    console.log(`Cambiando estado del usuario ${id} a ${newStatus}`);
    
    // Si el mock está habilitado, simular cambio de estado
    if (environment.useBackendMock) {
      console.log('Usando datos mock para changeUserStatus');
      return this.getUserById(id).pipe(
        map(user => {
          const updatedUser = { ...user, status: newStatus };
          console.log('Usuario con estado actualizado (mock):', updatedUser);
          return updatedUser;
        })
      );
    }
    
    // Usamos el endpoint de actualización de usuarios pero solo enviamos el campo de estado
    const userData = { 
      username: '', 
      email: '',
      status: newStatus 
    } as User;
    
    const headers = this.getAuthHeaders();
    
    return this.http.put<ApiResponse<User> | User>(`${this.apiUrl}/${id}/status`, userData, { 
      headers,
      observe: 'response'
    }).pipe(
      map(response => {
        const responseData = response.body;
        
        if (!responseData) {
          throw new Error('Respuesta vacía del servidor');
        } else if (!('success' in responseData)) {
          return responseData as User;
        } else if (responseData.success && responseData.data) {
          return responseData.data;
        } else {
          throw new Error(responseData.message || `Error al cambiar estado del usuario a ${newStatus}`);
        }
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error(`Error en changeUserStatus(${id}):`, error);
        
        // Si hay error de conexión o error 404 (endpoint no implementado), intentar con updateUser
        if (error instanceof HttpErrorResponse && (error.status === 0 || error.status === 404)) {
          console.log('Endpoint específico no disponible, intentando con updateUser');
          return this.getUserById(id).pipe(
            map(user => {
              return { ...user, status: newStatus } as User;
            }),
            switchMap((updatedUser: User) => this.updateUser(id, updatedUser))
          );
        }
        
        return throwError(() => error);
      })
    );
  }

  // Activar un usuario
  activateUser(id: number): Observable<User> {
    return this.changeUserStatus(id, UserStatus.ACTIVE);
  }

  // Desactivar un usuario (equivalente a "banear")
  deactivateUser(id: number): Observable<User> {
    return this.changeUserStatus(id, UserStatus.INACTIVE);
  }

  // Eliminar un usuario
  deleteUser(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    // El endpoint correcto es DELETE /api/users/{id}
    const url = `${this.apiUrl}/${id}`;
    console.log(`Realizando solicitud DELETE a ${url}`);
    
    // Si el mock está habilitado, simular eliminación
    if (environment.useBackendMock) {
      console.log('Usando datos mock para deleteUser');
      return of({ success: true, message: 'Usuario eliminado con éxito (simulado)' })
        .pipe(
          delay(500) // Añadir un retardo artificial para simular procesamiento
        );
    }
    
    // Ahora el endpoint devuelve un objeto JSON con la información del resultado
    return this.http.delete<any>(url, { headers })
      .pipe(
        tap(response => {
          console.log('Respuesta de deleteUser:', response);
        }),
        map(response => {
          // Si la respuesta tiene el formato esperado { success: "true", message: "..." }
          if (response && response.success === "true") {
            return { 
              success: true, 
              message: response.message || 'Usuario eliminado correctamente',
              details: response.details
            };
          }
          
          // Si tiene otro formato pero parece válida
          if (response) {
            return { 
              success: true, 
              message: 'Usuario eliminado correctamente',
              data: response
            };
          }
          
          // Si la respuesta es vacía o nula, asumir éxito (podría ser 204 No Content)
          return { success: true, message: 'Usuario eliminado correctamente' };
        }),
        catchError((error: HttpErrorResponse | Error) => {
          console.error(`Error en deleteUser(${id}):`, error);
          
          // Si hay una respuesta de error JSON del servidor, intentar usarla
          if (error instanceof HttpErrorResponse && error.error) {
            if (typeof error.error === 'object' && 'message' in error.error) {
              return throwError(() => new Error(error.error.message));
            }
          }
          
          // Error genérico como fallback
          return throwError(() => new Error('Error al eliminar el usuario. Por favor, intenta más tarde.'));
        })
      );
  }

  // Datos mock para pruebas sin backend
  private getMockUsers(): User[] {
    return [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        fullName: 'Administrador del Sistema',
        avatar: 'https://ui-avatars.com/api/?name=Administrador&background=random',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'moderator',
        email: 'moderator@example.com',
        role: 'MODERATOR',
        status: 'ACTIVE',
        fullName: 'Moderador de Contenido',
        avatar: 'https://ui-avatars.com/api/?name=Moderador&background=random',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'usuario',
        email: 'usuario@example.com',
        role: 'USER',
        status: 'ACTIVE',
        fullName: 'Usuario Normal',
        avatar: 'https://ui-avatars.com/api/?name=Usuario&background=random',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        username: 'suspendido',
        email: 'suspendido@example.com',
        role: 'USER',
        status: 'BANNED',
        fullName: 'Usuario Suspendido',
        avatar: 'https://ui-avatars.com/api/?name=Suspendido&background=random',
        createdAt: new Date().toISOString()
      }
    ];
  }
} 