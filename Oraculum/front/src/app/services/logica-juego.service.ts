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
    // Obtener historial de preguntas usadas en partidas anteriores
    const historialAnterior = this.estadoJuegoService.obtenerHistorialPreguntas(modoJuego, dificultad, idCategoria);
    
    // Combinar preguntas usadas en esta partida + historial anterior
    const todasLasPreguntasUsadas = [...new Set([...preguntasUsadas, ...historialAnterior])];
    
    // Caso especial: modo infinito con dificultad divina
    if (modoJuego === 'infinito' && dificultad === 'divina') {
      const preguntasHeroicas$ = this.preguntaService.getPreguntasfiltradas(idCategoria, 'heroica');
      const preguntasDivinas$ = this.preguntaService.getPreguntasfiltradas(idCategoria, 'divina');
      
      return forkJoin([preguntasHeroicas$, preguntasDivinas$]).pipe(
        map(([heroicas, divinas]) => {
          const todasLasPreguntas = [...heroicas, ...divinas];
          const preguntasDisponibles = todasLasPreguntas.filter(p => !todasLasPreguntasUsadas.includes(p.id));
          
          if (preguntasDisponibles.length === 0) {
            // Si no hay preguntas disponibles, reiniciar historial y usar todas
            this.estadoJuegoService.limpiarHistorialPreguntas(modoJuego, dificultad, idCategoria);
            return todasLasPreguntas[Math.floor(Math.random() * todasLasPreguntas.length)];
          }
          
          return preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
        })
      );
    }
    
    // Comportamiento normal para otros casos
    return this.preguntaService.getPreguntasfiltradas(idCategoria, dificultad).pipe(
      map(preguntas => {
        const preguntasDisponibles = preguntas.filter(p => !todasLasPreguntasUsadas.includes(p.id));
        
        if (preguntasDisponibles.length === 0) {
          // Si no hay preguntas disponibles, reiniciar historial
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

    // Bonus por velocidad en modos con tiempo
    if (configuracion.bonusVelocidad && configuracion.tiempoLimite) {
      const tiempoBonus = Math.max(0, (configuracion.tiempoLimite - tiempoRespuesta) / 1000);
      puntos += Math.floor(tiempoBonus * 0.5); // 0.5 puntos por segundo restante
    }

    return puntos;
  }

  debeTerminarJuego(modo: string, indicePregunta: number, esCorrecta: boolean): boolean {
    const configuracion = this.obtenerConfiguracion(modo);

    // Modo infinito termina al fallar
    if (configuracion.continuaHastaFallar && !esCorrecta) {
      return true;
    }

    // Otros modos terminan al alcanzar el límite de preguntas
    return configuracion.totalPreguntas > 0 && indicePregunta >= configuracion.totalPreguntas;
  }

  validarTiempoAgotado(tiempoInicio: number, tiempoLimite: number): boolean {
    return (Date.now() - tiempoInicio) >= tiempoLimite;
  }
}