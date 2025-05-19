import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  mostrarContrasena = false;

  registroForm: FormGroup = this.fb.group({
    nombre: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15),
      Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/),
    ]],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[*!$&#])(?!.*\s).{6,12}$/)
    ]],
  });

  errorMessage: string = '';

  onRegistro() {
    if (this.registroForm.valid) {
      const userData = this.registroForm.value;
      this.authService.registro(userData)
        .subscribe({
          next: (response) => {
            this.authService.login(userData.correo, userData.contrasena)
              .subscribe({
                next: () => {
                  this.toastService.showMessage('¡Bienvenido a Oraculum!');
                  this.registroForm.reset();
                  this.errorMessage = '';
                  this.router.navigate(['/']);
                },
                error: () => {
                  this.toastService.showMessage('Registro exitoso. Por favor, inicia sesión.');
                  this.router.navigate(['/']);
                }
              });
          },
          error: (error) => {
            let mensajeError = 'Error al intentar registrarse';
            
            if (error?.error?.message) {
              mensajeError = error.error.message;
            } else if (error?.message) {
              mensajeError = error.message;
            } else if (typeof error === 'string') {
              mensajeError = error;
            }

            this.toastService.showMessage('Error en el registro: ' + mensajeError);
            this.errorMessage = mensajeError;
          }
        });
    }
  }

  // Para validar de forma más cómoda en el HTML
  get nombreControl() { return this.registroForm.get('nombre'); }
  get correoControl() { return this.registroForm.get('correo'); }
  get contrasenaControl() { return this.registroForm.get('contrasena'); }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }
}
