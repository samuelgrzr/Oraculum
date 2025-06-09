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
import { AudienciaComponent } from './components/audiencia/audiencia.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "registro", component: RegistroComponent },
    { path: "perfil", component: PerfilComponent, canActivate: [authGuard] },
    { path: "gestion", component: GestionComponent, canActivate: [adminGuard] },
    { path: "gestion/usuarios", component: UsuarioComponent, canActivate: [adminGuard] },
    { path: "gestion/categorias", component: CategoriaComponent, canActivate: [adminGuard] },
    { path: "gestion/preguntas", component: PreguntaComponent, canActivate: [adminGuard] },
    { path: "gestion/respuestas", component: RespuestaComponent, canActivate: [adminGuard] },
    { path: "ranking", component: RankingComponent },
    { path: "jugar", component: InicioPartidaComponent },
    { path: "juego", component: MotorJuegoComponent },
    { path: 'audiencia', component: AudienciaComponent }
];
