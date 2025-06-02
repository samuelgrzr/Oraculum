import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { PreguntaService } from './pregunta.service';
import { EstadoJuegoService } from './estado-juego.service';
import { Pregunta } from '../models/Pregunta';
import { CONFIGURACIONES_MODO, ConfiguracionJuego } from '../models/ConfiguracionJuego';

@Injectable({
  providedIn: 'root'
})
export class LogicaJuegoService {

  constructor(
    private preguntaService: PreguntaService,
    private estadoJuegoService: EstadoJuegoService
  ) { }

  obtenerConfiguracion(modo: string): ConfiguracionJuego {
    return CONFIGURACIONES_MODO[modo] || CONFIGURACIONES_MODO['aventura'];
  }

  obtenerSiguientePregunta(idCategoria: number, dificultad: string, preguntasUsadas: number[], modoJuego: string): Observable<Pregunta | null> {
    const historialAnterior = this.estadoJuegoService.obtenerHistorialPreguntas(modoJuego, dificultad, idCategoria);
    
    const todasLasPreguntasUsadas = [...new Set([...preguntasUsadas, ...historialAnterior])];
    
    if (modoJuego === 'infinito' && dificultad === 'divina') {
      const preguntasHeroicas$ = this.preguntaService.getPreguntasfiltradas(idCategoria, 'heroica');
      const preguntasDivinas$ = this.preguntaService.getPreguntasfiltradas(idCategoria, 'divina');
      
      return forkJoin([preguntasHeroicas$, preguntasDivinas$]).pipe(
        map(([heroicas, divinas]) => {
          const todasLasPreguntas = [...heroicas, ...divinas];
          const preguntasDisponibles = todasLasPreguntas.filter(p => !todasLasPreguntasUsadas.includes(p.id));
          
          if (preguntasDisponibles.length === 0) {
            this.estadoJuegoService.limpiarHistorialPreguntas(modoJuego, dificultad, idCategoria);
            return todasLasPreguntas[Math.floor(Math.random() * todasLasPreguntas.length)];
          }
          
          return preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
        })
      );
    }
    
    return this.preguntaService.getPreguntasfiltradas(idCategoria, dificultad).pipe(
      map(preguntas => {
        const preguntasDisponibles = preguntas.filter(p => !todasLasPreguntasUsadas.includes(p.id));
        
        if (preguntasDisponibles.length === 0) {
          this.estadoJuegoService.limpiarHistorialPreguntas(modoJuego, dificultad, idCategoria);
          return preguntas[Math.floor(Math.random() * preguntas.length)];
        }
        
        return preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
      })
    );
  }

  calcularPuntuacion(modo: string, esCorrecta: boolean, tiempoRespuesta: number,
    usoPista: boolean, dificultad: string): number {
    if (!esCorrecta) return 0;

    const configuracion = this.obtenerConfiguracion(modo);
    let puntos = dificultad === 'divina' ? 10 : 5;

    if (configuracion.bonusVelocidad && configuracion.tiempoLimite) {
      const segundosRestantes = Math.ceil((configuracion.tiempoLimite - tiempoRespuesta) / 1000);
      puntos += Math.max(0, segundosRestantes);
    }

    return puntos;
  }

  debeTerminarJuego(modo: string, indicePregunta: number, esCorrecta: boolean): boolean {
    const configuracion = this.obtenerConfiguracion(modo);

    if (configuracion.continuaHastaFallar && !esCorrecta) {
      return true;
    }

    return configuracion.totalPreguntas > 0 && indicePregunta >= configuracion.totalPreguntas;
  }

  validarTiempoAgotado(tiempoInicio: number, tiempoLimite: number): boolean {
    return (Date.now() - tiempoInicio) >= tiempoLimite;
  }
}