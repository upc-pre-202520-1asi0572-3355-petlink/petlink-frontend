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
  mascotaSeleccionada: MonitoreoResponse | null = null;

  labels: string[] = [];
  ritmoCardiacoData: any[] = [];

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  filtroEstadoLED: string = '';

  actividadData: any[] = [
    {
      data: [],
      label: 'Actividad',
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.4)'
    }
  ];

  constructor(private api: MonitoreoService) { }

  ngOnInit(): void {
    this.cargarDatos();
    setInterval(() => this.cargarDatos(), 5000);
  }

  cargarDatos() {
    this.api.listar().subscribe({
      next: (data) => this.mascotasIoT = data,
      error: (err) => console.error("Error cargando monitoreo:", err)
    });
  }

  get mascotasFiltradas() {
    return this.mascotasIoT.filter(m =>
      m.nombreMascota.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  verGraficas(m: MonitoreoResponse) {
    this.mascotaSeleccionada = m;

    this.labels = ["10:00", "10:05", "10:10", "10:15", "10:20"];

    this.ritmoCardiacoData = [
      {
        data: [m.ritmoCardiaco - 10, m.ritmoCardiaco - 5, m.ritmoCardiaco, m.ritmoCardiaco + 5, m.ritmoCardiaco],
        label: "Ritmo Cardiaco (bpm)",
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.4)"
      }
    ];
  }

  cerrarGraficas() {
    this.mascotaSeleccionada = null;
  }

  eliminar(id: number) {
    if (!confirm("¿Eliminar registro?")) return;

    this.api.eliminar(id).subscribe({
      next: () => this.cargarDatos(),
      error: (err) => console.error("Error eliminando:", err)
    });
  }
}