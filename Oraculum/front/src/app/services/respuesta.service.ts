import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Respuesta } from '../models/Respuesta';

@Injectable({
    providedIn: 'root'
})
export class RespuestaService {
    private apiUrl = 'http://localhost:8000/respuestas';
    private http = inject(HttpClient);

    getRespuesta(id: number): Observable<Respuesta> {
        return this.http.get<Respuesta>(`${this.apiUrl}/${id}`);
    }

    getRespuestasPorPregunta(preguntaId: number): Observable<Respuesta[]> {
        return this.http.get<Respuesta[]>(`${this.apiUrl}/pregunta/${preguntaId}`);
    }

    getAllRespuestas(): Observable<Respuesta[]> {
        return this.http.get<Respuesta[]>(`${this.apiUrl}/respuestas`);
    }

    createRespuesta(respuesta: Respuesta): Observable<Respuesta> {
        return this.http.post<Respuesta>(`${this.apiUrl}`, respuesta);
    }

    updateRespuesta(id: number, respuesta: Partial<Respuesta>): Observable<Respuesta> {
        return this.http.put<Respuesta>(`${this.apiUrl}/${id}`, respuesta);
    }

    deleteRespuesta(id: number): Observable<Respuesta> {
        return this.http.delete<Respuesta>(`${this.apiUrl}/${id}`);
    }
}