import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/Usuario';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {
    // private apiUrl = 'http://localhost:8000/usuarios';
    private apiUrl = `${environment.apiUrl}/usuarios`;
    private http = inject(HttpClient);

    getUsuario(id: number): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}?id_usuario=${id}`);
    }

    getUsuarioPorNombre(nombre: string): Observable<Usuario> {
        return this.http.get<Usuario>(`${this.apiUrl}/nombre/${nombre}`);
    }

    getAllUsuarios(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/usuarios`);
    }

    getRanking(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.apiUrl}/ranking`);
    }

    updateUsuario(id: number, usuario: Partial<Usuario>): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
    }

    deleteUsuario(id: number): Observable<Usuario> {
        return this.http.delete<Usuario>(`${this.apiUrl}/${id}`);
    }
}