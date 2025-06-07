import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MensajeRequest {
  mensaje: string;
}

export interface MensajeResponse {
  respuesta: string;
  preguntas_restantes: number;
}

export interface EstadoAudiencia {
  puede_conversar: boolean;
  preguntas_restantes: number;
  posicion_ranking: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class AudienciaService {
  private apiUrl = 'http://localhost:8000/audiencia';
  private http = inject(HttpClient);

  conversar(mensaje: string): Observable<MensajeResponse> {
    return this.http.post<MensajeResponse>(`${this.apiUrl}/conversar`, { mensaje });
  }

  obtenerEstado(): Observable<EstadoAudiencia> {
    return this.http.get<EstadoAudiencia>(`${this.apiUrl}/estado`);
  }
}