import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  password?: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  usuario: Usuario = { id: 0, nombre: '', email: '', rol: '', estado: '', password: '' };
  mensaje = '';
  error = '';

  constructor(private http: HttpClient, private auth: AuthService) { }

  ngOnInit(): void {
    const user = this.auth.currentUser;
    if (user) {
      this.http.get<Usuario>(`https://petlink-backend-1.onrender.com/api/v1/perfil/${user.id}`)
        .subscribe(data => this.usuario = data);
    }
  }

  actualizarPerfil() {
    this.http.put<Usuario>(`https://petlink-backend-1.onrender.com/api/v1/perfil/${this.usuario.id}`, this.usuario)
      .subscribe({
        next: () => this.mensaje = 'Perfil actualizado correctamente ✅',
        error: () => this.error = 'Error al actualizar perfil ❌'
      });
  }
}