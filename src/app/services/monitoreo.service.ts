import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod.js';

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
export class MonitoreoService {
  private apiUrl = `${environment.apiUrl}/monitoreo`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Monitoreo[]> {
    return this.http.get<Monitoreo[]>(this.apiUrl);
  }

  listarPorMascota(mascotaId: number): Observable<Monitoreo[]> {
    return this.http.get<Monitoreo[]>(`${this.apiUrl}/${mascotaId}`);
  }

  listarUltimos(): Observable<Monitoreo[]> {
    return this.http.get<Monitoreo[]>(`${this.apiUrl}/ultimo`);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}