import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Categoria } from '../../models/Categoria';

@Component({
  selector: 'app-inicio-partida',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inicio-partida.component.html',
  styleUrls: ['./inicio-partida.component.css']
})
export class InicioPartidaComponent implements OnInit {
  partidaForm: FormGroup;
  categorias: Categoria[] = [];
  modoJuego: string[] = ['aventura', 'prueba', 'contrarreloj', 'infinito'];
  dificultades: string[] = ['mortal', 'heroica', 'divina'];
  
  descripcionesModos: { [key: string]: string } = {
    'aventura': 'Demuestra tu sabiduría en 10 preguntas',
    'prueba': 'La propia Atenea pondrá a prueba tus conocimientos',
    'contrarreloj': 'Supera los obstáculos de Cronos para avanzar',
    'infinito': 'Apolo juzgará si eres digno de convertirte en el Oráculo'
  };
  
  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.partidaForm = this.fb.group({
      modo_juego: ['', Validators.required],
      dificultad: ['', Validators.required],
      id_categoria: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  cargarCategorias(): void {
    this.categoriaService.getAllCategorias().subscribe({
      next: (categorias) => {
        this.categorias = categorias;
      },
      error: (error) => {
        this.toastService.showMessage('Error al cargar las categorías');
        console.error('Error:', error);
      }
    });
  }

  iniciarPartida(): void {
    if (this.partidaForm.valid) {
      const usuario = this.authService.currentUserValue;
      if (!usuario) {
        this.toastService.showMessage('Debes iniciar sesión para jugar');
        return;
      }

      const datosPartida = {
        ...this.partidaForm.value,
        id_usuario: usuario.id
      };

      localStorage.setItem('configuracionPartida', JSON.stringify(datosPartida));
      
      this.router.navigate(['/']);
    }
  }
}
