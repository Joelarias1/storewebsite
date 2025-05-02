import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    console.log('AuthInterceptor - Token encontrado:', token);
    if (token) {
      // Clonar la petición y añadir encabezado Authorization
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor - Adjuntando header Authorization:', cloned.headers.get('Authorization'));
      return next.handle(cloned);
    }
    // Si no hay token, continuar sin modificar la petición
    console.log('AuthInterceptor - No hay token, petición sin modificar.');
    return next.handle(req);
  }
} 