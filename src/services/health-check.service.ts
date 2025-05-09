import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';

interface DbStatusResponse {
  status: 'UP' | 'DOWN' | string; // Puede haber otros estados
}

export type DbConnectionStatus = 'UP' | 'DOWN' | 'ERROR' | 'CHECKING';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {

  // Usar la URL base desde environment
  private healthCheckUrl = `${environment.apiUrl}/api/health/db`; 

  constructor(private http: HttpClient) { }

  /**
   * Verifica el estado de la conexión a la base de datos llamando al backend.
   * Devuelve 'UP', 'DOWN', o 'ERROR' si la llamada falla.
   */
  checkDbStatus(): Observable<DbConnectionStatus> {
    return this.http.get<DbStatusResponse>(this.healthCheckUrl).pipe(
      map(response => {
        // Asume que 'UP' es el único estado bueno explícito
        if (response && response.status === 'UP') {
          return 'UP';
        } else {
          // Cualquier otro estado reportado por el backend se considera 'DOWN'
          return 'DOWN'; 
        }
      }),
      catchError(error => {
        console.error('Error al verificar estado de la BD:', error);
        // Asegurar que el tipo devuelto sea compatible
        return of('ERROR' as DbConnectionStatus);
      })
    );
  }
} 