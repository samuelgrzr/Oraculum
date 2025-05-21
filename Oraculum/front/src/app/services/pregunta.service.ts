import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pregunta } from '../models/Pregunta';

@Injectable({
    providedIn: 'root'
})
export class PreguntaService {
    private apiUrl = 'http://localhost:8000/preguntas';
    private http = inject(HttpClient);

    getPregunta(id: number): Observable<Pregunta> {
        return this.http.get<Pregunta>(`${this.apiUrl}/${id}`);
    }

    getPreguntasPorCategoria(categoriaId: number): Observable<Pregunta[]> {
        return this.http.get<Pregunta[]>(`${this.apiUrl}/categoria/${categoriaId}`);
    }

    getAllPreguntas(): Observable<Pregunta[]> {
        return this.http.get<Pregunta[]>(`${this.apiUrl}/preguntas`);
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