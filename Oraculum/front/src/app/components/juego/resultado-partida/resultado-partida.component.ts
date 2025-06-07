import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EstadoJuego } from '../../../models/EstadoJuego';
import { ConfiguracionJuego } from '../../../models/ConfiguracionJuego';

@Component({
  selector: 'app-resultado-partida',
  imports: [CommonModule],
  templateUrl: './resultado-partida.component.html',
  styleUrl: './resultado-partida.component.css'
})
export class ResultadoPartidaComponent {
  @Input() estado!: EstadoJuego;
  @Input() configuracion!: ConfiguracionJuego | null;
  @Output() volverMenu = new EventEmitter<void>();

  constructor(private router: Router) {}

  get porcentajeAciertos(): number {
    const totalRespuestas = this.estado.respuestasCorrectas + this.estado.respuestasIncorrectas;
    if (totalRespuestas === 0) return 0;
    return Math.round((this.estado.respuestasCorrectas / totalRespuestas) * 100);
  }

  get tiempoTotal(): string {
    const tiempoMs = Date.now() - this.estado.tiempoInicio;
    const minutos = Math.floor(tiempoMs / 60000);
    const segundos = Math.floor((tiempoMs % 60000) / 1000);
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  }

  get mensajeResultado(): string {
    if (this.porcentajeAciertos >= 90) return '🏆 ¡Excelente!';
    if (this.porcentajeAciertos >= 70) return '🎉 ¡Muy bien!';
    if (this.porcentajeAciertos >= 50) return '👍 ¡Bien hecho!';
    return '💪 ¡Sigue practicando!';
  }

  get colorResultado(): string {
    if (this.porcentajeAciertos >= 90) return 'text-yellow-600';
    if (this.porcentajeAciertos >= 70) return 'text-green-600';
    if (this.porcentajeAciertos >= 50) return 'text-[var(--greek-blue)]';
    return 'text-gray-600';
  }

  get modoJuegoTexto(): string {
    const modos: { [key: string]: string } = {
      'aventura': 'Aventura',
      'prueba': 'Prueba',
      'contrarreloj': 'Contrarreloj',
      'infinito': 'Infinito'
    };
    return modos[this.estado.modoJuego] || this.estado.modoJuego;
  }

  jugarDeNuevo(): void {
    this.router.navigate(['/jugar']);
  }
  
  onVolverMenu(): void {
    this.volverMenu.emit();
  }
}