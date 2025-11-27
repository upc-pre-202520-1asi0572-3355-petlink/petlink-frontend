import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HistoriaClinica, HistoriaClinicaService } from '../../services/historia-clinica.service';

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historia-clinica.component.html'
})
export class HistoriaClinicaComponent implements OnInit {
  historias: HistoriaClinica[] = [];

  nuevaHistoria: any = {
  mascotaId: 0,
  fecha: '',
  diagnostico: '',
  observaciones: ''
};


  constructor(private historiaService: HistoriaClinicaService) {}

  ngOnInit(): void {
    this.cargarHistorias();
  }

  cargarHistorias() {
    this.historiaService.getHistorias().subscribe(data => this.historias = data);
  }

  agregarHistoria() {
  if (!this.nuevaHistoria.mascotaId || !this.nuevaHistoria.diagnostico.trim()) {
    alert('Completa los campos obligatorios');
    return;
  }

  this.historiaService.addHistoria(this.nuevaHistoria).subscribe(() => {
    this.cargarHistorias();
    this.nuevaHistoria = { mascotaId: 0, fecha: '', diagnostico: '', observaciones: '' };
  });
}

  eliminarHistoria(id: number | undefined) {
    if (id && confirm('¿Seguro que deseas eliminar esta historia clínica?')) {
      this.historiaService.deleteHistoria(id).subscribe(() => this.cargarHistorias());
    }
  }
}