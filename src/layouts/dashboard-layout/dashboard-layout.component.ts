import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HealthCheckService, DbConnectionStatus } from '../../services/health-check.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  isMenuOpen: boolean = true;
  
  // Propiedad para almacenar el estado de la BD
  dbStatus: DbConnectionStatus = 'CHECKING'; 
  dbStatusText: string = 'Verificando...';

  // Inyectar el servicio
  constructor(private healthCheckService: HealthCheckService) { }

  ngOnInit(): void {
    // Llamar al servicio al iniciar el componente
    this.performDbCheck(); // Descomentado ahora que el endpoint debería existir
    
    // Opcional: verificar periódicamente (ej. cada 30 segundos)
    // setInterval(() => this.performDbCheck(), 30000);
  }

  performDbCheck(): void {
    this.dbStatus = 'CHECKING'; // Marcar como verificando
    this.updateStatusText();
    this.healthCheckService.checkDbStatus().subscribe(status => {
      this.dbStatus = status;
      this.updateStatusText();
    });
  }

  updateStatusText(): void {
    switch (this.dbStatus) {
      case 'UP':
        this.dbStatusText = 'Conectada';
        break;
      case 'DOWN':
        this.dbStatusText = 'Desconectada';
        break;
      case 'ERROR':
        this.dbStatusText = 'Error';
        break;
      case 'CHECKING':
        this.dbStatusText = 'Verificando...';
        break;
    }
  }

  getDbStatusColorClass(): string {
    switch (this.dbStatus) {
      case 'UP': return 'bg-green-500';
      case 'DOWN': return 'bg-red-500';
      case 'ERROR': return 'bg-red-700';
      case 'CHECKING': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout(): void {
    // En una implementación real, aquí iría la lógica de cierre de sesión
    console.log('Cerrando sesión...');
    // Redirigir al login
    window.location.href = '/login';
  }
} 