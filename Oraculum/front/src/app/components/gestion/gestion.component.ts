import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioComponent } from './usuario/usuario.component';
import { CategoriaComponent } from './categoria/categoria.component';
import { PreguntaComponent } from './pregunta/pregunta.component';
import { RespuestaComponent } from './respuesta/respuesta.component';

@Component({
  selector: 'app-gestion',
  imports: [CommonModule, UsuarioComponent, CategoriaComponent, PreguntaComponent, RespuestaComponent],
  templateUrl: './gestion.component.html',
})
export class GestionComponent {
  menuItems = [
    { label: 'Usuarios', component: 'usuario' },
    { label: 'Categorías', component: 'categoria' },
    { label: 'Preguntas', component: 'pregunta' },
    { label: 'Respuestas', component: 'respuesta' }
  ];

  activeComponent: string = 'usuario';

  setActiveComponent(component: string): void {
    this.activeComponent = component;
  }
}