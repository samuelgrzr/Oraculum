import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Categoria } from '../../models/Categoria';
import { CategoriaService } from '../../services/categoria.service';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-categoria',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: Categoria[] = [];
  categoriaEditandoId: number | null = null;
  categoriaForm: FormGroup;
  mostrarFormulario: boolean = false;
  
  get nombreControl(): FormControl {
    return this.categoriaForm.get('nombre') as FormControl;
  }

  constructor(
    private categoriaService: CategoriaService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private alertService: AlertService
  ) {
    this.categoriaForm = this.fb.group({
      id: [null],
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
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

  crearCategoria(): void {
    this.categoriaEditandoId = null;
    this.categoriaForm.reset();
    this.mostrarFormulario = true;
  }

  cancelarEdicion(): void {
    this.categoriaEditandoId = null;
    this.categoriaForm.reset();
    this.mostrarFormulario = false;
  }

  editarCategoria(categoria: Categoria): void {
    this.categoriaEditandoId = categoria.id;
    this.categoriaForm.patchValue({
      nombre: categoria.nombre
    });
  }

  guardarCambios(): void {
    if (this.categoriaForm.valid) {
      if (this.categoriaEditandoId) {
        this.categoriaService.updateCategoria(this.categoriaEditandoId, this.categoriaForm.value)
          .subscribe({
            next: () => {
              this.toastService.showMessage('Categoría actualizada correctamente');
              this.cargarCategorias();
              this.cancelarEdicion();
            },
            error: (error) => {
              this.toastService.showMessage('Error al actualizar la categoría');
              console.error('Error:', error);
            }
          });
      } else {
        this.categoriaService.createCategoria(this.categoriaForm.value)
          .subscribe({
            next: () => {
              this.toastService.showMessage('Categoría creada correctamente');
              this.cargarCategorias();
              this.cancelarEdicion();
            },
            error: (error) => {
              this.toastService.showMessage('Error al crear la categoría');
              console.error('Error:', error);
            }
          });
      }
    }
  }

  async eliminarCategoria(id: number): Promise<void> {
    const result = await this.alertService.confirm('¿Estás seguro de que quieres eliminar esta categoría?');
    if (result.isConfirmed) {
      this.categoriaService.deleteCategoria(id).subscribe({
        next: () => {
          this.alertService.success('Categoría eliminada correctamente');
          this.cargarCategorias();
        },
        error: (error) => {
          this.alertService.error('Error al eliminar la categoría');
          console.error('Error:', error);
        }
      });
    }
  }

  isEditing(id: number): boolean {
    return this.categoriaEditandoId === id;
  }
}
