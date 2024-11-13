import { Routes } from '@angular/router';

import { HomeComponent } from '../pages/home/home.component';
import { PartyComponent } from '../pages/party/party.component';
import { ClassicComponent } from '../pages/classic/classic.component';
import { FamilyComponent } from '../pages/family/family.component';
import { StrategyComponent } from '../pages/strategy/strategy.component';

// Auth
import { RegisterComponent } from '../pages/auth/register/register.component';
import { TestPageComponent } from '../pages/test-page/test-page.component';

// Rutas
export const routes: Routes = [
  { path: '', component: HomeComponent }, // localhost:4200/
  { path: 'party', component: PartyComponent }, // localhost:4200/party
  { path: 'strategy', component: StrategyComponent },
  { path: 'classic', component: ClassicComponent },
  { path: 'family', component: FamilyComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'test-page', component: TestPageComponent },
  { path: '**', redirectTo: '' }, // Ruta para 404, redirige al home
];
