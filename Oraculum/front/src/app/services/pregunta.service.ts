import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/Pregunta';
import { Respuesta } from '../models/Respuesta';

@Injectable({
    providedIn: 'root'
})
export class PreguntaService {
    private apiUrl = 'http://localhost:8000/preguntas';
    private respuestasUrl = 'http://localhost:8000/respuestas';
    private http = inject(HttpClient);

    getPregunta(id: number): Observable<Pregunta> {
        return this.http.get<Pregunta>(`${this.apiUrl}/${id}`);
    }
    
    getAllPreguntas(): Observable<Pregunta[]> {
        return this.http.get<Pregunta[]>(`${this.apiUrl}/preguntas`);
    }
    
    getPreguntasfiltradas(idCategoria?: number, dificultad?: string): Observable<Pregunta[]> {
        let params = new HttpParams();
        
        if (idCategoria) { params = params.set('id_categoria', idCategoria.toString()); }
        if (dificultad) { params = params.set('dificultad', dificultad); }
        return this.http.get<Pregunta[]>(`${this.apiUrl}/filtrar`, { params });
    }
    
    getRespuestasPregunta(idPregunta: number): Observable<Respuesta[]> {
        return this.http.get<Respuesta[]>(`${this.respuestasUrl}/pregunta/${idPregunta}`);
    }
    
    createPregunta(pregunta: Pregunta): Observable<Pregunta> {
        return this.http.post<Pregunta>(`${this.apiUrl}`, pregunta);
    }

    updatePregunta(id: number, pregunta: Partial<Pregunta>): Observable<Pregunta> {
        return this.http.put<Pregunta>(`${this.apiUrl}/${id}`, pregunta);
    }

    deletePregunta(id: number): Observable<Pregunta> {
        return this.http.delete<Pregunta>(`${this.apiUrl}/${id}`);
    }
}