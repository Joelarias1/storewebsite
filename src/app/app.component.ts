import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Shared Components
import { NavbarComponent } from "../shared/navbar/navbar.component";
import { FooterComponent } from '../shared/footer/footer.component';

// Pages
import { HomeComponent } from '../pages/home/home.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'tabletop-treasures';
}
