import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../models/Usuario';
import { UsuarioService } from '../../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioEditandoId: number | null = null;
  usuarioForm: FormGroup;
  
  // Para poder editar dentro de la tabla
  get nombreControl(): FormControl {
    return this.usuarioForm.get('nombre') as FormControl;
  }
  get correoControl(): FormControl {
    return this.usuarioForm.get('correo') as FormControl;
  }
  get rolControl(): FormControl {
    return this.usuarioForm.get('rol') as FormControl;
  }
  get puntuacionControl(): FormControl {
    return this.usuarioForm.get('puntuacion') as FormControl;
  }

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.usuarioForm = this.fb.group({
      id: [null],
      nombre: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]*$/),
      ]],
      correo: ['', [Validators.required, Validators.email]],
      rol: ['user', Validators.required],
      puntuacion: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuarioService.getAllUsuarios().subscribe(
      usuarios => this.usuarios = usuarios
    );
  }

  async editarUsuario(usuario: Usuario): Promise<void> {
    const currentUser = this.authService.currentUserValue;
    
    if (currentUser && currentUser.id === usuario.id) {
      const confirmar = await this.confirmarCierreSesion();
      if (!confirmar) {
        return;
      }
    }
    
    this.usuarioEditandoId = usuario.id;
    const { contrasena, ...usuarioSinContrasena } = usuario;
    this.usuarioForm.patchValue(usuarioSinContrasena);
  }

  async guardarCambios(): Promise<void> {
    if (this.usuarioForm.valid && this.usuarioEditandoId) {
      const currentUser = this.authService.currentUserValue;
      const esUsuarioActual = currentUser && currentUser.id === this.usuarioEditandoId;

      this.usuarioService.updateUsuario(this.usuarioEditandoId, this.usuarioForm.value)
        .subscribe({
          next: () => {
            if (esUsuarioActual) {
              this.toastService.showMessage('Tu cuenta ha sido actualizada. Cerrando sesión...');
              this.authService.logout();
              this.router.navigate(['/']);
            } else {
              this.toastService.showMessage('Usuario actualizado correctamente');
              this.cargarUsuarios();
              this.cancelarEdicion();
            }
          },
          error: (error) => {
            this.toastService.showMessage('Error al actualizar el usuario');
            console.error('Error:', error);
          }
        });
    }
  }

  private confirmarCierreSesion(): Promise<boolean> {
    return this.alertService.confirm(
      'Estás editando tu propio usuario. Si guardas los cambios, se cerrará tu sesión. ¿Deseas continuar?'
    ).then(result => result.isConfirmed);
  }

  async eliminarUsuario(id: number): Promise<void> {
    const currentUser = this.authService.currentUserValue;
    const esUsuarioActual = currentUser && currentUser.id === id;

    const result = await this.alertService.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (result.isConfirmed) {
      if (esUsuarioActual) {
        const confirmarCierreSesion = await this.alertService.confirm('Estás eliminando tu propia cuenta. Se cerrará tu sesión. ¿Deseas continuar?');
        if (!confirmarCierreSesion.isConfirmed) {
          return;
        }

        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.alertService.success('Tu cuenta ha sido eliminada. Cerrando sesión...');
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (error) => {
            if (error.status === 401) {
              this.authService.logout();
              this.router.navigate(['/']);
            } else {
              this.alertService.error('Error al eliminar el usuario');
              console.error('Error:', error);
            }
          }
        });
      } else {
        this.usuarioService.deleteUsuario(id).subscribe({
          next: () => {
            this.alertService.success('Usuario eliminado correctamente');
            this.cargarUsuarios();
          },
          error: (error) => {
            this.alertService.error('Error al eliminar el usuario');
            console.error('Error:', error);
          }
        });
      }
    }
  }

  cancelarEdicion(): void {
    this.usuarioEditandoId = null;
    this.usuarioForm.reset({ rol: 'user', puntuacion: 0 });
  }

  isEditing(id: number): boolean {
    return this.usuarioEditandoId === id;
  }
}
