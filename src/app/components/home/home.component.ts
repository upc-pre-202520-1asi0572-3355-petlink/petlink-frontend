import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'; // 🔹 agrega Router aquí
import { AuthService } from '../../auth/services/auth.service';

import { MascotaFormComponent } from '../mascota-form/mascota-form.component';
import { MascotaListComponent } from '../mascota-list/mascota-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, MascotaFormComponent, MascotaListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  showForm = false;
  totalMascotas = 5;
  totalCitas = 2;
  totalTratamientos = 3;
  activeTab: string = 'home';

  constructor(
    private renderer: Renderer2, 
    public auth: AuthService,
    private router: Router 
  ) {}

  toggleDarkMode() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
      this.renderer.removeClass(body, 'dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      this.renderer.addClass(body, 'dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']); 
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  mostrarFormulario() {
    this.showForm = true;
  }

  mostrarLista() {
    this.showForm = false;
  }

  onMascotaAgregada() {
    this.showForm = false;
    console.log('Mascota agregada → refrescar lista');
  }

    goTo(path: string) {
    this.router.navigate([path]);
  }
}