import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { PreguntaComponent } from './components/pregunta/pregunta.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registro", component: RegistroComponent },
    { path: "perfil", component: PerfilComponent },
    { path: "usuarios", component: UsuarioComponent },
    { path: "categorias", component: CategoriaComponent },
    { path: "preguntas", component: PreguntaComponent },
];
