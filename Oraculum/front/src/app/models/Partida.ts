export interface Partida {
    id: number;
    idUsuario: number;
    fecha: Date;
    puntuacion: number;
    modoJuego: string;  // 'estandar', 'examen', 'contrarreloj', 'infinito'
    idCategoria: number;
    dificultad: string;  // 'facil', 'medio', 'dificil'
}