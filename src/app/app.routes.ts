import { Routes } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { Usuario } from './usuario/usuario';
import { LoginUsuario } from './login-usuario/login-usuario';
import { Registro } from './registro/registro';
import { InfoTurno } from './info-turno/info-turno';

export const routes: Routes = [
    { path: 'usuario', component: Usuario },
    { path: 'usuario/login', component: LoginUsuario },
    { path: 'registro', component: Registro },
    { path: 'info', component: InfoTurno },
    { path: '', component: MainPage },
    { path: '**', redirectTo: '' },
];
