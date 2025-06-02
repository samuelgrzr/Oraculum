export interface Partida {
    id: number;
    id_usuario: number;
    fecha: Date;
    puntuacion: number;
    modo_juego: string;  // 'aventura', 'prueba', 'contrarreloj', 'infinito'
    id_categoria: number;
    dificultad: string;  // 'heroica', 'divina'
    respuestasCorrectas?: number;
    nombre_categoria?: string;
    pistas_usadas?: number;
}