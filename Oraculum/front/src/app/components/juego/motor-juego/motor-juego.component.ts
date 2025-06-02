import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { EstadoJuegoService } from '../../../services/estado-juego.service';
import { LogicaJuegoService } from '../../../services/logica-juego.service';
import { PartidaService } from '../../../services/partida.service';
import { PreguntaService } from '../../../services/pregunta.service';
import { ToastService } from '../../../services/toast.service';
import { EstadoJuego } from '../../../models/EstadoJuego';
import { ConfiguracionJuego } from '../../../models/ConfiguracionJuego';

import { CabeceraComponent } from '../cabecera/cabecera.component';
import { MostrarPreguntaComponent } from '../mostrar-pregunta/mostrar-pregunta.component';
import { RetroalimentacionComponent } from '../retroalimentacion/retroalimentacion.component';
import { ResultadoPartidaComponent } from '../resultado-partida/resultado-partida.component';
import { DatosPartida } from '../../../models/DatosPartida';
import { AlertService } from '../../../services/alert.service';
import { TemporizadorComponent } from '../temporizador/temporizador.component';

@Component({
  selector: 'app-motor-juego',
  imports: [
    CommonModule,
    CabeceraComponent,
    MostrarPreguntaComponent,
    RetroalimentacionComponent,
    ResultadoPartidaComponent,
    TemporizadorComponent
  ],
  templateUrl: './motor-juego.component.html',
  styleUrl: './motor-juego.component.css'
})
export class MotorJuegoComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(TemporizadorComponent) temporizador!: TemporizadorComponent;
  
  estado: EstadoJuego | null = null;
  configuracion: ConfiguracionJuego | null = null;
  mostrandoRetroalimentacion = false;
  cargandoPregunta = false;
  
  private suscripciones: Subscription[] = [];

  constructor(
    private estadoJuegoService: EstadoJuegoService,
    private logicaJuegoService: LogicaJuegoService,
    private partidaService: PartidaService,
    private preguntaService: PreguntaService,
    private toastService: ToastService,
    private alertService: AlertService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.inicializarJuego();
    this.suscribirseAEstado();
  }

  ngOnDestroy(): void {
    this.suscripciones.forEach(sub => sub.unsubscribe());
  }

  ngAfterViewInit(): void { }

  private inicializarJuego(): void {
    const configuracionGuardada = typeof localStorage !== 'undefined' ? localStorage.getItem('configuracionPartida') : null;
    
    if (!configuracionGuardada) {
      this.toastService.showMessage('No se encontró configuración de partida');
      this.router.navigate(['/jugar']);
      return;
    }
  
    try {
      const configuracionPartida = JSON.parse(configuracionGuardada);
      console.log('Configuración cargada:', configuracionPartida);
      
      this.configuracion = this.logicaJuegoService.obtenerConfiguracion(configuracionPartida.modo_juego);
      console.log('Configuración del modo:', this.configuracion);
      
      this.estadoJuegoService.inicializarJuego(configuracionPartida);
      
      setTimeout(() => {
        console.log('Estado actual:', this.estado);
        this.cargarSiguientePregunta();
      }, 100);
      
    } catch (error) {
      console.error('Error al inicializar juego:', error);
      this.toastService.showMessage('Error al inicializar el juego');
      this.router.navigate(['/jugar']);
    }
  }

  private suscribirseAEstado(): void {
    const suscripcion = this.estadoJuegoService.estado$.subscribe(estado => {
      this.estado = estado;
      
      if (estado.juegoTerminado) {
        this.finalizarPartida();
      }
    });
    
    this.suscripciones.push(suscripcion);
  }

  private cargarSiguientePregunta(): void {
    if (!this.estado) return;
    
    this.cargandoPregunta = true;
    
    const suscripcion = this.logicaJuegoService.obtenerSiguientePregunta(
      this.estado.idCategoria,
      this.estado.dificultad,
      this.estado.preguntasUsadas,
      this.estado.modoJuego
    ).subscribe({
      next: (pregunta) => {
        this.cargandoPregunta = false;
        
        if (pregunta) {
          this.estadoJuegoService.actualizarPreguntaActual(pregunta);
          setTimeout(() => {
            if (this.temporizador) {
              this.temporizador.reiniciarTemporizador();
            }
          }, 100);
        } else {
          this.toastService.showMessage('No hay más preguntas disponibles');
          this.estadoJuegoService.terminarJuego();
        }
      },
      error: (error) => {
        this.cargandoPregunta = false;
        console.error('Error al cargar pregunta:', error);
        this.toastService.showMessage('Error al cargar la pregunta');
      }
    });
    
    this.suscripciones.push(suscripcion);
  }

  onRespuestaSeleccionada(event: { idRespuesta: number; tiempoRespuesta: number; usoPista: boolean }): void {
    if (!this.estado?.preguntaActual || !this.configuracion) return;

    const pregunta = this.estado.preguntaActual;
    
    this.preguntaService.getRespuestasPregunta(pregunta.id).subscribe({
      next: (respuestas) => {
        const respuestaCorrecta = respuestas.find(r => r.es_correcta);
        const esCorrecta = event.idRespuesta !== -1 && respuestas.some(r => r.id === event.idRespuesta && r.es_correcta);
        
        if (!respuestaCorrecta) {
          console.error('No se encontró respuesta correcta');
          return;
        }

        const puntuacionPregunta = this.logicaJuegoService.calcularPuntuacion(
          this.estado!.modoJuego,
          esCorrecta,
          event.tiempoRespuesta,
          event.usoPista,
          this.estado!.dificultad
        );

        this.estadoJuegoService.registrarRespuesta(
          event.idRespuesta,
          respuestaCorrecta.id,
          event.tiempoRespuesta,
          event.usoPista,
          puntuacionPregunta
        );

        this.estadoJuegoService.actualizarPuntuacion(puntuacionPregunta);

        if (this.configuracion!.mostrarResultadosInmediatos) {
          this.mostrarRetroalimentacion(esCorrecta, respuestaCorrecta.texto, pregunta.explicacion);
        } else {
          this.procesarSiguientePregunta();
        }
      },
      error: (error) => {
        console.error('Error al obtener respuestas:', error);
        this.toastService.showMessage('Error al procesar la respuesta');
      }
    });
  }

  private mostrarRetroalimentacion(esCorrecta: boolean, respuestaCorrecta: string, explicacion?: string | null): void {
    this.mostrandoRetroalimentacion = true;
  }

  onContinuarRetroalimentacion(): void {
    this.mostrandoRetroalimentacion = false;
    this.procesarSiguientePregunta();
  }

  private procesarSiguientePregunta(): void {
    if (!this.estado || !this.configuracion) return;

    const ultimaRespuesta = this.estado.datosPartida[this.estado.datosPartida.length - 1];
    const esCorrecta = ultimaRespuesta?.id_respuesta_elegida === ultimaRespuesta?.id_respuesta_correcta;
    
    const debeTerminar = this.logicaJuegoService.debeTerminarJuego(
      this.estado.modoJuego,
      this.estado.indicePregunta,
      esCorrecta
    );

    if (debeTerminar) {
      this.estadoJuegoService.terminarJuego();
    } else {
      this.cargarSiguientePregunta();
    }
  }

  onTiempoAgotado(): void {
    if (!this.estado?.preguntaActual) return;

    this.preguntaService.getRespuestasPregunta(this.estado.preguntaActual.id).subscribe({
      next: (respuestas) => {
        const respuestasIncorrectas = respuestas.filter(r => !r.es_correcta);
        
        if (respuestasIncorrectas.length > 0) {
          const respuestaAleatoria = respuestasIncorrectas[
            Math.floor(Math.random() * respuestasIncorrectas.length)
          ];
          
          this.onRespuestaSeleccionada({
            idRespuesta: respuestaAleatoria.id,
            tiempoRespuesta: this.configuracion?.tiempoLimite || 0,
            usoPista: false
          });
        } else {
          this.handleNoRespuestas();
        }
      },
      error: (error) => {
        console.error('Error al obtener respuestas para tiempo agotado:', error);
        this.handleNoRespuestas();
      }
    });
  }

  private handleNoRespuestas(): void {
    console.warn('No se pudieron obtener respuestas incorrectas para tiempo agotado');
    this.toastService.showMessage('No se pudieron obtener respuestas incorrectas para tiempo agotado');
    this.onRespuestaSeleccionada({
      idRespuesta: -1,
      tiempoRespuesta: this.configuracion?.tiempoLimite || 0,
      usoPista: false
    });
  }

  onPistaUsada(): void {
    if (this.configuracion?.penalizacionPista && this.configuracion.penalizacionPista > 0) {
      if (this.temporizador && this.configuracion.tiempoLimite) {
        this.temporizador.restarTiempo(this.configuracion.penalizacionPista);
      }
    }
  }

  abandonarJuego(): void {
    this.alertService.confirm('¿Estás seguro de que quieres abandonar la partida? Se perderá todo el progreso.')
      .then((result) => {
        if (result.isConfirmed) {
          this.estadoJuegoService.terminarJuego();
          this.estadoJuegoService.reiniciarEstado();
          localStorage.removeItem('configuracionPartida');
          this.router.navigate(['/jugar']);
          this.alertService.success('Partida abandonada correctamente');
        }
      })
      .catch((error) => {
        console.error('Error al abandonar partida:', error);
        this.toastService.showMessage('Error al abandonar la partida');
      });
  }

  private async finalizarPartida(): Promise<void> {
    if (!this.estado) return;

    try {
      const historialAnterior = this.estadoJuegoService.obtenerHistorialPreguntas(
        this.estado.modoJuego, 
        this.estado.dificultad, 
        this.estado.idCategoria
      );
      
      const nuevoHistorial = [...new Set([...historialAnterior, ...this.estado.preguntasUsadas])];
      this.estadoJuegoService.guardarHistorialPreguntas(
        this.estado.modoJuego,
        this.estado.dificultad,
        this.estado.idCategoria,
        nuevoHistorial
      );
  
      const partidaRequest = {
        datos_partida: this.estado.datosPartida,
        puntuacion: this.estado.puntuacion,
        modo_juego: this.estado.modoJuego,
        id_categoria: this.estado.idCategoria,
        dificultad: this.estado.dificultad,
        id_usuario: this.estado.idUsuario
      };
  
      const suscripcion = this.partidaService.crearPartida(partidaRequest).subscribe({
        next: (partida) => {
          console.log('Partida guardada:', partida);
          localStorage.removeItem('configuracionPartida');
        },
        error: (error) => {
          console.error('Error al guardar partida:', error);
          this.toastService.showMessage('Error al guardar la partida');
        }
      });
      
      this.suscripciones.push(suscripcion);
      
    } catch (error) {
      console.error('Error al finalizar partida:', error);
      this.toastService.showMessage('Error al finalizar la partida');
    }
  }

  detenerTemporizador(): void {
    if (this.temporizador) {
      this.temporizador.detenerTemporizador();
    }
  }

  volverAlMenu(): void {
    this.estadoJuegoService.reiniciarEstado();
    localStorage.removeItem('configuracionPartida');
    this.router.navigate(['/']);
  }

  get tiempoLimiteSeguro(): number {
    return this.configuracion?.tiempoLimite || 0;
  }
  get permitePistasSeguro(): boolean {
    return this.configuracion?.permitePistas || false;
  }
  get totalPreguntasSeguro(): number {
    return this.configuracion?.totalPreguntas || 0;
  }
  get respuestaUsuarioSeguro(): Omit<DatosPartida, 'id' | 'id_partida'> | null {
    if (!this.estado?.datosPartida || this.estado.datosPartida.length === 0) {
      return null;
    }
    return this.estado.datosPartida[this.estado.datosPartida.length - 1];
  }
}