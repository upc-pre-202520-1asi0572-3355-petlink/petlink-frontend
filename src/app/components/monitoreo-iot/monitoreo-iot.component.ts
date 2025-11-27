import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Monitoreo, MonitoreoService } from '../../services/monitoreo.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-monitoreo-iot',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './monitoreo-iot.component.html',
  styleUrls: ['./monitoreo-iot.component.css']
})
export class MonitoreoIoTComponent implements OnInit {
  mascotasIoT: Monitoreo[] = [];

  // Filtros
  filtroNombre: string = '';
  filtroEstadoLED: string = '';

  // Gráfico
  mascotaSeleccionada: Monitoreo | null = null;
  labels: string[] = [];
  ritmoCardiacoData: ChartConfiguration<'line'>['data']['datasets'] = [];
  actividadData: ChartConfiguration<'line'>['data']['datasets'] = [];
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    }
  };

  constructor(private api: MonitoreoService) {}

  ngOnInit(): void {
    this.cargarDatos();
    setInterval(() => this.cargarDatos(), 5000);
  }

  cargarDatos() {
    this.api.listar().subscribe({
      next: (data) => this.mascotasIoT = data,
      error: (err) => console.error("Error cargando monitoreo IoT:", err)
    });
  }

  // Aplica filtros
  get mascotasFiltradas() {
    return this.mascotasIoT.filter(m =>
      (this.filtroNombre === '' || m.nombreMascota.toLowerCase().includes(this.filtroNombre.toLowerCase())) &&
      (this.filtroEstadoLED === '' || m.estadoLED === this.filtroEstadoLED)
    );
  }

  // Abre el modal con gráficas
  verGraficas(m: Monitoreo) {
    this.mascotaSeleccionada = m;

    const historico = [
      { fecha: '10:00', ritmo: 120, act: 60 },
      { fecha: '10:05', ritmo: 130, act: 65 },
      { fecha: '10:10', ritmo: 125, act: 70 },
      { fecha: '10:15', ritmo: 140, act: 55 },
      { fecha: '10:20', ritmo: 135, act: 80 },
      { fecha: '10:25', ritmo: 128, act: 75 }
    ];

    this.labels = historico.map(h => h.fecha);
    this.ritmoCardiacoData = [
      { data: historico.map(h => h.ritmo), label: 'Ritmo Cardíaco (bpm)', borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.3)' }
    ];
    this.actividadData = [
      { data: historico.map(h => h.act), label: 'Actividad (%)', borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.3)' }
    ];
  }

  cerrarGraficas() {
    this.mascotaSeleccionada = null;
  }

    eliminar(id: number) {
    if (confirm("¿Seguro que deseas eliminar este registro de monitoreo?")) {
      this.api.eliminar(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => console.error("Error eliminando monitoreo:", err)
      });
    }
  }
}