import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  usuario = this.authService.currentUserValue;
  editandoContrasena = false;
  mostrarContrasena = false;

  contrasenaForm: FormGroup = this.fb.group({
    contrasena: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(12),
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[*!$&#])(?!.*\s).{6,12}$/)
    ]]
  });

  toggleEditarContrasena() {
    this.editandoContrasena = !this.editandoContrasena;
    if (!this.editandoContrasena) {
      this.contrasenaForm.reset();
      this.mostrarContrasena = false;
    }
  }

  toggleMostrarContrasena() {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  async guardarContrasena() {
    if (this.contrasenaForm.valid && this.usuario) {
      const userData = {
        ...this.usuario,
        contrasena: this.contrasenaForm.value.contrasena
      };

      this.usuarioService.updateUsuario(this.usuario.id, userData).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error al actualizar la contraseña:', error);
        }
      });
    }
  }

  async eliminarCuenta() {
    if (!this.usuario) return;

    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      const confirmarCierreSesion = confirm('Se cerrará tu sesión. ¿Deseas continuar?');
      if (!confirmarCierreSesion) return;

      this.usuarioService.deleteUsuario(this.usuario.id).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/']);
          } else {
            console.error('Error al eliminar usuario:', error);
          }
        }
      });
    }
  }
}