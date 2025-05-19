import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/usuarios/registro/registro.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registro", component: RegistroComponent },
];
