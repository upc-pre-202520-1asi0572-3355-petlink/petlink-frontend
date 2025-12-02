import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { DashboardService, DashboardResponse } from '../../services/dashboard.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  dashboard: DashboardResponse | null = null;
  loading = true;
  error = '';

  // Configuración del gráfico de dona
  chartData: ChartData<'doughnut'> = {
    labels: ['Críticos', 'Estables', 'Alertas'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#dc3545', '#28a745', '#ffc107']
    }]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.loading = true;
    this.dashboardService.obtener().subscribe({
      next: (data) => {
        this.dashboard = data;
        this.actualizarGrafico(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el dashboard';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  actualizarGrafico(data: DashboardResponse) {
    this.chartData = {
      labels: ['Críticos', 'Estables', 'Alertas'],
      datasets: [{
        data: [data.criticos, data.estables, data.alertas],
        backgroundColor: ['#dc3545', '#28a745', '#ffc107']
      }]
    };
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Verde': return 'badge bg-success';
      case 'Amarillo': return 'badge bg-warning text-dark';
      case 'Rojo': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
  
  getEstadoLabel(estado: string): string {
    switch (estado) {
      case 'Verde': return 'Normal';
      case 'Amarillo': return 'Alerta';
      case 'Rojo': return 'Crítico';
      default: return 'Desconocido';
    }
  }
  

  formatFecha(fecha: string | null): string {
    if (!fecha) return 'Sin datos';
    try {
      const date = new Date(fecha);
      return date.toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return fecha;
    }
  }
}