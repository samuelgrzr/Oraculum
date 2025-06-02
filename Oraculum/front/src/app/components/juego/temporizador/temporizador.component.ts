import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temporizador',
  imports: [CommonModule],
  templateUrl: './temporizador.component.html',
  styleUrl: './temporizador.component.css'
})
export class TemporizadorComponent implements OnInit, OnDestroy {
  @Input() tiempoLimite!: number;
  @Input() pausado = false;
  @Output() tiempoAgotado = new EventEmitter<void>();

  tiempoRestante = 0;
  porcentajeRestante = 100;
  private intervalId: any;
  private tiempoInicio = 0;
  private tiempoPausado = 0;

  ngOnInit(): void {
    if (!this.tiempoLimite || this.tiempoLimite <= 0) {
      console.warn('TemporizadorComponent: tiempoLimite no está definido o es inválido');
      return;
    }
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  iniciarTemporizador(): void {
    this.tiempoInicio = Date.now();
    this.tiempoRestante = this.tiempoLimite;
    
    this.intervalId = setInterval(() => {
      if (!this.pausado) {
        const tiempoTranscurrido = Date.now() - this.tiempoInicio - this.tiempoPausado;
        this.tiempoRestante = Math.max(0, this.tiempoLimite - tiempoTranscurrido);
        this.porcentajeRestante = (this.tiempoRestante / this.tiempoLimite) * 100;
        
        if (this.tiempoRestante <= 0) {
          this.tiempoAgotado.emit();
          this.detenerTemporizador();
        }
      }
    }, 100);
  }

  detenerTemporizador(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reiniciarTemporizador(): void {
    this.detenerTemporizador();
    this.tiempoInicio = Date.now();
    this.tiempoRestante = this.tiempoLimite;
    this.porcentajeRestante = 100;
    this.tiempoPausado = 0;
    
    this.intervalId = setInterval(() => {
      if (!this.pausado) {
        const tiempoTranscurrido = Date.now() - this.tiempoInicio - this.tiempoPausado;
        this.tiempoRestante = Math.max(0, this.tiempoLimite - tiempoTranscurrido);
        this.porcentajeRestante = (this.tiempoRestante / this.tiempoLimite) * 100;
        
        if (this.tiempoRestante <= 0) {
          this.tiempoAgotado.emit();
          this.detenerTemporizador();
        }
      }
    }, 100);
  }

  restarTiempo(milisegundos: number): void {
    if (milisegundos <= 0) return;
    
    this.tiempoInicio -= milisegundos;
    
    const tiempoTranscurrido = Date.now() - this.tiempoInicio - this.tiempoPausado;
    this.tiempoRestante = Math.max(0, this.tiempoLimite - tiempoTranscurrido);
    this.porcentajeRestante = (this.tiempoRestante / this.tiempoLimite) * 100;
    
    if (this.tiempoRestante <= 0) {
      this.tiempoAgotado.emit();
      this.detenerTemporizador();
    }
  }

  get segundosRestantes(): number {
    return Math.ceil(this.tiempoRestante / 1000);
  }
  get colorTemporizador(): string {
    if (this.porcentajeRestante > 50) return 'text-green-600';
    if (this.porcentajeRestante > 25) return 'text-yellow-600';
    return 'text-red-600';
  }
  get colorBarra(): string {
    if (this.porcentajeRestante > 50) return 'bg-green-500';
    if (this.porcentajeRestante > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  }
}
