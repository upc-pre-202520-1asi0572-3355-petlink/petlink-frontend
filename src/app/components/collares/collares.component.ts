import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollarService, CollarResponse } from '../../services/collar.service';

@Component({
  selector: 'app-collares',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collares.component.html',
  styleUrls: ['./collares.component.css']
})
export class CollaresComponent implements OnInit {

  collares: CollarResponse[] = [];
  loading = true;
  error = '';

  constructor(private collarService: CollarService) {}

  ngOnInit(): void {
    this.cargarCollares();
  }

  cargarCollares() {
    this.collarService.listar().subscribe({
      next: (data) => {
        this.collares = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar collares: ' + (err.message || 'Error desconocido');
        this.loading = false;
      }
    });
  }

  getEstadoBadgeClass(estado: string): string {
    return estado === 'DISPONIBLE' ? 'bg-success' : 'bg-warning text-dark';
  }

  get collaresDisponibles(): number {
    return this.collares.filter(c => c.estado === 'DISPONIBLE').length;
  }

  get collaresOcupados(): number {
    return this.collares.filter(c => c.estado === 'OCUPADO').length;
  }
}