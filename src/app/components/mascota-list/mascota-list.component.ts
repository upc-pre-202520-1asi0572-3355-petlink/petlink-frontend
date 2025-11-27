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

  mascotaEdit: Mascota = {
    nombre: '',
    especie: '',
    edad: 0,
    estadoSalud: '',
    owner: '',
    raza: '',
    horaIngreso: '',
    internado: false,
    collarAsignado: null
  };

  constructor(private mascotaService: MascotaService) { }

  ngOnInit(): void {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe(data => {
      this.mascotas = data;
    });
  }

  eliminarMascota(id: number | undefined) {
    if (!id) return;

    if (confirm('¿Seguro que deseas eliminar esta mascota?')) {
      this.mascotaService.deleteMascota(id).subscribe({
        next: () => this.cargarMascotas(),
        error: (err) => console.error("Error al eliminar mascota:", err)
      });
    }
  }

  activarEdicion(m: Mascota) {
    if (!m.id) return;
    this.editMode[m.id] = true;

    // Clona los valores actuales
    this.mascotaEdit = { ...m };
  }

  guardarEdicion(id: number | undefined) {
    if (!id) return;

    this.mascotaService.updateMascota(id, this.mascotaEdit).subscribe({
      next: () => {
        this.editMode[id] = false;
        this.cargarMascotas();
      },
      error: (err) => console.error("Error al actualizar mascota:", err)
    });
  }

  cancelarEdicion(id: number | undefined) {
    if (!id) return;
    this.editMode[id] = false;
  }
}