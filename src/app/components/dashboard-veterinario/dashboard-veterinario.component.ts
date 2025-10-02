import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { DashboardService, DashboardSummary, Monitoreo } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-veterinario',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard-veterinario.component.html',
  styleUrls: ['./dashboard-veterinario.component.css']
})
export class DashboardVeterinarioComponent implements OnInit {
  summary: DashboardSummary = { totalMascotas: 0, criticos: 0, estables: 0, alertas: 0 };
  monitoreo: Monitoreo[] = [];

  chartType: 'doughnut' = 'doughnut';


  chartData: ChartData<'doughnut'> = {
    labels: ['Críticos', 'Estables', 'Alertas'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#ef4444', '#22c55e', '#facc15']
      }
    ]
  };

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor(private api: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.api.getSummary().subscribe(data => {
      this.summary = data;
      this.chartData = {
        labels: ['Críticos', 'Estables', 'Alertas'],
        datasets: [
          {
            data: [data.criticos, data.estables, data.alertas],
            backgroundColor: ['#ef4444', '#22c55e', '#facc15']
          }
        ]
      };
    });

    this.api.getMonitoreo().subscribe(data => {
      this.monitoreo = data;
    });
  }
}
