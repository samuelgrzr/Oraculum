import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../services/toast.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

interface RankingUsuario {
  nombre: string;
  puntuacion: number;
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  private router = inject(Router);
  private authService = inject(AuthService);
  private yaSeNotificoAudiencia = false;

  usuarios: RankingUsuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private toastService: ToastService,
    private storageService: StorageService) { }

  ngOnInit() {
    this.cargarRanking();
  }

  cargarRanking() {
    this.usuarioService.getRanking().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.slice(0, 12);
        this.verificarDesbloqueoAudiencia(this.usuarios);
      },
      error: (error) => {
        console.error('Error al cargar el ranking:', error);
        this.toastService.showMessage('Error al cargar el ranking');
      }
    });
  }

  verificarDesbloqueoAudiencia(ranking: any[]) {
    if (this.yaSeNotificoAudiencia) return;

    const usuario = this.authService.currentUserValue;
    if (!usuario) return;

    const posicionUsuario = ranking.findIndex(u => u.id === usuario.id) + 1;

    if (posicionUsuario <= 3 && posicionUsuario > 0) {
      const ultimaNotificacion = this.storageService.getItem('ultima_notificacion_audiencia');
      const ahora = new Date().getTime();

      if (!ultimaNotificacion || (ahora - parseInt(ultimaNotificacion)) > 5 * 60 * 60 * 1000) {
        setTimeout(() => {
          this.mostrarNotificacionAudienciaDesbloqueada(posicionUsuario);
        }, 2500);
      }
    }
  }

  mostrarNotificacionAudienciaDesbloqueada(posicion: number) {
    this.yaSeNotificoAudiencia = true;

    Swal.fire({
      title: '¡Felicitaciones, noble mortal!',
      html: `
        <div style="text-align: center;">
          <i class="fas fa-crown" style="font-size: 3rem; color: #d4af37; margin-bottom: 1rem;"></i>
          <p style="color: var(--greek-blue); font-size: 1.2rem; margin-bottom: 1rem;">¡Estás en la <strong>posición ${posicion}</strong> del ranking!</p>
          <div style="background: linear-gradient(135deg, #ffd700, #ffed4e); padding: 1.5rem; border-radius: 0.75rem; margin: 1.5rem 0; border: 2px solid #d4af37;">
            <i class="fas fa-sun" style="color: #b8860b; margin-right: 0.5rem; font-size: 1.5rem;"></i>
            <div style="color: #b8860b; font-size: 1.1rem; font-weight: bold; margin-top: 0.5rem;">
              ¡Has desbloqueado una audiencia con el dios Apolo!
            </div>
          </div>
          <p style="color: var(--greek-blue); font-size: 1rem; line-height: 1.4;">Como uno de los 3 mejores de la travesía, ahora puedes conversar directamente con el dios de los oráculos en su templo sagrado.</p>
          <p style="color: var(--greek-blue); font-size: 1rem; line-height: 1.4;">Puedes ir ahora o en otro momento desde tu perfil.</p>
        </div>
      `,
      confirmButtonText: '🏛️ Ir al Templo de Apolo',
      showCancelButton: true,
      cancelButtonText: '📊 Continuar en el Ranking',
      confirmButtonColor: '#d4af37',
      cancelButtonColor: '#4a5568',
      background: '#f8f9fa',
      customClass: {
        popup: 'audiencia-unlock-popup',
        title: 'greek-title',
        confirmButton: 'golden-button-swal',
        cancelButton: 'ranking-button-swal'
      },
      allowOutsideClick: false,
      allowEscapeKey: false
    }).then((result) => {
      this.storageService.setItem('ultima_notificacion_audiencia', new Date().getTime().toString());

      if (result.isConfirmed) {
        this.router.navigate(['/audiencia']);
      }
    });
  }
}