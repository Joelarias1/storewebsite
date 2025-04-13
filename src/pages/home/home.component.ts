import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  // Por ahora, el componente no necesita lógica específica.
  // Se puede añadir funcionalidad más adelante.
  constructor() { }
}