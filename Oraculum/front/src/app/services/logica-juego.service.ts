import { Injectable } from '@angular/core';
import { Observable, map, forkJoin } from 'rxjs';
import { PreguntaService } from './pregunta.service';
import { Pregunta } from '../models/Pregunta';
import { CONFIGURACIONES_MODO, ConfiguracionJuego } from '../models/ConfiguracionJuego';

@Injectable({
  providedIn: 'root'
})
export class LogicaJuegoService {

  constructor(private preguntaService: PreguntaService) { }

  obtenerConfiguracion(modo: string): ConfiguracionJuego {
    return CONFIGURACIONES_MODO[modo] || CONFIGURACIONES_MODO['aventura'];
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

  obtenerSiguientePregunta(categoria: number, dificultad: string,
    preguntasUsadas: number[], modoJuego?: string): Observable<Pregunta | null> {
    
    // Caso especial: modo infinito con dificultad divina
    if (modoJuego === 'infinito' && dificultad === 'divina') {
      // Obtener preguntas de ambas dificultades
      const preguntasHeroicas$ = this.preguntaService.getPreguntasfiltradas(categoria, 'heroica');
      const preguntasDivinas$ = this.preguntaService.getPreguntasfiltradas(categoria, 'divina');
      
      return forkJoin([preguntasHeroicas$, preguntasDivinas$]).pipe(
        map(([heroicas, divinas]) => {
          // Combinar ambas listas
          const todasLasPreguntas = [...heroicas, ...divinas];
          // Filtrar preguntas ya usadas
          const preguntasDisponibles = todasLasPreguntas.filter(p => !preguntasUsadas.includes(p.id));
          
          if (preguntasDisponibles.length === 0) return null;
          
          const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
          return preguntasDisponibles[indiceAleatorio];
        })
      );
    }
    
    // Comportamiento normal para todos los demás casos
    return this.preguntaService.getPreguntasfiltradas(categoria, dificultad)
      .pipe(
        map(preguntas => {
          const preguntasDisponibles = preguntas.filter(p => !preguntasUsadas.includes(p.id));
          if (preguntasDisponibles.length === 0) return null;
  
          const indiceAleatorio = Math.floor(Math.random() * preguntasDisponibles.length);
          return preguntasDisponibles[indiceAleatorio];
        })
      );
  }

  validarTiempoAgotado(tiempoInicio: number, tiempoLimite: number): boolean {
    return (Date.now() - tiempoInicio) >= tiempoLimite;
  }
}