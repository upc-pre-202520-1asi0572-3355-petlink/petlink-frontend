import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService, Mascota } from '../../services/mascota.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment.prod';

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
  collares: any[] = [];

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

  constructor(
    private mascotaService: MascotaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarMascotas();
    this.cargarCollares();
  }

  cargarMascotas() {
    this.mascotaService.getMascotas().subscribe(data => {
      this.mascotas = data;
    });
  }

  cargarCollares() {
    this.http.get(`${environment.apiUrl}/collare/disponibles`)
      .subscribe((data: any) => this.collares = data);
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

    // Si collarAsignado es un objeto (viene del backend), extraer solo el ID
    if (this.mascotaEdit.collarAsignado && typeof this.mascotaEdit.collarAsignado === 'object') {
      this.mascotaEdit.collarAsignado = (this.mascotaEdit.collarAsignado as any).id;
    }
  }

  guardarEdicion(id: number | undefined) {
    if (!id) return;

    // Determinar collarId e internado basado en collarAsignado
    const collarId = this.mascotaEdit.collarAsignado !== null && this.mascotaEdit.collarAsignado !== undefined
      ? this.mascotaEdit.collarAsignado
      : null;

    const internado = collarId !== null;

    // Transformar el objeto para enviar collarId y establecer internado automáticamente
    const requestBody = {
      ...this.mascotaEdit,
      collarId: collarId,
      internado: internado
    };

    // Remover collarAsignado del request body (el backend espera collarId)
    delete (requestBody as any).collarAsignado;

    console.log('Request body a enviar:', requestBody);

    this.mascotaService.updateMascota(id, requestBody as any).subscribe({
      next: () => {
        this.editMode[id] = false;
        this.cargarMascotas();
        this.cargarCollares(); // Recargar collares disponibles después de actualizar
      },
      error: (err) => console.error("Error al actualizar mascota:", err)
    });
  }

  cancelarEdicion(id: number | undefined) {
    if (!id) return;
    this.editMode[id] = false;
  }
}