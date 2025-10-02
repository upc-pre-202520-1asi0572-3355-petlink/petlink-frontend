import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HistoriaClinica {
  id?: number;
  fecha: string;
  diagnostico: string;
  observaciones: string;
  nombreMascota: string; 
}

@Injectable({
  providedIn: 'root'
})
export class HistoriaClinicaService {
  private apiUrl = 'http://localhost:8080/api/historiales'; 

  constructor(private http: HttpClient) {}

  getHistorias(): Observable<HistoriaClinica[]> {
    return this.http.get<HistoriaClinica[]>(this.apiUrl);
  }

  addHistoria(historia: HistoriaClinica): Observable<HistoriaClinica> {
    return this.http.post<HistoriaClinica>(this.apiUrl, historia);
  }

  deleteHistoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}