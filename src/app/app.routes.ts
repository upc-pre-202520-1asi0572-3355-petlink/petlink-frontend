import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MascotaListComponent } from './components/mascota-list/mascota-list.component';
import { MascotaFormComponent } from './components/mascota-form/mascota-form.component';
import { MonitoreoComponent } from './components/monitoreo/monitoreo.component';
import { CollaresComponent } from './components/collares/collares.component';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'mascotas', component: MascotaListComponent },
  { path: 'mascotas/registrar', component: MascotaFormComponent },
  { path: 'monitoreo/:id', component: MonitoreoComponent },
  { path: 'collares', component: CollaresComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];