export interface DatosPartida {
    id: number;
    idPartida: number;
    idPregunta: number;
    idRespuestaElegida: number;
    idRespuestaCorrecta: number;
    tiempoRespuesta: number;
    usoPista: boolean;
    puntuacionPregunta: number;
}