import { Routes } from '@angular/router';
import { MainPage } from './components/main-page/main-page';
import { Usuario } from './components/usuario/usuario';
import { LoginUsuario } from './components/login-usuario/login-usuario';
import { Registro } from './components/registro/registro';
import { InfoTurno } from './components/info-turno/info-turno';
import { LoginAdmin } from './components/login-admin/login-admin';
import { Dashboard } from './components/dashboard/dashboard';
import { CrudTurnos } from './components/crud-turnos/crud-turnos';

export const routes: Routes = [
    { path: 'usuario', component: Usuario },
    { path: 'usuario/login', component: LoginUsuario },
    { path: 'registro', component: Registro },
    { path: 'registro/:id', component: Registro },
    { path: 'imprimir-ticket/:id/:impresion', component: Registro, outlet: 'print' },
    { path: 'admin', component: LoginAdmin },
    { path: 'dashboard', component: Dashboard },
    { path: 'gestion', component: CrudTurnos },
    { path: 'info/:id', component: InfoTurno },
    { path: '', component: MainPage },
    { path: '**', redirectTo: '' },
];
