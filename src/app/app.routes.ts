import { Routes } from '@angular/router';

import { HomeComponent } from '../pages/home/home.component';

// Auth
import { RegisterComponent } from '../pages/auth/register/register.component';
import { LoginComponent } from '../pages/auth/login/login.component';
import { ForgotPasswordComponent } from '../pages/auth/forgot-password/forgot-password.component';

// Dashboard
import { DashboardLayoutComponent } from '../layouts/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
import { CategoriesComponent } from '../pages/dashboard/categories/categories.component';
import { NotFoundComponent } from '../pages/dashboard/not-found/not-found.component';
import { ProfileComponent } from '../pages/dashboard/profile/profile.component';

// Nuevos componentes
import { SearchComponent } from '../pages/search/search.component';
import { NewThreadComponent } from '../pages/new-thread/new-thread.component';
import { ForumsComponent } from '../pages/forums/forums.component';

// Rutas
export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent }, // localhost:4200/
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  
  // Rutas del foro
  { path: 'search', component: SearchComponent },
  { path: 'forums', component: ForumsComponent },
  { path: 'category/:categoryId', loadComponent: () => import('../pages/dashboard/category-view/category-view.component').then(c => c.CategoryViewComponent) },
  { path: 'category/:categoryId/new-thread', component: NewThreadComponent },
  { path: 'new-thread', component: NewThreadComponent },
  
  // Rutas del panel de administración (con layout de dashboard)
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriesComponent },
      { path: 'categorias/:id', loadComponent: () => import('../pages/dashboard/category-view/category-view.component').then(c => c.CategoryViewComponent) },
      // Rutas de perfil
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', loadComponent: () => import('../pages/dashboard/profile-edit/profile-edit.component').then(c => c.ProfileEditComponent) },
      // Página 404 para el dashboard (captura cualquier ruta inexistente)
      { path: '**', component: NotFoundComponent }
    ]
  },
  
  // Redirección para rutas no encontradas (fuera del dashboard)
  { path: '**', redirectTo: '' }
];
