import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService, Mascota } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascota-list.component.html',
  styleUrls: ['./mascota-list.component.css']
})
export class MascotaListComponent implements OnInit {
  mascotas: Mascota[] = [];
  editMode: { [key: number]: boolean } = {};
  mascotaEdit: Mascota = { nombre: '', especie: '', edad: 0, estadoSalud: '' };

  constructor(private mascotaService: MascotaService) {}

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe(data => {
      this.mascotas = data;
    });
  }

  eliminarMascota(id: number | undefined) {
  if (id && confirm('¿Seguro que deseas eliminar esta mascota?')) {
    this.mascotaService.deleteMascota(id).subscribe({
      next: () => {
        this.mascotas = this.mascotas.filter(m => m.id !== id);
      },
      error: (err) => {
        console.error('Error al eliminar mascota:', err);
        alert('No se pudo eliminar la mascota');
      }
    });
  }
}

 activarEdicion(mascota: Mascota) {
  if (mascota.id !== undefined) {
    this.editMode[mascota.id] = true;
    this.mascotaEdit = { ...mascota };
  }
}


guardarEdicion(id: number | undefined) {
  if (id) {
    this.mascotaService.updateMascota(id, this.mascotaEdit).subscribe({
      next: () => {
        this.editMode[id] = false;
        this.cargarMascotas();
      },
      error: (err) => {
        console.error('Error al actualizar mascota:', err);
        alert('No se pudo actualizar la mascota');
      }
    });
  }
}

  cancelarEdicion(id: number | undefined) {
    if (id) {
      this.editMode[id] = false;
    }
  }
}