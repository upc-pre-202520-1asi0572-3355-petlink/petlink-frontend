import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment';

export interface CollarResponse {
  id: number;
  code: string;
  estado: string; // DISPONIBLE, OCUPADO
  mascotaId: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class CollarService {
  private apiUrl = `${environment.apiUrl}/collares`;

  constructor(private http: HttpClient) {}

  // GET /api/collares - Listar todos los collares
  listar(): Observable<CollarResponse[]> {
    return this.http.get<CollarResponse[]>(this.apiUrl);
  }
}