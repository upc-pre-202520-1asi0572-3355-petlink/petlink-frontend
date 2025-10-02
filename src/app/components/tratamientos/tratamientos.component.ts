import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tratamiento, TratamientoService } from '../../services/tratamiento.service';

@Component({
  selector: 'app-tratamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tratamientos.component.html'
})
export class TratamientosComponent implements OnInit {
  tratamientos: Tratamiento[] = [];
  nuevo: Tratamiento = {
    mascotaId: 0,
    historialId: null,
    nombreTratamiento: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: null,
    estado: 'Activo'
  };

  constructor(private api: TratamientoService) {}

  ngOnInit(): void {
    console.log("TratamientosComponent iniciado ✅");
    this.cargar();
  }

  cargar() {
  console.log("Ejecutando cargar()...");
  this.api.listar().subscribe({
    next: (d) => {
      console.log("Tratamientos recibidos:", d);
      this.tratamientos = d;
    },
    error: (err) => {
      console.error("Error al cargar tratamientos:", err);
    }
  });
}

  guardar() {
    if (!this.nuevo.mascotaId || !this.nuevo.nombreTratamiento || !this.nuevo.fechaInicio) {
      alert('Completa los campos requeridos'); return;
    }
    this.api.crear(this.nuevo).subscribe(() => {
      this.nuevo = { mascotaId: 0, historialId: null, nombreTratamiento: '', descripcion: '', fechaInicio: '', fechaFin: null, estado: 'Activo' };
      this.cargar();
    });
  }

  finalizar(t: Tratamiento) {
    if (!t.id) return;
    this.api.cambiarEstado(t.id, 'Finalizado').subscribe(() => this.cargar());
  }

  suspender(t: Tratamiento) {
    if (!t.id) return;
    this.api.cambiarEstado(t.id, 'Suspendido').subscribe(() => this.cargar());
  }

  eliminar(t: Tratamiento) {
    if (!t.id) return;
    if (confirm('¿Eliminar tratamiento?')) {
      this.api.eliminar(t.id).subscribe(() => this.cargar());
    }
  }
}