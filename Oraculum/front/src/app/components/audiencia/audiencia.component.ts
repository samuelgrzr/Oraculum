import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AudienciaService, MensajeResponse, EstadoAudiencia } from '../../services/audiencia.service';
import { AlertService } from '../../services/alert.service';
import { StorageService } from '../../services/storage.service';

interface Mensaje {
    texto: string;
    esUsuario: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-audiencia',
    imports: [CommonModule, FormsModule],
    templateUrl: './audiencia.component.html',
    styleUrls: ['./audiencia.component.css']
})
export class AudienciaComponent implements OnInit {
    private audienciaService = inject(AudienciaService);
    private alertService = inject(AlertService);
    private router = inject(Router);
    private storageService = inject(StorageService);

    mensajes: Mensaje[] = [];
    mensajeActual = '';
    cargando = false;
    estado: EstadoAudiencia | null = null;
    private readonly STORAGE_KEY = 'audiencia_mensajes';
    private audienciaCompletada = false;

    ngOnInit() {
        this.cargarEstado();
        this.cargarMensajesPersistidos();
    }

    cargarEstado() {
        this.audienciaService.obtenerEstado().subscribe({
            next: (estado) => {
                this.estado = estado;
                if (!estado.puede_conversar) {
                    // Si no puede conversar, limpiar mensajes persistidos
                    this.limpiarMensajesPersistidos();
                    this.alertService.error('Solo los 3 mejores del ranking pueden tener audiencia con Apolo');
                    this.router.navigate(['/perfil']);
                } else {
                    // Si puede conversar pero no hay mensajes, agregar bienvenida
                    if (this.mensajes.length === 0) {
                        this.limpiarMensajesPersistidos();
                        this.agregarMensajeBienvenida();
                    }
                }
            },
            error: (error) => {
                console.error('Error al cargar estado de audiencia:', error);
                this.limpiarMensajesPersistidos();
                this.router.navigate(['/perfil']);
            }
        });
    }

    cargarMensajesPersistidos() {
        try {
            const mensajesGuardados = this.storageService.getItem(this.STORAGE_KEY);
            if (mensajesGuardados) {
                const mensajes = JSON.parse(mensajesGuardados);
                // Convertir las fechas de string a Date
                this.mensajes = mensajes.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp)
                }));
            }
        } catch (error) {
            console.error('Error al cargar mensajes persistidos:', error);
            this.limpiarMensajesPersistidos();
        }
    }

    guardarMensajes() {
        try {
            this.storageService.setItem(this.STORAGE_KEY, JSON.stringify(this.mensajes));
        } catch (error) {
            console.error('Error al guardar mensajes:', error);
        }
    }

    limpiarMensajesPersistidos() {
        this.storageService.removeItem(this.STORAGE_KEY);
        this.mensajes = [];
    }

    agregarMensajeBienvenida() {
        const mensajeBienvenida: Mensaje = {
            texto: '¡Saludos, noble mortal! Soy Apolo, dios de la sabiduría y señor de los oráculos. Has sido concedido con una audiencia sagrada por demostrar gran conocimiento al estar entre los mejores del Oráculo. En mi templo divino, puedes hacerme hasta 5 preguntas. ¿Qué sabiduría buscas de los dioses del Olimpo?',
            esUsuario: false,
            timestamp: new Date()
        };
        this.mensajes.push(mensajeBienvenida);
        this.guardarMensajes();
    }

    enviarMensaje() {
        if (!this.mensajeActual.trim() || this.cargando) return;
        if (!this.estado || this.estado.preguntas_restantes <= 0) {
            this.alertService.error('Has agotado tus preguntas en esta audiencia sagrada');
            return;
        }

        const mensajeUsuario: Mensaje = {
            texto: this.mensajeActual,
            esUsuario: true,
            timestamp: new Date()
        };
        this.mensajes.push(mensajeUsuario);
        this.guardarMensajes();

        const mensaje = this.mensajeActual;
        this.mensajeActual = '';
        this.cargando = true;

        this.audienciaService.conversar(mensaje).subscribe({
            next: (response: MensajeResponse) => {
                const mensajeApolo: Mensaje = {
                    texto: response.respuesta,
                    esUsuario: false,
                    timestamp: new Date()
                };
                this.mensajes.push(mensajeApolo);
                this.guardarMensajes();

                if (this.estado) {
                    this.estado.preguntas_restantes = response.preguntas_restantes;
                }

                this.cargando = false;

                if (response.preguntas_restantes === 0) {
                    this.audienciaCompletada = true;
                    setTimeout(() => {
                        const mensajeDespedida: Mensaje = {
                            texto: 'Has agotado tus preguntas en esta audiencia sagrada, noble mortal. Que la sabiduría divina te acompañe hasta que volvamos a encontrarnos en mi templo. Ve en paz, hijo de los hombres.',
                            esUsuario: false,
                            timestamp: new Date()
                        };
                        this.mensajes.push(mensajeDespedida);
                        this.guardarMensajes();
                    }, 2000);
                }
            },
            error: (error) => {
                console.error('Error al enviar mensaje:', error);
                this.alertService.error('Error en la comunicación divina con Apolo');
                this.cargando = false;
            }
        });
    }

    volver() {
        if (this.audienciaCompletada) {
            this.limpiarMensajesPersistidos();
        }
        this.router.navigate(['/perfil']);
    }

    get tiempoEsperaFormateado(): string {
        if (!this.estado?.tiempo_espera_restante) return '';

        const minutos = this.estado.tiempo_espera_restante;
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;

        if (horas > 0) {
            return `${horas}h ${minutosRestantes}m`;
        }
        return `${minutosRestantes}m`;
    }
}