export interface Pregunta {
    id: number;
    enunciado: string;
    pista: string | null;
    explicacion: string | null;
    dificultad: string;
    id_categoria: number;
}