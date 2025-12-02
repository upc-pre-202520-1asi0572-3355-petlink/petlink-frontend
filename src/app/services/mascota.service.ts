import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface MascotaResponse {
  id: number;
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  raza: string;
  internado: boolean;
  horaIngresa: string;
  collarId: number | null;
}

export interface MascotaCreateRequest {
  nombre: string;
  especie: string;
  edad: number;
  estadoSalud: string;
  raza: string;
  horaIngresa: string;
}

export interface MascotaMonitorResponse {
  nombre: string;
  edad: number;
  raza: string;
  horaIngresa: string;
  currentHeartRate: number | null;
  estadoSalud: string;
  lastSixHeartRate: number[];
}

export interface HistorialLatidosResponse {
  tiempo: string;
  bpm: number;
}

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private apiUrl = `${environment.apiUrl}/mascotas`;

  constructor(private http: HttpClient) { }

  // GET /api/mascotas - Listar todas las mascotas
  listar(): Observable<MascotaResponse[]> {
    return this.http.get<MascotaResponse[]>(this.apiUrl);
  }

  // GET /api/mascotas/{id} - Obtener mascota por ID
  obtenerPorId(id: number): Observable<MascotaResponse> {
    return this.http.get<MascotaResponse>(`${this.apiUrl}/${id}`);
  }

  // POST /api/mascotas - Crear mascota
  crear(mascota: MascotaCreateRequest): Observable<MascotaResponse> {
    return this.http.post<MascotaResponse>(this.apiUrl, mascota);
  }

  // GET /api/mascotas/{id}/monitor - Monitorear mascota
  getMonitor(id: number): Observable<MascotaMonitorResponse> {
    return this.http.get<MascotaMonitorResponse>(`${this.apiUrl}/${id}/monitor`);
  }

  // PUT /api/mascotas/{id}/internado - Cambiar estado internado
  cambiarInternado(id: number, internado: boolean): Observable<MascotaResponse> {
    return this.http.put<MascotaResponse>(`${this.apiUrl}/${id}/internado`, { internado });
  }

  // PUT /api/mascotas/{idMascota}/collar/{idCollar} - Vincular collar
  vincularCollar(idMascota: number, idCollar: number): Observable<MascotaResponse> {
    return this.http.put<MascotaResponse>(`${this.apiUrl}/${idMascota}/collar/${idCollar}`, {});
  }

  // PUT /api/mascotas/{idMascota}/collar/desvincular - Desvincular collar
  desvincularCollar(idMascota: number): Observable<MascotaResponse> {
    return this.http.put<MascotaResponse>(`${this.apiUrl}/${idMascota}/collar/desvincular`, {});
  }

  // GET /api/mascotas/{id}/historial - Obtener historial de latidos
  getHistorial(id: number): Observable<HistorialLatidosResponse[]> {
    return this.http.get<HistorialLatidosResponse[]>(`${this.apiUrl}/${id}/historial`);
  }

  crearMascota(mascota: MascotaCreateRequest): Observable<MascotaResponse> {
    return this.http.post<MascotaResponse>(this.apiUrl, mascota);
  }
}