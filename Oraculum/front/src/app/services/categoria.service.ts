import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../models/Categoria';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    private apiUrl = 'http://localhost:8000/categorias';
    private http = inject(HttpClient);

    getCategoria(id: number): Observable<Categoria> {
        return this.http.get<Categoria>(`${this.apiUrl}/${id}`);
    }

    getAllCategorias(): Observable<Categoria[]> {
        return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
    }

    createCategoria(categoria: Categoria): Observable<Categoria> {
        return this.http.post<Categoria>(`${this.apiUrl}`, categoria);
    }

    updateCategoria(id: number, categoria: Partial<Categoria>): Observable<Categoria> {
        return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
    }

    deleteCategoria(id: number): Observable<Categoria> {
        return this.http.delete<Categoria>(`${this.apiUrl}/${id}`);
    }
}