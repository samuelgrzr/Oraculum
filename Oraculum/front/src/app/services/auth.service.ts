import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from './usuario.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8000';
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;
    private http = inject(HttpClient);
    private usuarioService = inject(UsuarioService);

    constructor() {
        this.currentUserSubject = new BehaviorSubject<Usuario | null>(
            typeof localStorage !== 'undefined' 
                ? JSON.parse(localStorage.getItem('currentUser') || 'null')
                : null
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario | null {
        return this.currentUserSubject.value;
    }

    login(correo: string, contrasena: string) {
        const formData = new URLSearchParams();
        formData.append('username', correo);
        formData.append('password', contrasena);
        
        console.log('Iniciando sesión con:', correo);
        
        return this.http.post<any>(`${this.apiUrl}/auth/token`, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            switchMap(response => {
                if (response && response.access_token) {
                    return this.usuarioService.getUsuarioPorCorreo(correo).pipe(
                        map(usuario => {
                            const userData = {
                                token: response.access_token,
                                usuario: usuario
                            };
                            
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('currentUser', JSON.stringify(userData.usuario));
                                localStorage.setItem('token', userData.token);
                            }
                            
                            this.currentUserSubject.next(userData.usuario);
                            return userData;
                        })
                    );
                }
                throw new Error('Respuesta inválida del servidor');
            })
        );
    }

    registro(usuario: Usuario) {
        return this.http.post<any>(`${this.apiUrl}/auth`, usuario)
            .pipe(map(response => {
                if (response.token && typeof localStorage !== 'undefined') {
                    localStorage.setItem('currentUser', JSON.stringify(response.usuario));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response.usuario);
                }
                return response;
            }));
    }

    logout() {
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
        }
        this.currentUserSubject.next(null);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    getToken(): string | null {
        return typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    }
}