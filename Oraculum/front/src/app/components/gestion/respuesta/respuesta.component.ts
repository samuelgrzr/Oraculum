import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Respuesta } from '../../../models/Respuesta';
import { RespuestaService } from '../../../services/respuesta.service';
import { PreguntaService } from '../../../services/pregunta.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Pregunta } from '../../../models/Pregunta';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-respuesta',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './respuesta.component.html',
  styleUrls: ['./respuesta.component.css']
})
export class RespuestaComponent implements OnInit {
  respuestas: Respuesta[] = [];
  respuestasFiltradas: Respuesta[] = [];
  preguntas: Pregunta[] = [];
  respuestaEditandoId: number | null = null;
  respuestaForm: FormGroup;
  mostrarFormulario: boolean = false;
  preguntaFiltro: string = '';

  get textoControl(): FormControl {
    return this.respuestaForm.get('texto') as FormControl;
  }

  get es_correctaControl(): FormControl {
    return this.respuestaForm.get('es_correcta') as FormControl;
  }

  get id_preguntaControl(): FormControl {
    return this.respuestaForm.get('id_pregunta') as FormControl;
  }

  constructor(
    private respuestaService: RespuestaService,
    private preguntaService: PreguntaService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.respuestaForm = this.fb.group({
      id: [null],
      texto: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      es_correcta: [false, Validators.required],
      id_pregunta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarRespuestas();
    this.cargarPreguntas();
  }

  cargarRespuestas(): void {
    this.respuestaService.getAllRespuestas().subscribe(
      respuestas => {
        this.respuestas = respuestas;
        if (this.preguntaFiltro) {
          this.filtrarPorPregunta();
        } else {
          this.respuestasFiltradas = respuestas;
        }
      }
    );
  }

  filtrarPorPregunta(): void {
    if (!this.preguntaFiltro) {
      this.respuestasFiltradas = this.respuestas;
    } else {
      this.respuestaService.getRespuestasPorPregunta(Number(this.preguntaFiltro)).subscribe(
        respuestas => {
          this.respuestasFiltradas = respuestas;
        }
      );
    }
  }

  aplicarFiltro(): void {
    this.filtrarPorPregunta();
  }

  cargarPreguntas(): void {
    this.preguntaService.getAllPreguntas().subscribe(
      preguntas => this.preguntas = preguntas
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelarEdicion();
    }
  }

  crearRespuesta(): void {
    this.respuestaEditandoId = null;
    this.respuestaForm.reset();
    this.mostrarFormulario = true;
  }

  cancelarEdicion(): void {
    this.respuestaEditandoId = null;
    this.respuestaForm.reset();
    this.mostrarFormulario = false;
  }

  editarRespuesta(respuesta: Respuesta): void {
    this.respuestaEditandoId = respuesta.id;
    this.respuestaForm.patchValue({
      texto: respuesta.texto,
      es_correcta: respuesta.es_correcta,
      id_pregunta: respuesta.id_pregunta
    });
    this.mostrarFormulario = true;
    this.toastService.showMessage('Formulario de edición abierto en la parte superior');
  }

  guardarCambios(): void {
    if (this.respuestaForm.valid) {
      const nuevaRespuesta = this.respuestaForm.value;
      
      if (nuevaRespuesta.es_correcta) {
        this.respuestaService.getRespuestasPorPregunta(nuevaRespuesta.id_pregunta).subscribe({
          next: (respuestas) => {
            const respuestaCorrecta = respuestas.find(r => 
              r.es_correcta && 
              (!this.respuestaEditandoId || r.id !== this.respuestaEditandoId)
            );

            if (respuestaCorrecta) {
              this.toastService.showMessage('Ya existe una respuesta correcta para esta pregunta');
              return;
            }

            this.guardarRespuesta(nuevaRespuesta);
          },
          error: (error) => {
            this.toastService.showMessage('Error al verificar las respuestas existentes');
            console.error('Error:', error);
          }
        });
      } else {
        this.guardarRespuesta(nuevaRespuesta);
      }
    }
  }

  // He tenido que separar la lógica en dos métodos para poder controlar que no haya dos correctas
  guardarRespuesta(respuesta: any): void {
    if (this.respuestaEditandoId) {
      this.respuestaService.updateRespuesta(this.respuestaEditandoId, respuesta)
        .subscribe({
          next: () => {
            this.toastService.showMessage('Respuesta actualizada correctamente');
            this.cargarRespuestas();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.toastService.showMessage('Error al actualizar la respuesta');
            console.error('Error:', error);
          }
        });
    } else {
      this.respuestaService.createRespuesta(respuesta)
        .subscribe({
          next: () => {
            this.toastService.showMessage('Respuesta creada correctamente');
            this.cargarRespuestas();
            this.cancelarEdicion();
          },
          error: (error) => {
            this.toastService.showMessage('Error al crear la respuesta');
            console.error('Error:', error);
          }
        });
    }
  }

  eliminarRespuesta(id: number): void {
    this.alertService.confirm('¿Estás seguro de que quieres eliminar esta respuesta?')
      .then((result) => {
        if (result.isConfirmed) {
          this.respuestaService.deleteRespuesta(id).subscribe({
            next: () => {
              this.alertService.success('Respuesta eliminada correctamente');
              this.cargarRespuestas();
            },
            error: (error) => {
              this.alertService.error('Error al eliminar la respuesta');
              console.error('Error:', error);
            }
          });
        }
      });
  }

  isEditing(id: number): boolean {
    return this.respuestaEditandoId === id;
  }

  getEnunciadoPregunta(id_pregunta: number): string {
    const pregunta = this.preguntas.find(p => p.id === id_pregunta);
    return pregunta ? pregunta.enunciado : '';
  }
}
