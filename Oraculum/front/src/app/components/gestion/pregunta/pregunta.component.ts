import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pregunta } from '../../../models/Pregunta';
import { PreguntaService } from '../../../services/pregunta.service';
import { CategoriaService } from '../../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { Categoria } from '../../../models/Categoria';
import { AlertService } from '../../../services/alert.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pregunta',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pregunta.component.html',
  styleUrls: ['./pregunta.component.css']
})
export class PreguntaComponent implements OnInit {
  preguntas: Pregunta[] = [];
  preguntasFiltradas: Pregunta[] = [];
  categorias: Categoria[] = [];
  preguntaEditandoId: number | null = null;
  preguntaForm: FormGroup;
  mostrarFormulario: boolean = false;
  
  categoriaFiltro: string = '';
  dificultadFiltro: string = '';
  dificultades: string[] = ['heroica', 'divina'];
  
  get enunciadoControl(): FormControl {
    return this.preguntaForm.get('enunciado') as FormControl;
  }

  get pistaControl(): FormControl {
    return this.preguntaForm.get('pista') as FormControl;
  }

  get explicacionControl(): FormControl {
    return this.preguntaForm.get('explicacion') as FormControl;
  }

  get dificultadControl(): FormControl {
    return this.preguntaForm.get('dificultad') as FormControl;
  }

  get id_categoriaControl(): FormControl {
    return this.preguntaForm.get('id_categoria') as FormControl;
  }

  constructor(
    private preguntaService: PreguntaService,
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.preguntaForm = this.fb.group({
      id: [null],
      enunciado: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      pista: [''],
      explicacion: [''],
      dificultad: ['', Validators.required],
      id_categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPreguntas();
    this.cargarCategorias();
  }

  cargarPreguntas(): void {
    this.preguntaService.getAllPreguntas().subscribe(
      preguntas => {
        this.preguntas = preguntas;
        this.aplicarFiltros();
      }
    );
  }

  cargarCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe(
      categorias => this.categorias = categorias
    );
  }

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
    if (!this.mostrarFormulario) {
      this.cancelarEdicion();
    }
  }

  crearPregunta(): void {
    this.preguntaEditandoId = null;
    this.preguntaForm.reset();
    this.mostrarFormulario = true;
  }

  cancelarEdicion(): void {
    this.preguntaEditandoId = null;
    this.preguntaForm.reset();
    this.mostrarFormulario = false;
  }

  editarPregunta(pregunta: Pregunta): void {
    console.log('Editar pregunta:', pregunta);
    this.preguntaEditandoId = pregunta.id;
    this.preguntaForm.patchValue({
      enunciado: pregunta.enunciado,
      pista: pregunta.pista,
      explicacion: pregunta.explicacion,
      dificultad: pregunta.dificultad,
      id_categoria: pregunta.id_categoria
    });
    this.mostrarFormulario = true;
    this.toastService.showMessage('Formulario de edición abierto en la parte superior');
  }

  guardarCambios(): void {
    if (this.preguntaForm.valid) {
      if (this.preguntaEditandoId) {
        this.preguntaService.updatePregunta(this.preguntaEditandoId, this.preguntaForm.value)
          .subscribe({
            next: () => {
              this.toastService.showMessage('Pregunta actualizada correctamente');
              this.cargarPreguntas();
              this.cancelarEdicion();
            },
            error: (error) => {
              this.toastService.showMessage('Error al actualizar la pregunta');
              console.error('Error:', error);
            }
          });
      } else {
        this.preguntaService.createPregunta(this.preguntaForm.value)
          .subscribe({
            next: () => {
              this.toastService.showMessage('Pregunta creada correctamente');
              this.cargarPreguntas();
              this.cancelarEdicion();
            },
            error: (error) => {
              this.toastService.showMessage('Error al crear la pregunta');
              console.error('Error:', error);
            }
          });
      }
    }
  }

  async eliminarPregunta(id: number): Promise<void> {
    const result = await this.alertService.confirm('¿Estás seguro de que quieres eliminar esta pregunta? También se eliminarán todas sus respuestas asociadas.');
    if (result.isConfirmed) {
      this.preguntaService.deletePregunta(id).subscribe({
        next: () => {
          this.alertService.success('Pregunta y sus respuestas eliminadas correctamente');
          this.cargarPreguntas();
        },
        error: (error) => {
          this.alertService.error('Error al eliminar la pregunta');
          console.error('Error:', error);
        }
      });
    }
  }

  isEditing(id: number): boolean {
    return this.preguntaEditandoId === id;
  }

  getNombreCategoria(id_categoria: number): string {
    const categoria = this.categorias.find(c => c.id === id_categoria);
    return categoria ? categoria.nombre : '';
  }

  aplicarFiltros(): void {
    const idCategoria = this.categoriaFiltro ? Number(this.categoriaFiltro) : undefined;
    const dificultad = this.dificultadFiltro || undefined;
    
    if (!idCategoria && !dificultad) {
      this.preguntasFiltradas = this.preguntas;
    } else {
      this.preguntaService.getPreguntasfiltradas(idCategoria, dificultad).subscribe(
        preguntas => {
          this.preguntasFiltradas = preguntas;
        },
        error => {
          this.toastService.showMessage('Error al filtrar preguntas');
          console.error('Error:', error);
        }
      );
    }
  }
}