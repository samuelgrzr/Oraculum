import { Pregunta } from './Pregunta';
import { DatosPartida } from './DatosPartida';

export interface EstadoJuego {
  // Configuración inicial
  modoJuego: string;
  dificultad: string;
  idCategoria: number;
  idUsuario: number;
  
  // Estado actual
  preguntaActual: Pregunta | null;
  indicePregunta: number;
  puntuacion: number;
  preguntasUsadas: number[];
  
  // Tiempo
  tiempoInicio: number;
  tiempoRestante?: number;
  tiempoUltimaPregunta?: number;
  
  // Estado del juego
  juegoActivo: boolean;
  juegoTerminado: boolean;
  pausado: boolean;
  
  // Datos de la partida
  datosPartida: Omit<DatosPartida, 'id' | 'id_partida'>[];
  
  // Resultados
  respuestasCorrectas: number;
  respuestasIncorrectas: number;
  pistasUsadas: number;
}