import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000/api';  // CAMBIAR
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Usuario | null>(
            JSON.parse(localStorage.getItem('currentUser') || 'null')
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario | null {
        return this.currentUserSubject.value;
    }

    login(correo: string, contrasena: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, { correo, contrasena })
            .pipe(map(response => {
                localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                localStorage.setItem('token', response.token);
                this.currentUserSubject.next(response.usuario);
                return response;
            }));
    }

    register(usuario: Usuario) {
        return this.http.post<any>(`${this.apiUrl}/register`, usuario)
            .pipe(map(response => {
                if (response.token) {
                    localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response.usuario);
                }
                return response;
            }));
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }
}