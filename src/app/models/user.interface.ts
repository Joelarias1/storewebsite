// models/user.interface.ts
export interface UserRegister {
    fullName: string;
    username: string;
    email: string;
    birthdate: string;
    password: string;
    confirmPassword: string;
    address?: string;  // opcional
  }