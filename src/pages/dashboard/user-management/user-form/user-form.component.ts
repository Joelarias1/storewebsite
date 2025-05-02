import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserManagementService, User } from '../../../../services/user-management.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  error: string | null = null;
  isSaving = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserManagementService
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]],
      role: ['USER', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    // Determinar si estamos en modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.userId = parseInt(idParam, 10);
      this.loadUserData();
      
      // Modificar las validaciones de la contraseña en modo edición
      this.userForm.get('password')?.setValidators([]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  loadUserData(): void {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        // No mostrar la contraseña por razones de seguridad
        const userWithoutPassword = {...user, password: ''};
        this.userForm.patchValue(userWithoutPassword);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
        this.error = 'No se pudo cargar la información del usuario. Por favor, intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const userData = this.userForm.value;
    
    // Si estamos en modo edición y no se ingresó una nueva contraseña, la quitamos
    if (this.isEditMode && !userData.password) {
      delete userData.password;
    }
    
    const request$ = this.isEditMode && this.userId 
      ? this.userService.updateUser(this.userId, userData)
      : this.userService.createUser(userData);
      
    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/dashboard/user-management']);
      },
      error: (err) => {
        console.error('Error al guardar el usuario:', err);
        this.error = 'Ocurrió un error al guardar los cambios. Por favor, intenta nuevamente.';
        this.isSaving = false;
      }
    });
  }
} 