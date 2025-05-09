import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAdmin: boolean = false;
  currentUser: any = null;
  isLoading: boolean = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar si el usuario actual es administrador
    this.isAdmin = this.authService.isUserAdmin();
    
    // Obtener información del usuario actual
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      // Si no hay usuario autenticado, redirigir al login
      this.router.navigate(['/login']);
      return;
    }
    
    this.isLoading = false;
    console.log('Usuario en dashboard:', this.currentUser);
  }
  
  // Método para cerrar sesión
  logout(): void {
    this.authService.logout();
  }
} 