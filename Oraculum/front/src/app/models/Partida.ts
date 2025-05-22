export interface Partida {
    id: number;
    id_usuario: number;
    fecha: Date;
    puntuacion: number;
    modo_juego: string;  // 'estandar', 'examen', 'contrarreloj', 'infinito'
    id_categoria: number;
    dificultad: string;  // 'facil', 'medio', 'dificil'
}