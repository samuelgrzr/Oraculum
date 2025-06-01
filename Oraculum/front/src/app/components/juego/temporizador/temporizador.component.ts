import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-temporizador',
  imports: [CommonModule],
  templateUrl: './temporizador.component.html',
  styleUrl: './temporizador.component.css'
})
export class TemporizadorComponent implements OnInit, OnDestroy {
  @Input() tiempoLimite = 30000; // en milisegundos
  @Input() pausado = false;
  @Output() tiempoAgotado = new EventEmitter<void>();

  tiempoRestante = 0;
  porcentajeRestante = 100;
  private intervalId: any;
  private tiempoInicio = 0;
  private tiempoPausado = 0;

  ngOnInit(): void {
    this.iniciarTemporizador();
  }

  ngOnDestroy(): void {
    this.detenerTemporizador();
  }

  private iniciarTemporizador(): void {
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

  private detenerTemporizador(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
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
