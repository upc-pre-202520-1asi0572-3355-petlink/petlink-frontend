import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MascotaService, MascotaCreateRequest } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascota-form.component.html',
  styleUrls: ['./mascota-form.component.css']
})
export class MascotaFormComponent {

  mascota: MascotaCreateRequest = {
    nombre: '',
    especie: 'Perro',
    edad: 0,
    estadoSalud: 'ESTABLE',
    raza: '',
    horaIngresa: ''
  };

  loading = false;
  error = '';

  constructor(
    private mascotaService: MascotaService,
    private router: Router
  ) {}

  guardar() {
    if (!this.mascota.nombre || !this.mascota.horaIngresa) {
      this.error = 'Nombre y hora de ingreso son requeridos';
      return;
    }

    this.loading = true;
    this.error = '';

    this.mascotaService.crearMascota(this.mascota).subscribe({
      next: () => {
        alert('Mascota registrada exitosamente');
        this.router.navigate(['/mascotas']);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al registrar mascota: ' + (err.message || 'Error desconocido');
      }
    });
  }
}