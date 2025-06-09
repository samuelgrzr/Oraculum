import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // private apiUrl = 'http://localhost:8000';
    private apiUrl = environment.apiUrl;
    private currentUserSubject: BehaviorSubject<Usuario | null>;
    public currentUser: Observable<Usuario | null>;
    private http = inject(HttpClient);
    private usuarioService = inject(UsuarioService);
    private toastService = inject(ToastService);
    private storageService = inject(StorageService);

    constructor(private router: Router) {
        this.currentUserSubject = new BehaviorSubject<Usuario | null>(
            JSON.parse(this.storageService.getItem("currentUser") || "null")
        );
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Usuario | null {
        return this.currentUserSubject.value;
    }

    login(nombre: string, contrasena: string) {
        const formData = new URLSearchParams();
        formData.append('username', nombre);
        formData.append('password', contrasena);
        
        console.log('Iniciando sesión con:', nombre);
        
        return this.http.post<any>(`${this.apiUrl}/auth/token`, formData.toString(), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).pipe(
            switchMap(response => {
                if (response && response.access_token) {
                    return this.usuarioService.getUsuarioPorNombre(nombre).pipe(
                        map(usuario => {
                            const userData = {
                                token: response.access_token,
                                usuario: usuario
                            };
                            
                            if (typeof localStorage !== 'undefined') {
                                this.storageService.setItem('currentUser', JSON.stringify(userData.usuario));
                                this.storageService.setItem('token', userData.token);
                            }
                            
                            this.toastService.showMessage('¡Bienvenido!');
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
                return response;
            }));
    }

    logout(): void {
        this.storageService.clear();
        sessionStorage.clear();
        
        this.currentUserSubject.next(null);
        
        this.toastService.showMessage('Sesión cerrada correctamente');
        this.router.navigate(['/']);
    }

    isLoggedIn(): boolean {
        return !!this.currentUserValue;
    }

    getToken(): string | null {
        return this.storageService.getItem('token');
    }

    actualizarUsuarioActual(usuario: Usuario): void {
        this.storageService.setItem('currentUser', JSON.stringify(usuario));
        this.currentUserSubject.next(usuario);
    }
}