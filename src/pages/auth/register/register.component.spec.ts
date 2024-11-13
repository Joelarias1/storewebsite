import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: Router, useValue: { navigate: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Prueba 1: Verificar que el componente se crea
  it('deberia crearse', () => {
    expect(component).toBeTruthy();
  });

  // Prueba 2: Verificar que el formulario se inicializa con todos los campos
  it('debería crear el formulario con todos los campos', () => {
    expect(component.registerForm.contains('fullName')).toBeTruthy();
    expect(component.registerForm.contains('email')).toBeTruthy();
    expect(component.registerForm.contains('password')).toBeTruthy();
    expect(component.registerForm.contains('confirmPassword')).toBeTruthy();
  });

  // Prueba 3: Verificar que la contraseña cumple con los requisitos
  it('debería validar los requisitos de la contraseña', () => {
    const passwordControl = component.registerForm.get('password');
    
    // Contraseña que no cumple los requisitos
    passwordControl?.setValue('abc123');
    expect(passwordControl?.errors?.['passwordRequirements']).toBeTruthy();
    
    // Contraseña que cumple todos los requisitos
    passwordControl?.setValue('Test123#');
    expect(passwordControl?.errors).toBeNull();
  });
});
