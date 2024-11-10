import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserRegister {
  fullName: string;
  username: string;
  email: string;
  birthdate: string;
  password: string;
  confirmPassword: string;
  address?: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  userData: UserRegister = {
    fullName: '',
    username: '',
    email: '',
    birthdate: '',
    password: '',
    confirmPassword: '',
    address: ''
  };

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  onSubmit() {
    console.log('Form submitted:', this.userData);
    // Aquí iría la lógica de envío
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}