import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pregunta } from '../../../models/Pregunta';
import { DatosPartida } from '../../../models/DatosPartida';

@Component({
  selector: 'app-retroalimentacion',
  imports: [CommonModule],
  templateUrl: './retroalimentacion.component.html',
  styleUrl: './retroalimentacion.component.css'
})
export class RetroalimentacionComponent {
  @Input() pregunta!: Pregunta;
  @Input() respuestaUsuario!: Omit<DatosPartida, 'id' | 'id_partida'>;
  @Output() continuar = new EventEmitter<void>();

  get esCorrecta(): boolean {
    return this.respuestaUsuario.id_respuesta_elegida === this.respuestaUsuario.id_respuesta_correcta;
  }

  get tiempoEnSegundos(): number {
    return Math.round(this.respuestaUsuario.tiempo_respuesta / 1000);
  }

  get mensajeResultado(): string {
    if (this.respuestaUsuario.id_respuesta_elegida === -1) {
      return '⏰ ¡Tiempo agotado!';
    }
    return this.esCorrecta ? '🎉 ¡Correcto!' : '❌ Incorrecto';
  }

  get colorResultado(): string {
    if (this.respuestaUsuario.id_respuesta_elegida === -1) {
      return 'text-orange-600';
    }
    return this.esCorrecta ? 'text-green-600' : 'text-red-600';
  }

  get colorFondo(): string {
    if (this.respuestaUsuario.id_respuesta_elegida === -1) {
      return 'bg-orange-50 border-orange-200';
    }
    return this.esCorrecta ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  }

  onContinuar(): void {
    this.continuar.emit();
  }
}
