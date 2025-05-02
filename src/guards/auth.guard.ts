import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, take, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Verificar si hay un token directamente
    const token = this.authService.getToken();
    console.log('AuthGuard - Token encontrado:', !!token);
    
    if (token) {
      // Si hay token, permitir el acceso
      return true;
    }
    
    // Si no hay token, verificar el observable por si acaso
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        console.log('AuthGuard - isAuthenticated:', isAuthenticated);
        if (isAuthenticated) {
          return true;
        }
        
        // Si no está autenticado, redirigir al login
        console.log('AuthGuard - Redirigiendo a login');
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      })
    );
  }
}

// Exportar la función de guardia para usar con el nuevo sistema de Router de Angular
export const authGuard = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  return inject(AuthGuard).canActivate(route, state);
}; 