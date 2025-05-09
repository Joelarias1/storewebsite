import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserManagementService, User } from '../../../../services/user-management.service';
import { AuthService } from '../../../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  error: string | null = null;
  successMessage: string | null = null;
  isSaving = false;
  
  // Propiedades para depuración
  authStatus = false;
  tokenAvailable = false;
  
  // Variable para almacenar los datos originales del usuario
  originalUserData: User | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserManagementService,
    private authService: AuthService
  ) {
    // Determinar si estamos en modo edición
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!idParam;
    
    if (idParam) {
      this.userId = parseInt(idParam, 10);
    }
    
    // Iniciamos el formulario con validaciones apropiadas según el modo
    this.initializeForm();
    
    // Verificar estado de autenticación
    this.authStatus = !!this.authService.getCurrentUser();
    this.tokenAvailable = !!this.authService.getToken();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.userId) {
      this.loadUserData();
    }
    
    // Actualizar información de depuración
    this.updateDebugInfo();
  }
  
  // Inicializar el formulario con las validaciones adecuadas según el modo
  private initializeForm(): void {
    // Validaciones básicas para todos los modos
    const usernameValidators = [Validators.required, Validators.minLength(3)];
    const emailValidators = [Validators.required, Validators.email];
    
    // La contraseña solo es obligatoria en modo creación
    const passwordValidators = !this.isEditMode 
      ? [Validators.required, Validators.minLength(6)] 
      : [];
      
    // El nombre completo es obligatorio solo en creación
    const fullNameValidators = !this.isEditMode
      ? [Validators.required]
      : [];
    
    this.userForm = this.fb.group({
      username: ['', usernameValidators],
      email: ['', emailValidators],
      password: ['', passwordValidators],
      fullName: ['', fullNameValidators],
      role: ['USER', Validators.required],
      status: ['ACTIVE', Validators.required],
      avatar: [''],
    });
  }

  loadUserData(): void {
    if (!this.userId) return;
    
    this.isLoading = true;
    this.error = null;
    
    console.log(`Intentando cargar datos del usuario con ID: ${this.userId}`);
    
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Datos del usuario recibidos:', user);
        
        // Guardamos los datos originales para comparar después
        this.originalUserData = { ...user, password: '' };
        
        // No mostrar la contraseña por razones de seguridad
        const userWithoutPassword = {...user, password: ''};
        
        // Normalizar los valores para el formulario
        if (user.role) {
          userWithoutPassword.role = user.role.toUpperCase();
        }
        if (user.status) {
          userWithoutPassword.status = user.status.toUpperCase();
        }
        
        // Si no hay avatar, asegurarnos de que sea un string vacío en lugar de undefined
        if (!userWithoutPassword.avatar) {
          userWithoutPassword.avatar = '';
        }
        
        console.log('Datos normalizados para el formulario:', userWithoutPassword);
        
        // Actualizar el formulario
        this.userForm.patchValue(userWithoutPassword);
        
        // Solo desactivar el campo de contraseña en modo edición si no se ha establecido
        if (this.isEditMode) {
          this.userForm.get('password')?.setValidators([]);
          this.userForm.get('password')?.updateValueAndValidity();
        }
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar el usuario:', err);
        this.error = err.message || 'No se pudo cargar la información del usuario. Por favor, intenta nuevamente.';
        this.isLoading = false;
        
        // Intentar cargar datos de respaldo (para casos de demo o pruebas)
        this.loadFallbackUserData();
      }
    });
  }
  
  // Cargar datos de respaldo para fines de demostración
  private loadFallbackUserData(): void {
    const fallbackData: User = {
      id: this.userId ?? undefined,
      username: 'usuario_temp',
      email: 'usuario@ejemplo.com',
      fullName: 'Usuario Temporal',
      role: 'USER',
      status: 'ACTIVE',
      avatar: '',
    };
    
    console.log('Cargando datos de respaldo para demostración:', fallbackData);
    this.userForm.patchValue(fallbackData);
    this.isLoading = false;
    this.error = 'No se pudo cargar el usuario desde el servidor. Se han cargado datos de demostración.';
  }

  onSubmit(): void {
    // Verificar si el formulario es válido
    if (this.userForm.invalid) {
      this.validateAllFormFields();
      return;
    }

    // Verificar autenticación antes de continuar
    this.updateDebugInfo();
    
    if (!this.tokenAvailable) {
      this.error = 'No hay un token de autenticación disponible. Por favor, inicia sesión nuevamente.';
      console.error('Intento de actualizar sin token de autenticación');
      return;
    }

    // En modo edición, verificar si realmente hay cambios
    if (this.isEditMode && this.originalUserData) {
      const currentValues = this.userForm.value;
      let hasChanges = false;
      
      // Comparamos solo los campos que el backend acepta
      const fieldsToCheck = ['username', 'email', 'role', 'status'];
      
      for (const field of fieldsToCheck) {
        if (currentValues[field] !== this.originalUserData[field as keyof User]) {
          hasChanges = true;
          break;
        }
      }
      
      // Si hay contraseña, siempre es un cambio
      if (currentValues.password && currentValues.password.trim() !== '') {
        hasChanges = true;
      }
      
      // Si no hay cambios, mostramos un mensaje y no hacemos la solicitud
      if (!hasChanges) {
        this.successMessage = 'No se han detectado cambios en los datos.';
        console.log('Formulario sin cambios, no se realiza la solicitud');
        return;
      }
    }

    this.isSaving = true;
    this.error = null;
    this.successMessage = null;
    
    // Crea una copia profunda de los datos del formulario
    const userData: User = JSON.parse(JSON.stringify(this.userForm.value));
    console.log('Formulario datos originales:', this.userForm.value);
    console.log('Datos a enviar (inicial):', userData);
    
    // Si estamos en modo edición y no se ingresó una nueva contraseña, la quitamos
    if (this.isEditMode && (!userData.password || userData.password.trim() === '')) {
      console.log('Eliminando campo password vacío en modo edición');
      delete userData.password;
    }
    
    // Si no se proporcionó un avatar, lo quitamos o establecemos como vacío
    if (!userData.avatar || userData.avatar.trim() === '') {
      console.log('Eliminando campo avatar vacío');
      userData.avatar = ''; // Usamos string vacío en lugar de null
    }
    
    // Normalizamos los valores de role y status a mayúsculas
    if (userData.role) {
      userData.role = userData.role.toUpperCase();
    }
    if (userData.status) {
      userData.status = userData.status.toUpperCase();
    }
    
    console.log('Datos finales a enviar:', userData);
    
    if (this.isEditMode && this.userId) {
      console.log(`Actualizando usuario con ID: ${this.userId}`);
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (response) => {
          console.log('Usuario actualizado exitosamente:', response);
          this.isSaving = false;
          this.successMessage = 'Usuario actualizado correctamente';
          
          // Redirigir después de mostrar el mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/dashboard/user-management']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al actualizar el usuario:', err);
          this.error = err.message || 'Ocurrió un error al actualizar el usuario. Por favor, intenta nuevamente.';
          this.isSaving = false;
        }
      });
    } else {
      console.log('Creando nuevo usuario');
      this.userService.createUser(userData).subscribe({
        next: (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.isSaving = false;
          this.successMessage = 'Usuario creado correctamente';
          
          // Redirigir después de mostrar el mensaje de éxito
          setTimeout(() => {
            this.router.navigate(['/dashboard/user-management']);
          }, 1500);
        },
        error: (err) => {
          console.error('Error al crear el usuario:', err);
          this.error = err.message || 'Ocurrió un error al crear el usuario. Por favor, intenta nuevamente.';
          this.isSaving = false;
        }
      });
    }
  }
  
  // Método para verificar si un campo es inválido y fue tocado
  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }
  
  // Método para obtener el mensaje de error de un campo
  getErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Este campo es requerido.';
    }
    
    if (field.hasError('email')) {
      return 'Por favor ingresa un email válido.';
    }
    
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Este campo debe tener al menos ${minLength} caracteres.`;
    }
    
    return 'Este campo es inválido.';
  }
  
  // Método para validar todos los campos al enviar el formulario
  validateAllFormFields(): void {
    Object.keys(this.userForm.controls).forEach(field => {
      const control = this.userForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  
  // Actualizar información de depuración
  updateDebugInfo(): void {
    this.authStatus = !!this.authService.getCurrentUser();
    this.tokenAvailable = !!this.authService.getToken();
    console.log('Estado de autenticación:', this.authStatus);
    console.log('Token disponible:', this.tokenAvailable);
    
    if (!this.tokenAvailable) {
      console.warn('No hay token disponible. Las operaciones de actualización pueden fallar.');
    }
  }
  
  // Verificar si estamos en modo de depuración
  isDebugMode(): boolean {
    return !environment.production;
  }
} 