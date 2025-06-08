import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { PartidaService } from '../../services/partida.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import { Partida } from '../../models/Partida';
import { AudienciaService, EstadoAudiencia } from '../../services/audiencia.service';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private partidaService = inject(PartidaService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private alertService = inject(AlertService);
  private audienciaService = inject(AudienciaService);

  puedeAudienciaConApolo = false;
  estadoAudiencia: EstadoAudiencia | null = null;

  usuario = this.authService.currentUserValue;
  editandoContrasena = false;
  mostrarContrasenaActual = false;
  mostrarContrasenaNueva = false;
  contrasenaActualVerificada = false;

  partidas: Partida[] = [];
  cargandoHistorial = false;
  partidaExpandida: number | null = null;

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

  ngOnInit() {
    this.cargarHistorialPartidas();
    if (this.usuario) {
      this.verificarAccesoAudiencia();
    } else {
      setTimeout(() => {
        if (this.authService.currentUserValue) {
          this.usuario = this.authService.currentUserValue;
          this.verificarAccesoAudiencia();
        }
      }, 100);
    }
  }

  verificarAccesoAudiencia() {
    if (!this.authService.currentUserValue) {
      this.puedeAudienciaConApolo = false;
      return;
    }

    this.audienciaService.obtenerEstado().subscribe({
      next: (estado) => {
        this.puedeAudienciaConApolo = estado.puede_conversar;
        this.estadoAudiencia = estado;
      },
      error: (error) => {
        console.error('Error al verificar acceso a audiencia:', error);
        this.puedeAudienciaConApolo = false;
      }
    });
  }

  abrirAudienciaApolo() {
    this.router.navigate(['/audiencia']);
  }

  cargarHistorialPartidas() {
    if (!this.usuario) return;

    this.cargandoHistorial = true;
    this.partidaService.getHistorialUsuario(this.usuario.id).subscribe({
      next: (partidas) => {
        this.partidas = partidas.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        this.cargandoHistorial = false;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.cargandoHistorial = false;
      }
    });
  }

  togglePartida(partidaId: number) {
    this.partidaExpandida = this.partidaExpandida === partidaId ? null : partidaId;
  }

  formatearFecha(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  obtenerIconoModo(modo: string): string {
    const iconos: { [key: string]: string } = {
      'aventura': 'fa-map',
      'prueba': 'fa-clipboard-check',
      'contrarreloj': 'fa-clock',
      'infinito': 'fa-infinity'
    };
    return iconos[modo] || 'fa-gamepad';
  }

  obtenerColorDificultad(dificultad: string): string {
    return dificultad === 'heroica' ? 'text-yellow-800' : 'text-purple-800';
  }

  obtenerTextoResultado(partida: any): string {
    if (partida.modo_juego === 'infinito') {
      return `${partida.puntuacion} puntos`;
    } else {
      return `${partida.respuestasCorrectas || 0}/10`;
    }
  }

  modoAdmitePistas(modoJuego: string): boolean {
    return modoJuego === 'aventura' || modoJuego === 'contrarreloj';
  }

  formatearTiempoEspera(minutos: number): string {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;

    if (horas > 0) {
      return `${horas}h ${minutosRestantes}m`;
    }
    return `${minutosRestantes}m`;
  }
}