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
import { Pregunta } from '../../../models/Pregunta';
import { ConfiguracionJuego } from '../../../models/ConfiguracionJuego';

// Importar componentes del juego
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
      console.log('Configuración cargada:', configuracionPartida); // Debug
      
      this.configuracion = this.logicaJuegoService.obtenerConfiguracion(configuracionPartida.modo_juego);
      console.log('Configuración del modo:', this.configuracion); // Debug
      
      // Inicializar el estado del juego
      this.estadoJuegoService.inicializarJuego(configuracionPartida);
      
      // Esperar un momento para que el estado se actualice
      setTimeout(() => {
        console.log('Estado actual:', this.estado); // Debug
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
      console.log('Estado actualizado:', estado); // Debug
      this.estado = estado;
      
      // Verificar si el juego debe terminar
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
          // Reiniciar temporizador para la nueva pregunta
          setTimeout(() => {
            if (this.temporizador) {
              this.temporizador.reiniciarTemporizador();
            }
          }, 100);
        } else {
          // No hay más preguntas disponibles
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
    
    // Obtener las respuestas de la pregunta para determinar cuál es correcta
    this.preguntaService.getRespuestasPregunta(pregunta.id).subscribe({
      next: (respuestas) => {
        const respuestaCorrecta = respuestas.find(r => r.es_correcta);
        const esCorrecta = event.idRespuesta !== -1 && respuestas.some(r => r.id === event.idRespuesta && r.es_correcta);
        
        if (!respuestaCorrecta) {
          console.error('No se encontró respuesta correcta');
          return;
        }

        // Calcular puntuación
        const puntuacionPregunta = this.logicaJuegoService.calcularPuntuacion(
          this.estado!.modoJuego,
          esCorrecta,
          event.tiempoRespuesta,
          event.usoPista,
          this.estado!.dificultad
        );

        // Registrar la respuesta
        this.estadoJuegoService.registrarRespuesta(
          event.idRespuesta,
          respuestaCorrecta.id,
          event.tiempoRespuesta,
          event.usoPista,
          puntuacionPregunta
        );

        // Actualizar puntuación total
        this.estadoJuegoService.actualizarPuntuacion(puntuacionPregunta);

        // Mostrar retroalimentación si está configurado
        if (this.configuracion!.mostrarResultadosInmediatos) {
          this.mostrarRetroalimentacion(esCorrecta, respuestaCorrecta.texto, pregunta.explicacion);
        } else {
          this.procesarSiguientePregunta();
        }
      },
      error: (error) => {
        console.error('Error al obtener respuestas:', error);
      }
    });
  }

  private mostrarRetroalimentacion(esCorrecta: boolean, respuestaCorrecta: string, explicacion?: string | null): void {
    this.mostrandoRetroalimentacion = true;
    // Eliminamos el setTimeout automático
  }

  onContinuarRetroalimentacion(): void {
    this.mostrandoRetroalimentacion = false;
    this.procesarSiguientePregunta();
  }

  private procesarSiguientePregunta(): void {
    if (!this.estado || !this.configuracion) return;

    // Verificar si el juego debe terminar
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

    // Respuesta automática por tiempo agotado
    this.onRespuestaSeleccionada({
      idRespuesta: -1, // Indicador de tiempo agotado
      tiempoRespuesta: this.configuracion?.tiempoLimite || 0,
      usoPista: false
    });
  }

  onPistaUsada(): void {
    // Solo restar tiempo si hay configuración y penalización definida
    if (this.configuracion?.penalizacionPista && this.configuracion.penalizacionPista > 0) {
      // Verificar que el temporizador existe y está activo
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
      });
  }

  private async finalizarPartida(): Promise<void> {
    if (!this.estado) return;

    try {
      // Crear la partida en el backend
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

  // Para controlar los nulos en el html
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