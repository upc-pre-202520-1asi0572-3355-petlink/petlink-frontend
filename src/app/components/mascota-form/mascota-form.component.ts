import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService, Mascota } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascota-form.component.html',
  styleUrls: ['./mascota-form.component.css']
})
export class MascotaFormComponent {
  mascota: Mascota = { nombre: '', especie: '', edad: 0, estadoSalud: '' };

  @Output() mascotaAgregada = new EventEmitter<void>();

  constructor(private mascotaService: MascotaService) {}

  agregarMascota() {
    this.mascotaService.addMascota(this.mascota).subscribe({
      next: () => {
        alert('Mascota registrada exitosamente');
        this.mascotaAgregada.emit(); // Notifica al padre que hay que recargar
        this.mascota = { nombre: '', especie: '', edad: 0, estadoSalud: '' };
      },
      error: (err) => {
        console.error('Error al registrar mascota:', err);
        alert('Ocurrió un error al registrar la mascota');
      }
    });
  }
}