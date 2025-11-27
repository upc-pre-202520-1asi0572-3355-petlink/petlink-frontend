import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MonitoreoService, MonitoreoResponse } from '../../services/monitoreo.service';

@Component({
  selector: 'app-monitoreo-iot',
  standalone: true,
  imports: [CommonModule, FormsModule, NgChartsModule],
  templateUrl: './monitoreo-iot.component.html',
  styleUrls: ['./monitoreo-iot.component.css']
})
export class MonitoreoIoTComponent implements OnInit {

  mascotasIoT: MonitoreoResponse[] = [];

  filtroNombre: string = '';
  filtroEstadoLED: string = '';

  mascotaSeleccionada: MonitoreoResponse | null = null;

  labels: string[] = [];
  ritmoCardiacoData: ChartConfiguration<'line'>['data']['datasets'] = [];
  actividadData: any[] = [];
  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  constructor(private api: MonitoreoService) { }

  ngOnInit(): void {
    this.cargarDatos();
    setInterval(() => this.cargarDatos(), 5000);
  }

  cargarDatos() {
    this.api.listar().subscribe({
      next: (data) => {
        this.mascotasIoT = data;
      },
      error: (err) => console.error('Error cargando monitoreo IoT:', err)
    });
  }

  get mascotasFiltradas() {
    return this.mascotasIoT.filter(m =>
      this.filtroNombre === '' ||
      m.nombreMascota.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  verGraficas(m: MonitoreoResponse) {
    this.mascotaSeleccionada = m;

    const historico = [
      { fecha: '10:00', bpm: 120 },
      { fecha: '10:05', bpm: 130 },
      { fecha: '10:10', bpm: 125 },
      { fecha: '10:15', bpm: 140 },
      { fecha: '10:20', bpm: 135 },
      { fecha: '10:25', bpm: 128 }
    ];

    this.labels = historico.map(h => h.fecha);

    this.ritmoCardiacoData = [
      {
        data: historico.map(h => h.bpm),
        label: 'Ritmo Cardiaco (bpm)',
        borderColor: 'red',
        backgroundColor: 'rgba(255,0,0,0.4)'
      }
    ];
  }

  cerrarGraficas() {
    this.mascotaSeleccionada = null;
  }

  eliminar(id: number) {
    if (confirm('¿Seguro que deseas eliminar este registro?')) {
      this.api.eliminar(id).subscribe({
        next: () => this.cargarDatos(),
        error: (err) => console.error('Error eliminando monitoreo:', err)
      });
    }
  }
}