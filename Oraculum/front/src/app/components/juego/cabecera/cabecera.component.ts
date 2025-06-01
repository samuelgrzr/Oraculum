import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadoJuego } from '../../../models/EstadoJuego';
import { ConfiguracionJuego } from '../../../models/ConfiguracionJuego';

@Component({
  selector: 'app-cabecera',
  imports: [CommonModule],
  templateUrl: './cabecera.component.html',
  styleUrl: './cabecera.component.css'
})
export class CabeceraComponent {
  @Input() estado!: EstadoJuego;
  @Input() configuracion!: ConfiguracionJuego;
  @Output() abandonar = new EventEmitter<void>();

  get progresoPreguntas(): number {
    if (this.configuracion.totalPreguntas <= 0) return 0;
    return (this.estado.indicePregunta / this.configuracion.totalPreguntas) * 100;
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

  get dificultadTexto(): string {
    const dificultades: { [key: string]: string } = {
      'heroica': 'Heroica',
      'divina': 'Divina'
    };
    return dificultades[this.estado.dificultad] || this.estado.dificultad;
  }

  onAbandonar(): void {
    this.abandonar.emit();
  }
}
