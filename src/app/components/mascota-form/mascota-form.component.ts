import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MascotaService } from '../../services/mascota.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment.prod';

@Component({
  selector: 'app-mascota-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascota-form.component.html',
  styleUrls: ['./mascota-form.component.css']
})
export class MascotaFormComponent implements OnInit {

  mascota: any = {
    nombre: '',
    especie: '',
    edad: 0,
    estadoSalud: '',
    owner: '',
    raza: '',
    horaIngreso: '',
    internado: false,
    collarAsignado: null
  };

  collares: any[] = [];

  constructor(
    private service: MascotaService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get(`${environment.apiUrl}/collare/disponibles`)
      .subscribe((data: any) => this.collares = data);
  }

  guardar() {
    this.service.addMascota(this.mascota).subscribe(() => {
      alert('Mascota registrada exitosamente');

      this.mascota = {
        nombre: '',
        especie: '',
        edad: 0,
        estadoSalud: '',
        owner: '',
        raza: '',
        horaIngreso: '',
        internado: false,
        collarAsignado: null
      };
    });
  }
}