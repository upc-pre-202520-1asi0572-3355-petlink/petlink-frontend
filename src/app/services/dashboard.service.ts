import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface MascotaMonitoreoDTO {
  id: number;
  nombre: string;
  ritmoCardiaco: number | null;
  estadoLED: string;
  ultimaActualizacion: string | null;
}

export interface DashboardResponse {
  total: number;
  criticos: number;
  estables: number;
  alertas: number;
  mascotas: MascotaMonitoreoDTO[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  obtener(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }
}