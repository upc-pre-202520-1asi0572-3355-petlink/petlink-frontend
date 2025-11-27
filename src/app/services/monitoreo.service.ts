import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod.js';

export interface MonitoreoResponse {
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

  listar(): Observable<MonitoreoResponse[]> {
    return this.http.get<MonitoreoResponse[]>(`${this.apiUrl}/all`);
  }


  recibirDatos(data: any) {
    return this.http.post(`${this.apiUrl}/receive`, data);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}