import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, AuthResponse } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loginError: string | null = null;
  isLoading: boolean = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }
  
  ngOnInit(): void {
    // Prellenar los campos con un usuario administrador por defecto (para pruebas)
    this.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'admin123'
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    console.log('onSubmit iniciado.');
    this.loginError = null;
    
    if (this.loginForm.invalid) {
      console.log('Formulario inválido. Marcando campos...');
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    console.log('Formulario válido. Preparando para llamar al servicio...');
    this.isLoading = true;

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };
    console.log('Credenciales:', credentials);

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse | null) => {
        console.log('Respuesta completa recibida del servicio:', JSON.stringify(response));
        this.isLoading = false;
        if (response && response.token) {
          console.log('Login exitoso, datos del usuario:', {
            token: response.token,
            userId: response.userId,
            role: response.role
          });
          
          // Verificar que el usuario se haya guardado correctamente
          const user = this.authService.getCurrentUser();
          console.log('Usuario recuperado después de login:', user);
          
          this.router.navigate(['/dashboard']);
        } else {
          console.log('Login fallido (sin token o respuesta null).');
          this.loginError = 'Usuario o contraseña incorrectos.';
        }
      },
      error: (err: any) => {
        console.error('Error en la suscripción de login:', err);
        this.isLoading = false;
        this.loginError = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.';
      }
    });
    console.log('Llamada a authService.login realizada.');
  }

  // Método de prueba para verificar si el clic se detecta
  testButtonClick(): void {
    console.log('¡Clic en el botón detectado!');
  }
} 