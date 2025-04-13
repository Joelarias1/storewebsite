import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

// Shared Components
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { FooterComponent } from '../shared/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'tabletop-treasures';
  isDashboardRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Detectar cambios en la ruta para saber si estamos en el dashboard
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Verificar si la URL comienza con /dashboard
      this.isDashboardRoute = event.url.startsWith('/dashboard');
      console.log('¿Ruta del dashboard?', this.isDashboardRoute);
    });
    
    // Verificar la ruta inicial
    const currentUrl = this.router.url;
    this.isDashboardRoute = currentUrl.startsWith('/dashboard');
  }
}
