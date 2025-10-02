import { Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { MascotaListComponent } from './components/mascota-list/mascota-list.component';
import { MascotaFormComponent } from './components/mascota-form/mascota-form.component';
import { HistoriaClinicaComponent } from './components/historia-clinica/historia-clinica.component';
import { TratamientosComponent } from './components/tratamientos/tratamientos.component';
import { MonitoreoIoTComponent } from './components/monitoreo-iot/monitoreo-iot.component';
import { DashboardVeterinarioComponent } from './components/dashboard-veterinario/dashboard-veterinario.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { authGuard } from './auth/guards/auth.guard';
import { AuthService } from './auth/services/auth.service';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
  // Login y registro primero
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Recuperar contraseña
  {path: 'recover', loadComponent: () => import('./auth/recover/recover.component').then(m => m.RecoverComponent)},

  // Inicio (solo accesible si está logueado)
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },

  // EP02 - Mascotas
  { path: 'mascotas', component: MascotaListComponent, canActivate: [authGuard] },
  { path: 'mascotas/registrar', component: MascotaFormComponent, canActivate: [authGuard] },

  // EP03 - Historias clínicas y tratamientos
  { path: 'historias', component: HistoriaClinicaComponent, canActivate: [authGuard] },
  { path: 'tratamientos', component: TratamientosComponent, canActivate: [authGuard] },

  // EP04 - Monitoreo IoT
  { path: 'monitoreo', component: MonitoreoIoTComponent, canActivate: [authGuard] },

  // EP08 - Dashboard veterinario
  { path: 'dashboard', component: DashboardVeterinarioComponent, canActivate: [authGuard] },

  // EP06 - Administración
  { path: 'usuarios', component: UsuariosComponent, canActivate: [authGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate: [authGuard] },

  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];