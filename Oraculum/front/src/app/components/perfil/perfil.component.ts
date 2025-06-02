import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);

  usuario = this.authService.currentUserValue;
  editandoContrasena = false;
  mostrarContrasenaActual = false;
  mostrarContrasenaNueva = false;
  contrasenaActualVerificada = false;

  verificarContrasenaForm: FormGroup = this.fb.group({
    contrasenaActual: ['', [Validators.required]]
  });

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
      this.verificarContrasenaForm.reset();
      this.contrasenaForm.reset();
      this.mostrarContrasenaActual = false;
      this.mostrarContrasenaNueva = false;
      this.contrasenaActualVerificada = false;
    }
  }

  toggleMostrarContrasenaActual() {
    this.mostrarContrasenaActual = !this.mostrarContrasenaActual;
  }

  toggleMostrarContrasenaNueva() {
    this.mostrarContrasenaNueva = !this.mostrarContrasenaNueva;
  }

  async verificarContrasenaActual() {
    if (this.verificarContrasenaForm.valid && this.usuario) {
      const contrasenaActual = this.verificarContrasenaForm.value.contrasenaActual;
      
      this.authService.login(this.usuario.nombre, contrasenaActual).subscribe({
        next: () => {
          this.contrasenaActualVerificada = true;
          this.alertService.success('Contraseña actual verificada correctamente');
        },
        error: () => {
          this.alertService.error('La contraseña actual no es correcta');
          this.contrasenaActualVerificada = false;
        }
      });
    }
  }

  async guardarContrasena() {
    if (this.contrasenaForm.valid && this.usuario && this.contrasenaActualVerificada) {
      const userData = {
        ...this.usuario,
        contrasena: this.contrasenaForm.value.contrasena
      };

      this.usuarioService.updateUsuario(this.usuario.id, userData).subscribe({
        next: () => {
          this.alertService.success('Contraseña actualizada correctamente. Serás redirigido para iniciar sesión nuevamente.');
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error al actualizar la contraseña:', error);
          this.alertService.error('Error al actualizar la contraseña');
        }
      });
    }
  }

  async eliminarCuenta() {
    if (!this.usuario) return;

    const result = await this.alertService.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (result.isConfirmed) {
      const confirmarCierreSesion = await this.alertService.confirm('Se cerrará tu sesión. ¿Deseas continuar?');
      if (!confirmarCierreSesion.isConfirmed) return;

      this.usuarioService.deleteUsuario(this.usuario.id).subscribe({
        next: () => {
          this.alertService.success('Tu cuenta ha sido eliminada correctamente');
          this.authService.logout();
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error.status === 401 || error.status === 400) {
            this.alertService.success('Tu cuenta ha sido eliminada correctamente');
            this.authService.logout();
            this.router.navigate(['/']);
          } else {
            console.error('Error al eliminar usuario:', error);
            this.alertService.error('Error al eliminar usuario');
          }
        }
      });
    }
  }
}