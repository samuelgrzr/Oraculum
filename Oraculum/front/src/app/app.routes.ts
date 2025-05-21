import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { PerfilComponent } from './components/perfil/perfil.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registro", component: RegistroComponent },
    { path: "usuarios", component: UsuarioComponent },
    { path: "perfil", component: PerfilComponent },
];
