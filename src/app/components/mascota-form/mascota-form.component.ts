import { Component, OnInit } from '@angular/core';
import { MascotaService } from '../../services/mascota.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mascota-form',
  templateUrl: './mascota-form.component.html'
})
export class MascotaFormComponent implements OnInit {

  mascota: any = {
    nombre: '',
    especie: '',
    edad: 0,
    estadoSalud: '',
    owner: '',
    raza: '',
    internado: false,
    collarAsignado: null
  };

  collares: any[] = [];

  constructor(private service: MascotaService, private http: HttpClient) { }

  ngOnInit() {
    this.http.get('/api/v1/collares/disponibles')
      .subscribe((data: any) => this.collares = data);
  }

  guardar() {
    this.service.addMascota(this.mascota).subscribe(() => {
      alert('Mascota registrada exitosamente');
      this.mascota = {};
    });
  }
}