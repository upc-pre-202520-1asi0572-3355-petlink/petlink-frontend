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

  // ---------------------------
  // VARIABLES PRINCIPALES
  // ---------------------------
  mascotasIoT: MonitoreoResponse[] = [];

  filtroNombre: string = '';
  filtroEstadoLED: string = '';

  mascotaSeleccionada: MonitoreoResponse | null = null;

  labels: string[] = [];
  ritmoCardiacoData: any[] = [];

  actividadData: any[] = [
    {
      data: [],
      label: 'Actividad',
      borderColor: 'blue',
      backgroundColor: 'rgba(0,0,255,0.3)'
    }
  ];

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };

  constructor(private api: MonitoreoService) { }

  ngOnInit(): void {
    this.cargarDatos();
    setInterval(() => this.cargarDatos(), 5000);
  }

  // ---------------------------
  // CARGAR LISTA
  // ---------------------------
  cargarDatos(): void {
    this.api.listar().subscribe({
      next: (data: MonitoreoResponse[]) => {
        this.mascotasIoT = data;
      },
      error: (err: any) => {
        console.error("Error cargando monitoreo:", err);
      }
    });
  }

  // ---------------------------
  // FILTROS
  // ---------------------------
  get mascotasFiltradas(): MonitoreoResponse[] {
    return this.mascotasIoT.filter(m => {
      const coincideNombre =
        this.filtroNombre.trim() === '' ||
        m.nombreMascota.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const coincideLED =
        this.filtroEstadoLED.trim() === '' ||
        m.estadoLED.toLowerCase() === this.filtroEstadoLED.toLowerCase();

      return coincideNombre && coincideLED;
    });
  }

  // ---------------------------
  // VER GRÁFICAS
  // ---------------------------
  verGraficas(m: MonitoreoResponse): void {
    this.mascotaSeleccionada = m;

    this.labels = ["10:00", "10:05", "10:10", "10:15", "10:20"];

    this.ritmoCardiacoData = [
      {
        data: [
          m.ritmoCardiaco - 10,
          m.ritmoCardiaco - 5,
          m.ritmoCardiaco,
          m.ritmoCardiaco + 5,
          m.ritmoCardiaco
        ],
        label: "Ritmo Cardiaco (bpm)",
        borderColor: "red",
        backgroundColor: "rgba(255,0,0,0.4)"
      }
    ];

    this.actividadData = [
      {
        data: [
          m.actividad - 2,
          m.actividad - 1,
          m.actividad,
          m.actividad + 1,
          m.actividad
        ],
        label: 'Actividad',
        borderColor: 'blue',
        backgroundColor: 'rgba(0,0,255,0.3)'
      }
    ];
  }

  cerrarGraficas(): void {
    this.mascotaSeleccionada = null;
  }

  // ---------------------------
  // ELIMINAR REGISTRO
  // ---------------------------
  eliminar(id: number): void {
    if (!confirm("¿Eliminar registro?")) return;

    this.api.eliminar(id).subscribe({
      next: () => this.cargarDatos(),
      error: (err: any) =>
        console.error("Error eliminando:", err)
    });
  }
}