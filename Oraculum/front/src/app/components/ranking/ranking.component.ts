import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { ToastService } from '../../services/toast.service';

interface RankingUsuario {
  nombre: string;
  puntuacion: number;
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  usuarios: RankingUsuario[] = [];

  constructor(private usuarioService: UsuarioService, private toastService: ToastService) {}

  ngOnInit() {
    this.cargarRanking();
  }

  cargarRanking() {
    this.usuarioService.getRanking().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios.slice(0, 12);
      },
      error: (error) => {
        console.error('Error al cargar el ranking:', error);
        this.toastService.showMessage('Error al cargar el ranking');
      }
    });
  }
}