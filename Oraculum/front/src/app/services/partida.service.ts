import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Partida } from '../models/Partida';
import { DatosPartida } from '../models/DatosPartida';
import { environment } from '../../environments/environment';

interface CrearPartidaRequest {
  datos_partida: Omit<DatosPartida, 'id' | 'id_partida'>[];
  puntuacion: number;
  modo_juego: string;
  id_categoria: number;
  dificultad: string;
  id_usuario: number;
}

@Injectable({
  providedIn: 'root'
})
export class PartidaService {
  // private apiUrl = 'http://localhost:8000/partidas';
  private apiUrl = `${environment.apiUrl}/partidas`;
  private http = inject(HttpClient);

  getPartida(id: number): Observable<Partida> {
    return this.http.get<Partida>(`${this.apiUrl}/${id}`);
  }

  getHistorialUsuario(idUsuario: number): Observable<Partida[]> {
    return this.http.get<Partida[]>(`${this.apiUrl}/historial/${idUsuario}`);
  }

  crearPartida(partida: CrearPartidaRequest): Observable<Partida> {
    return this.http.post<Partida>(`${this.apiUrl}`, partida);
  }
}