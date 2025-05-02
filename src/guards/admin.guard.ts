import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    // Obtener datos del usuario actual desde localStorage
    const currentUser = this.authService.getCurrentUser();
    console.log('AdminGuard - Usuario actual:', currentUser);
    
    // Verificación directa basada en el rol
    if (currentUser && currentUser.role === 'ADMIN') {
      console.log('AdminGuard - Acceso concedido: el usuario es ADMIN');
      return true;
    }
    
    // Mostrar más información para depurar
    if (currentUser) {
      console.log('AdminGuard - Rol del usuario:', currentUser.role);
      console.log('AdminGuard - ¿Es ADMIN?:', currentUser.role === 'ADMIN');
      
      // Intentar leer el token decodificado para depuración
      try {
        const token = currentUser.token;
        console.log('AdminGuard - Token presente:', !!token);
        // Aquí podríamos decodificar el token si fuera necesario
      } catch (e) {
        console.error('AdminGuard - Error al procesar token:', e);
      }
    }
    
    // Si no es admin, redirigir al dashboard o mostrar una página de acceso denegado
    console.log('AdminGuard - Redirigiendo al dashboard (acceso denegado)');
    this.router.navigate(['/dashboard']);
    return false;
  }
}

// Exportar la función de guardia para usar con el nuevo sistema de Router de Angular
export const adminGuard = (
  route: ActivatedRouteSnapshot, 
  state: RouterStateSnapshot
) => {
  return inject(AdminGuard).canActivate(route, state);
}; 