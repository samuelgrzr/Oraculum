export interface ConfiguracionJuego {
    totalPreguntas: number;
    tiempoLimite?: number;
    permitePistas: boolean;
    mostrarResultadosInmediatos: boolean;
    continuaHastaFallar: boolean;
    penalizacionPista: number;
    bonusVelocidad: boolean;
  }
  
  export const CONFIGURACIONES_MODO: { [key: string]: ConfiguracionJuego } = {
    'aventura': {
      totalPreguntas: 10,
      permitePistas: true,
      mostrarResultadosInmediatos: true,
      continuaHastaFallar: false,
      penalizacionPista: 0,
      bonusVelocidad: false
    },
    'prueba': {
      totalPreguntas: 10,
      permitePistas: false,
      mostrarResultadosInmediatos: false,
      continuaHastaFallar: false,
      penalizacionPista: 0,
      bonusVelocidad: false
    },
    'contrarreloj': {
      totalPreguntas: 10,
      tiempoLimite: 10000, // 10 segundos
      permitePistas: true,
      mostrarResultadosInmediatos: true,
      continuaHastaFallar: false,
      penalizacionPista: 2000, // 2 segundos menos
      bonusVelocidad: true
    },
    'infinito': {
      totalPreguntas: -1,
      tiempoLimite: 5000,
      permitePistas: false,
      mostrarResultadosInmediatos: true,
      continuaHastaFallar: true,
      penalizacionPista: 0,
      bonusVelocidad: true
    }
  };