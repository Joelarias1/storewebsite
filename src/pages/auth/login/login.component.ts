import { Component } from '@angular/core';
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
export class LoginComponent {
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
      password: ['', [Validators.required]]
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  onSubmit(): void {
    this.loginError = null;
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse | null) => {
        this.isLoading = false;
        if (response && response.token) {
          console.log('Login exitoso, redirigiendo...');
          this.router.navigate(['/dashboard']);
        } else {
          this.loginError = 'Usuario o contraseña incorrectos.';
        }
      },
      error: (err: any) => { 
        this.isLoading = false;
        this.loginError = 'Ocurrió un error al intentar iniciar sesión. Inténtalo de nuevo.';
        console.error('Error HTTP en LoginComponent:', err); 
      }
    });
  }
} 