import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod.js';

export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  owner: string;
  raza: string;
  horaIngreso: string;
  internado: boolean;
  collarAsignado: any;
}

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = `${environment.apiUrl}/mascotas`;

  constructor(private http: HttpClient) { }

  getMascotas(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl);
  }

  addMascota(mascota: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(`${this.apiUrl}`, mascota);
  }

  updateMascota(id: number, mascota: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/${id}`, mascota);
  }

  deleteMascota(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  internar(idMascota: number, idCollar: number) {
    return this.http.post(`${this.apiUrl}/${idMascota}/internar/${idCollar}`, {});
  }

  alta(idMascota: number) {
    return this.http.post(`${this.apiUrl}/${idMascota}/alta`, {});
  }

  getPulsos(idMascota: number) {
    return this.http.get(`/api/monitoreo/mascota/${idMascota}`);
  }
}