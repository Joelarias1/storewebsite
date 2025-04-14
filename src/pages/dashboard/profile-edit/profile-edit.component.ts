import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService, User } from '../../../services/user.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editMode: 'profile' | 'password' | 'avatar' = 'profile';
  
  successMessage = '';
  errorMessage = '';
  
  // Datos del usuario
  user: User | null = null;
  
  // Para edición de avatar
  previewAvatar: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.initForms();
  }

  initForms(): void {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9_-]+$')]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]],
      location: [''],
      website: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      social: this.fb.group({
        twitter: [''],
        github: [''],
        linkedin: ['']
      })
    });
    
    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup): {[key: string]: any} | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  loadUserProfile(): void {
    this.userService.getCurrentUser().subscribe({
      next: (userData) => {
        this.user = userData;
        this.setFormValues();
      },
      error: (error) => {
        this.errorMessage = 'No se pudo cargar la información del perfil';
        console.error('Error cargando perfil:', error);
      }
    });
  }

  setFormValues(): void {
    if (!this.user) return;
    
    this.profileForm.patchValue({
      fullName: this.user.fullName,
      username: this.user.username,
      email: this.user.email,
      bio: this.user.bio,
      location: this.user.location,
      website: this.user.website,
      social: {
        twitter: this.user.social.twitter,
        github: this.user.social.github,
        linkedin: this.user.social.linkedin
      }
    });
    
    this.previewAvatar = this.user.avatar;
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    
    if (!this.user) return;
    
    const updatedUser: User = {
      ...this.user,
      ...this.profileForm.value
    };
    
    this.userService.updateProfile(updatedUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Perfil actualizado correctamente';
        setTimeout(() => {
          this.router.navigate(['/dashboard/profile']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el perfil';
        console.error('Error actualizando perfil:', error);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    
    const passwordData = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
      confirmPassword: this.passwordForm.value.confirmPassword
    };
    
    this.userService.changePassword(passwordData).subscribe({
      next: (success) => {
        if (success) {
          this.successMessage = 'Contraseña actualizada correctamente';
          setTimeout(() => {
            this.router.navigate(['/dashboard/profile']);
          }, 2000);
        } else {
          this.errorMessage = 'Error al actualizar la contraseña';
        }
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar la contraseña';
        console.error('Error cambiando contraseña:', error);
      }
    });
  }

  updateAvatar(): void {
    if (!this.user || !this.previewAvatar) return;
    
    const updatedUser: User = {
      ...this.user,
      avatar: this.previewAvatar
    };
    
    this.userService.updateProfile(updatedUser).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = 'Avatar actualizado correctamente';
        setTimeout(() => {
          this.router.navigate(['/dashboard/profile']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'Error al actualizar el avatar';
        console.error('Error actualizando avatar:', error);
      }
    });
  }

  onAvatarUrlChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.previewAvatar = input.value;
    }
  }

  setEditMode(mode: 'profile' | 'password' | 'avatar'): void {
    this.editMode = mode;
    this.clearMessages();
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.router.navigate(['/dashboard/profile']);
  }
}
