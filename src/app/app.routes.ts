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
import { ForumsComponent } from '../pages/forums/forums.component';
import { ThreadViewComponent } from '../pages/thread-view/thread-view.component';

// Importaciones para gestión de usuarios
import { UserListComponent } from '../pages/dashboard/user-management/user-list/user-list.component';
import { UserFormComponent } from '../pages/dashboard/user-management/user-form/user-form.component';

// Guards
import { authGuard } from '../guards/auth.guard';
import { adminGuard } from '../guards/admin.guard';

// Importar componentes del foro
import { ForumHomeComponent } from '../pages/forum-home/forum-home.component';
import { ForumCategoryComponent } from '../pages/forum-category/forum-category.component';
import { NewThreadComponent } from '../pages/new-thread/new-thread.component';

// Rutas
export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent }, // localhost:4200/
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  
  // Rutas del foro
  { path: 'search', component: SearchComponent },
  { path: 'forums', component: ForumHomeComponent },
  { path: 'category/:categoryId', component: ForumCategoryComponent },
  { path: 'new-thread', component: NewThreadComponent, canActivate: [authGuard] },
  { path: 'new-thread/:categoryId', component: NewThreadComponent, canActivate: [authGuard] },
  { path: 'thread/:threadId', component: ThreadViewComponent },
  { path: 'edit-thread/:threadId', component: NewThreadComponent, canActivate: [authGuard] },
  { path: 'my-topics', component: ForumCategoryComponent, canActivate: [authGuard] },
  
  // Rutas del panel de administración (con layout de dashboard)
  { 
    path: 'dashboard', 
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'categorias', component: CategoriesComponent },
      { path: 'categorias/:id', loadComponent: () => import('../pages/dashboard/category-view/category-view.component').then(c => c.CategoryViewComponent) },
      // Rutas de perfil
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/edit', loadComponent: () => import('../pages/dashboard/profile-edit/profile-edit.component').then(c => c.ProfileEditComponent) },
      
      // Gestión de usuarios (admin)
      { path: 'user-management', component: UserListComponent, canActivate: [adminGuard] },
      { path: 'user-management/create', component: UserFormComponent, canActivate: [adminGuard] },
      { path: 'user-management/edit/:id', component: UserFormComponent, canActivate: [adminGuard] },
      
      // Página 404 para el dashboard (captura cualquier ruta inexistente)
      { path: '**', component: NotFoundComponent }
    ]
  },
  
  // Redirección para rutas no encontradas (fuera del dashboard)
  { path: '**', redirectTo: '' }
];
