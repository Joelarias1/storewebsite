import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', [Validators.required, this.ageValidator()]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(18),
        this.passwordValidator()
      ]],
      confirmPassword: ['', Validators.required],
      address: ['']
    }, {
      validators: this.passwordMatchValidator
    });
  }

  // Validador de edad mínima
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
    if (this.registerForm.valid) {
      console.log('Form submitted:', this.registerForm.value);
      this.showSuccessToast('Account created successfully!');
      
      // Esperamos 3 segundos para que se muestre el toast antes de navegar
      setTimeout(() => {
        console.log('Navigating to test page with data:', {
          fullName: this.registerForm.get('fullName')?.value,
          username: this.registerForm.get('username')?.value,
          email: this.registerForm.get('email')?.value
        });

        this.router.navigate(['/test-page'], {
          state: {
            fullName: this.registerForm.get('fullName')?.value,
            username: this.registerForm.get('username')?.value,
            email: this.registerForm.get('email')?.value
          }
        });
      }, 3000); // 3 segundos para coincidir con el delay del toast
    } else {
      this.showValidationErrors();
    }
  }

  private showValidationErrors() {
    const controls = this.registerForm.controls;
    let errorMessages: string[] = [];
    
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control.errors) {
        switch(key) {
          case 'fullName':
            errorMessages.push('Please enter your full name');
            break;
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
          case 'birthdate':
            if (control.errors['required']) {
              errorMessages.push('Please enter your birth date');
            } else if (control.errors['underage']) {
              errorMessages.push('You must be at least 13 years old to register');
            }
            break;
          case 'password':
            if (control.errors['required']) {
              errorMessages.push('Please enter a password');
            } else if (control.errors['minlength'] || control.errors['maxlength']) {
              errorMessages.push('Password must be between 6 and 18 characters');
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
        delay: 3000 // 3 segundos
      });
      toast.show();
    }
  }
  
  private showErrorToast(message: string) {
    const toastElement = document.getElementById('errorToast');
    const messageElement = document.getElementById('errorToastMessage');
    if (toastElement && messageElement) {
      messageElement.innerHTML = message.replace(/\n/g, '<br>');
      
      // Calculamos el delay basado en la cantidad de errores
      const lineCount = message.split('\n').length;
      const baseDelay = 3000; // 3 segundos base
      const delayPerLine = 500; // 0.5 segundos adicionales por línea
      const totalDelay = baseDelay + (lineCount * delayPerLine);

      const toast = new bootstrap.Toast(toastElement, {
        delay: totalDelay, // Tiempo dinámico basado en la cantidad de errores
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