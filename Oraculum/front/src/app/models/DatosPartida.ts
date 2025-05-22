export interface DatosPartida {
    id: number;
    id_partida: number;
    id_pregunta: number;
    id_respuesta_elegida: number;
    id_respuesta_correcta: number;
    tiempo_respuesta: number;
    uso_pista: boolean;
    puntuacion_pregunta: number;
}