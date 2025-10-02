import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalMascotas: number;
  criticos: number;
  estables: number;
  alertas: number;
}

export interface Monitoreo {
  id: number;
  mascotaId: number;
  nombreMascota: string;
  ritmoCardiaco: number;
  actividad: number;
  ubicacion: string;
  estadoLED: string;
  ultimaActualizacion: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getMonitoreo(): Observable<Monitoreo[]> {
    return this.http.get<Monitoreo[]>(`${this.apiUrl}/monitoreo`);
  }
}