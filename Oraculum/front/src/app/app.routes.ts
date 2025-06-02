import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/auth/registro/registro.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UsuarioComponent } from './components/gestion/usuario/usuario.component';
import { CategoriaComponent } from './components/gestion/categoria/categoria.component';
import { PreguntaComponent } from './components/gestion/pregunta/pregunta.component';
import { RespuestaComponent } from './components/gestion/respuesta/respuesta.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { InicioPartidaComponent } from './components/juego/inicio-partida/inicio-partida.component';
import { MotorJuegoComponent } from './components/juego/motor-juego/motor-juego.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registro", component: RegistroComponent },
    { path: "perfil", component: PerfilComponent },
    { path: "gestion", component: GestionComponent },
    { path: "gestion/usuarios", component: UsuarioComponent },
    { path: "gestion/categorias", component: CategoriaComponent },
    { path: "gestion/preguntas", component: PreguntaComponent },
    { path: "gestion/respuestas", component: RespuestaComponent },
    { path: "ranking", component: RankingComponent },
    { path: "jugar", component: InicioPartidaComponent },
    { path: "juego", component: MotorJuegoComponent },
];
