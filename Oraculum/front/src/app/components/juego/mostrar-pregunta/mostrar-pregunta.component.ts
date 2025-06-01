import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pregunta } from '../../../models/Pregunta';
import { Respuesta } from '../../../models/Respuesta';
import { PreguntaService } from '../../../services/pregunta.service';

@Component({
  selector: 'app-mostrar-pregunta',
  imports: [CommonModule],
  templateUrl: './mostrar-pregunta.component.html',
  styleUrl: './mostrar-pregunta.component.css'
})
export class MostrarPreguntaComponent implements OnInit {
  @Input() pregunta!: Pregunta;
  @Input() permitePistas = false;
  @Input() indicePregunta = 0;
  @Input() totalPreguntas = 0;
  @Output() respuestaSeleccionada = new EventEmitter<any>();
  @Output() respuestaElegida = new EventEmitter<void>(); // Nuevo evento

  respuestas: Respuesta[] = [];
  respuestaSeleccionadaId: number | null = null;
  mostrandoPista = false;
  usoPista = false;
  tiempoInicio = Date.now();
  cargandoRespuestas = false;

  constructor(private preguntaService: PreguntaService) {}

  ngOnInit(): void {
    this.cargarRespuestas();
    this.tiempoInicio = Date.now();
  }

  private cargarRespuestas(): void {
    this.cargandoRespuestas = true;
    
    this.preguntaService.getRespuestasPregunta(this.pregunta.id).subscribe({
      next: (respuestas) => {
        this.respuestas = this.mezclarRespuestas(respuestas);
        this.cargandoRespuestas = false;
      },
      error: (error) => {
        console.error('Error al cargar respuestas:', error);
        this.cargandoRespuestas = false;
      }
    });
  }

  private mezclarRespuestas(respuestas: Respuesta[]): Respuesta[] {
    const respuestasMezcladas = [...respuestas];
    for (let i = respuestasMezcladas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [respuestasMezcladas[i], respuestasMezcladas[j]] = [respuestasMezcladas[j], respuestasMezcladas[i]];
    }
    return respuestasMezcladas;
  }

  seleccionarRespuesta(idRespuesta: number): void {
    if (this.respuestaSeleccionadaId !== null) return;
    
    this.respuestaSeleccionadaId = idRespuesta;
    const tiempoRespuesta = Date.now() - this.tiempoInicio;
    
    // Emitir inmediatamente que se eligió una respuesta
    this.respuestaElegida.emit();
    
    // Emitir la respuesta después de un breve delay para mostrar la selección
    setTimeout(() => {
      this.respuestaSeleccionada.emit({
        idRespuesta,
        tiempoRespuesta,
        usoPista: this.usoPista
      });
    }, 500);
  }

  mostrarPista(): void {
    if (!this.permitePistas || !this.pregunta.pista) return;
    
    this.mostrandoPista = true;
    this.usoPista = true;
  }
}
