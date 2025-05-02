import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Verificar si el usuario actual es administrador
    this.isAdmin = this.authService.isUserAdmin();
  }

  // Datos simulados para el panel
  estadisticas = {
    totalUsuarios: 843,
    nuevosHoy: 24,
    temasActivos: 156,
    comentariosHoy: 38
  };
  
  // Actividades recientes simuladas
  actividadesRecientes = [
    { tipo: 'comentario', usuario: 'MariaG', tema: 'Problemas con Angular 17', tiempo: '5 minutos' },
    { tipo: 'tema', usuario: 'Carlos_Dev', tema: 'Migración a TypeScript 5', tiempo: '32 minutos' },
    { tipo: 'respuesta', usuario: 'Lucia23', tema: 'Dudas sobre RxJS', tiempo: '1 hora' },
    { tipo: 'tema', usuario: 'ProgramadorJS', tema: 'React vs Angular en 2024', tiempo: '3 horas' },
    { tipo: 'comentario', usuario: 'DevMaster', tema: 'Optimización de rendimiento', tiempo: '5 horas' }
  ];
  
  // Temas populares simulados
  temasPopulares = [
    { titulo: 'Tendencias de desarrollo web en 2024', vistas: 1289, comentarios: 64 },
    { titulo: 'Debugging avanzado en JavaScript', vistas: 978, comentarios: 42 },
    { titulo: 'Mejores prácticas para API REST', vistas: 856, comentarios: 37 },
    { titulo: 'TypeScript vs JavaScript: cuándo usar cada uno', vistas: 743, comentarios: 29 }
  ];
} 