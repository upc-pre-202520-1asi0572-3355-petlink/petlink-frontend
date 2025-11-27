import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment.prod.js';

export interface Tratamiento {
  id?: number;
  mascotaId: number;
  historialId?: number | null;
  nombreMascota?: string;
  nombreTratamiento: string;
  descripcion?: string;
  fechaInicio: string;
  fechaFin?: string | null;
  estado: string;
}

@Injectable({ providedIn: 'root' })
export class TratamientoService {
  private apiUrl = `${environment.apiUrl}/tratamientos`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Tratamiento[]> {
    return this.http.get<Tratamiento[]>(this.apiUrl);
  }

  crear(data: Tratamiento): Observable<Tratamiento> {
    return this.http.post<Tratamiento>(this.apiUrl, data);
  }

  cambiarEstado(id: number, estado: string): Observable<Tratamiento> {
    return this.http.patch<Tratamiento>(
      `${this.apiUrl}/${id}/estado?estado=${estado}`, {}
    );
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}