import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  @Output() loginSuccess = new EventEmitter<void>();
  @Output() closeDropdowns = new EventEmitter<void>();

  mostrarContrasena = false;

  loginForm: FormGroup = this.fb.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/),
    ]],
    contrasena: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[*!$&#])(?!.*\s).{6,12}$/)
    ]]
});

  errorMessage: string = '';

  onLogin() {
    if (this.loginForm.valid) {
      const { nombre, contrasena } = this.loginForm.value;
      this.authService.login(nombre, contrasena)
        .subscribe({
          next: (response) => {
            this.loginSuccess.emit();
            this.closeDropdowns.emit();
            this.loginForm.reset();
            this.errorMessage = '';
            this.router.navigate(['/']);
          },
          error: (error) => {
            this.toastService.showMessage(error.status === 401
              ? 'El usuario no existe'
              : 'Error al iniciar sesión');

            console.error('Error en el inicio de sesión:', error);
            if (error.status === 401) {
              this.errorMessage = 'El usuario no existe o la contraseña es incorrecta';
            } else {
              this.errorMessage = 'Ha ocurrido un error al intentar iniciar sesión';
            }
            this.loginForm.reset();
          }
        });
    }
  }

  get nombreControl() {
    return this.loginForm.get('nombre');
  }
  get contrasenaControl() {
    return this.loginForm.get('contrasena');
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}