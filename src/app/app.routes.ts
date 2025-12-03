import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { HomeComponent } from './components/home/home.component';
import { MascotaListComponent } from './components/mascota-list/mascota-list.component';
import { MascotaFormComponent } from './components/mascota-form/mascota-form.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { CollaresComponent } from './components/collares/collares.component';
import { DashboardComponent } from './components/dashboard/dashboard';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  // Ruta pública
  { path: 'login', component: LoginComponent },

  // Rutas protegidas
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'mascotas', component: MascotaListComponent, canActivate: [authGuard] },
  { path: 'mascotas/registrar', component: MascotaFormComponent, canActivate: [authGuard] },
  { path: 'monitoreo/:id', component: MonitoreoComponent, canActivate: [authGuard] },
  { path: 'collares', component: CollaresComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  // Redirecciones
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];