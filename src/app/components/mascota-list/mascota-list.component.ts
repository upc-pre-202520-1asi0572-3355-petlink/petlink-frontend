import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MascotaService, MascotaResponse } from '../../services/mascota.service';
import { CollarService, CollarResponse } from '../../services/collar.service';

@Component({
  selector: 'app-mascota-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mascota-list.component.html',
  styleUrls: ['./mascota-list.component.css']
})
export class MascotaListComponent implements OnInit {

  mascotas: MascotaResponse[] = [];
  collares: CollarResponse[] = [];
  collaresDisponibles: CollarResponse[] = [];
  
  loading = true;
  error = '';

  // Para modal de vincular collar
  mascotaSeleccionada: MascotaResponse | null = null;
  collarSeleccionado: number | null = null;

  constructor(
    private mascotaService: MascotaService,
    private collarService: CollarService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.loading = true;
    this.error = '';

    // Cargar mascotas
    this.mascotaService.listar().subscribe({
      next: (data) => {
        this.mascotas = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar mascotas';
        this.loading = false;
        console.error('Error cargando mascotas:', err);
      }
    });

    // Cargar collares disponibles
    this.collarService.listar().subscribe({
      next: (data) => {
        this.collares = data;
        this.collaresDisponibles = data.filter(c => c.estado === 'DISPONIBLE');
      },
      error: (err) => console.error('Error cargando collares:', err)
    });
  }

  // Cambiar estado internado
  toggleInternado(mascota: MascotaResponse) {
    const nuevoEstado = !mascota.internado;
    
    this.mascotaService.cambiarInternado(mascota.id, nuevoEstado).subscribe({
      next: (updated) => {
        mascota.internado = updated.internado;
      },
      error: (err) => {
        console.error('Error cambiando estado internado:', err);
        alert('Error al cambiar estado de internado');
      }
    });
  }

  // Abrir modal para vincular collar
  abrirModalVincular(mascota: MascotaResponse) {
    this.mascotaSeleccionada = mascota;
    this.collarSeleccionado = null;
  }

  cerrarModal() {
    this.mascotaSeleccionada = null;
    this.collarSeleccionado = null;
  }

  vincularCollar() {
    if (!this.mascotaSeleccionada || !this.collarSeleccionado) return;

    this.mascotaService.vincularCollar(this.mascotaSeleccionada.id, this.collarSeleccionado).subscribe({
      next: () => {
        alert('Collar vinculado exitosamente');
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error vinculando collar:', err);
        alert('Error al vincular collar');
      }
    });
  }

  desvincularCollar(mascota: MascotaResponse) {
    if (!confirm('¿Desvincular el collar de esta mascota?')) return;

    this.mascotaService.desvincularCollar(mascota.id).subscribe({
      next: () => {
        alert('Collar desvinculado');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error desvinculando collar:', err);
        alert('Error al desvincular collar');
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    switch (estado) {
      case 'ESTABLE': return 'bg-success';
      case 'EN_TRATAMIENTO': return 'bg-warning text-dark';
      case 'CRITICO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }

  formatEstado(estado: string): string {
    switch (estado) {
      case 'ESTABLE': return 'Estable';
      case 'EN_TRATAMIENTO': return 'En tratamiento';
      case 'CRITICO': return 'Crítico';
      default: return estado;
    }
  }
}