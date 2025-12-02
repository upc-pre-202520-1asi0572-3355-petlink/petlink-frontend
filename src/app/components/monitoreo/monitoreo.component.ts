import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MascotaService, MascotaMonitorResponse, HistorialLatidosResponse } from '../../services/mascota.service';

@Component({
  selector: 'app-monitoreo',
  standalone: true,
  imports: [CommonModule, RouterLink, NgChartsModule],
  templateUrl: './monitoreo.component.html',
  styleUrls: ['./monitoreo.component.css']
})
export class MonitoreoComponent implements OnInit, OnDestroy {

  mascotaId: number = 0;
  monitor: MascotaMonitorResponse | null = null;
  historial: HistorialLatidosResponse[] = [];
  
  loading = true;
  error = '';
  
  private intervalId: any;

  // Configuración del gráfico
  chartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Ritmo Cardíaco (BPM)',
      borderColor: '#dc3545',
      backgroundColor: 'rgba(220, 53, 69, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 40,
        max: 200,
        title: { display: true, text: 'BPM' }
      }
    }
  };

  constructor(
    private route: ActivatedRoute,
    private mascotaService: MascotaService
  ) {}

  ngOnInit(): void {
    this.mascotaId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarMonitoreo();
    
    // Actualizar cada 5 segundos
    this.intervalId = setInterval(() => this.cargarMonitoreo(), 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  cargarMonitoreo() {
    this.mascotaService.getMonitor(this.mascotaId).subscribe({
      next: (data) => {
        this.monitor = data;
        this.loading = false;
        this.actualizarGrafico(data.lastSixHeartRate);
      },
      error: (err) => {
        this.error = 'Error al cargar monitoreo: ' + (err.message || 'Error desconocido');
        this.loading = false;
      }
    });

    // Cargar historial completo
    this.mascotaService.getHistorial(this.mascotaId).subscribe({
      next: (data) => {
        this.historial = data;
      },
      error: (err) => console.error('Error cargando historial:', err)
    });
  }

  actualizarGrafico(bpmList: number[]) {
    const labels = bpmList.map((_, i) => `#${i + 1}`);
    
    this.chartData = {
      labels: labels,
      datasets: [{
        data: bpmList,
        label: 'Ritmo Cardíaco (BPM)',
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.2)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  getEstadoSaludClass(): string {
    if (!this.monitor) return '';
    switch (this.monitor.estadoSalud) {
      case 'ESTABLE': return 'text-success';
      case 'EN_TRATAMIENTO': return 'text-warning';
      case 'CRITICO': return 'text-danger';
      default: return '';
    }
  }

  getBpmClass(): string {
    if (!this.monitor?.currentHeartRate) return '';
    const bpm = this.monitor.currentHeartRate;
    if (bpm < 60 || bpm > 160) return 'text-danger fw-bold';
    if (bpm < 70 || bpm > 140) return 'text-warning';
    return 'text-success';
  }
}