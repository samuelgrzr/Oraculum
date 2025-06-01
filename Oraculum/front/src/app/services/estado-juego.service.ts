import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { EstadoJuego } from '../models/EstadoJuego';
import { Pregunta } from '../models/Pregunta';

@Injectable({
  providedIn: 'root'
})
export class EstadoJuegoService {
  private estadoInicial: EstadoJuego = {
    modoJuego: '',
    dificultad: '',
    idCategoria: 0,
    idUsuario: 0,
    preguntaActual: null,
    indicePregunta: 0,
    puntuacion: 0,
    preguntasUsadas: [],
    tiempoInicio: 0,
    juegoActivo: false,
    juegoTerminado: false,
    pausado: false,
    datosPartida: [],
    respuestasCorrectas: 0,
    respuestasIncorrectas: 0,
    pistasUsadas: 0
  };

  private estadoSubject = new BehaviorSubject<EstadoJuego>(this.estadoInicial);
  public estado$ = this.estadoSubject.asObservable();

  get estadoActual(): EstadoJuego {
    return this.estadoSubject.value;
  }

  inicializarJuego(configuracion: any): void {
    const nuevoEstado: EstadoJuego = {
      ...this.estadoInicial,
      modoJuego: configuracion.modo_juego,
      dificultad: configuracion.dificultad,
      idCategoria: configuracion.id_categoria,
      idUsuario: configuracion.id_usuario,
      tiempoInicio: Date.now(),
      juegoActivo: true
    };
    this.estadoSubject.next(nuevoEstado);
  }

  actualizarPreguntaActual(pregunta: Pregunta): void {
    const estado = this.estadoActual;
    this.estadoSubject.next({
      ...estado,
      preguntaActual: pregunta,
      preguntasUsadas: [...estado.preguntasUsadas, pregunta.id],
      tiempoUltimaPregunta: Date.now()
    });
  }

  registrarRespuesta(idRespuestaElegida: number, idRespuestaCorrecta: number, 
                    tiempoRespuesta: number, usoPista: boolean, puntuacionPregunta: number): void {
    const estado = this.estadoActual;
    const esCorrecta = idRespuestaElegida === idRespuestaCorrecta;
    
    const nuevoDatoPartida = {
      id_pregunta: estado.preguntaActual!.id,
      id_respuesta_elegida: idRespuestaElegida,
      id_respuesta_correcta: idRespuestaCorrecta,
      tiempo_respuesta: tiempoRespuesta,
      uso_pista: usoPista,
      puntuacion_pregunta: puntuacionPregunta
    };

    this.estadoSubject.next({
      ...estado,
      datosPartida: [...estado.datosPartida, nuevoDatoPartida],
      respuestasCorrectas: estado.respuestasCorrectas + (esCorrecta ? 1 : 0),
      respuestasIncorrectas: estado.respuestasIncorrectas + (esCorrecta ? 0 : 1),
      pistasUsadas: estado.pistasUsadas + (usoPista ? 1 : 0),
      indicePregunta: estado.indicePregunta + 1
    });
  }

  actualizarPuntuacion(puntos: number): void {
    const estado = this.estadoActual;
    this.estadoSubject.next({
      ...estado,
      puntuacion: estado.puntuacion + puntos
    });
  }

  terminarJuego(): void {
    const estado = this.estadoActual;
    this.estadoSubject.next({
      ...estado,
      juegoActivo: false,
      juegoTerminado: true
    });
  }

  pausarJuego(): void {
    const estado = this.estadoActual;
    this.estadoSubject.next({
      ...estado,
      pausado: !estado.pausado
    });
  }

  reiniciarEstado(): void {
    this.estadoSubject.next(this.estadoInicial);
  }
}