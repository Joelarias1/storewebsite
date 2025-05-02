import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        this.passwordValidator()
      ]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  private ageValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;

      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return age >= 13 ? null : { underage: true };
    };
  }

  private passwordValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const requirements = {
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        number: hasNumber,
        specialChar: hasSpecialChar
      };

      if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { passwordRequirements: requirements };
      }

      return null;
    };
  }

  private passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password?.pristine || confirmPassword?.pristine) {
      return null;
    }

    return password && confirmPassword && password.value !== confirmPassword.value ? 
      { misMatch: true } : null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Formulario de registro inválido');
      this.showValidationErrors();
      return;
    }

    this.isLoading = true;

    const userData = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    };

    console.log('Enviando datos de registro:', userData);

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta del registro:', response);

        if (response && response.message) {
          this.showSuccessToast('¡Usuario registrado exitosamente!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          let errorMessage = 'Ocurrió un error durante el registro.';
          if (response && response.error && response.error.error) {
            errorMessage = response.error.error;
          } else if (response && response.error && typeof response.error === 'string'){
            errorMessage = response.error;
          }
          this.showErrorToast(errorMessage);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error inesperado en suscripción de registro:', err);
        this.showErrorToast('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
      }
    });
  }

  private showValidationErrors() {
    const controls = this.registerForm.controls;
    let errorMessages: string[] = [];
    
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.errors) {
        switch(key) {
          case 'username':
            errorMessages.push('Please enter a username');
            break;
          case 'email':
            if (control.errors['required']) {
              errorMessages.push('Please enter an email');
            } else if (control.errors['email']) {
              errorMessages.push('Please enter a valid email');
            }
            break;
          case 'password':
            if (control.errors['required']) {
              errorMessages.push('Please enter a password');
            } else if (control.errors['passwordRequirements']) {
              const reqs = control.errors['passwordRequirements'];
              if (!reqs.upperCase) errorMessages.push('Password must contain at least one uppercase letter');
              if (!reqs.lowerCase) errorMessages.push('Password must contain at least one lowercase letter');
              if (!reqs.number) errorMessages.push('Password must contain at least one number');
              if (!reqs.specialChar) errorMessages.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
            }
            break;
          case 'confirmPassword':
            if (control.errors['required']) {
              errorMessages.push('Please confirm your password');
            }
            break;
        }
      }
    });

    if (this.registerForm.errors?.['misMatch']) {
      errorMessages.push('Passwords do not match');
    }

    if (errorMessages.length > 0) {
      const fullMessage = errorMessages.join('\n');
      this.showErrorToast(fullMessage);
    }
  }

  private showSuccessToast(message: string) {
    const toastElement = document.getElementById('successToast');
    const messageElement = document.getElementById('successToastMessage');
    if (toastElement && messageElement) {
      messageElement.textContent = message;
      const toast = new bootstrap.Toast(toastElement, {
        delay: 3000
      });
      toast.show();
    }
  }
  
  private showErrorToast(message: string) {
    const toastElement = document.getElementById('errorToast');
    const messageElement = document.getElementById('errorToastMessage');
    if (toastElement && messageElement) {
      messageElement.innerHTML = message.replace(/\n/g, '<br>');
      
      const lineCount = message.split('\n').length;
      const baseDelay = 3000;
      const delayPerLine = 500;
      const totalDelay = baseDelay + (lineCount * delayPerLine);

      const toast = new bootstrap.Toast(toastElement, {
        delay: totalDelay,
        animation: true
      });
      toast.show();
    }
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}