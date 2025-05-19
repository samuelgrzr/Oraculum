import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  @Output() loginSuccess = new EventEmitter<void>();

  loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]]
  });

  errorMessage: string = '';

  onLogin() {
    if (this.loginForm.valid) {
      const { correo, contrasena } = this.loginForm.value;
      this.authService.login(correo, contrasena)
        .subscribe({
          next: (response) => {
            this.toastService.showMessage('¡Bienvenido!');
            
            console.log('Inicio de sesión exitoso', response);
            this.loginSuccess.emit();
            this.loginForm.reset();
            this.errorMessage = '';
          },
          error: (error) => {
            this.toastService.showMessage(error.status === 401 
              ? 'Credenciales incorrectas' 
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

  // Para validar de forma más cómoda en el HTML
  get correoControl() {
    return this.loginForm.get('correo');
  }
  get contrasenaControl() {
    return this.loginForm.get('contrasena');
  }
}