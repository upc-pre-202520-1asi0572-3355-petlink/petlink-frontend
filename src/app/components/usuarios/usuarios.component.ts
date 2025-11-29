import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string; // "Activo" | "Inactivo"
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', rol: 'Veterinario', estado: 'Activo' };
  editando: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.http.get<Usuario[]>('http://localhost:8080/api/v1/usuarios')
      .subscribe(data => {
        this.usuarios = data;
      });
  }

  guardarUsuario() {
    const body: Usuario = {
      id: this.nuevoUsuario.id,
      nombre: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      rol: this.nuevoUsuario.rol,
      estado: this.nuevoUsuario.estado,
    };

    if (this.editando) {
      this.http.put(`http://localhost:8080/api/v1/usuarios/${this.nuevoUsuario.id}`, body)
        .subscribe(() => {
          this.cargarUsuarios();
          this.resetForm();
        });
    } else {
      this.http.post('http://localhost:8080/api/v1/usuarios', body)
        .subscribe(() => {
          this.cargarUsuarios();
          this.resetForm();
        });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.nuevoUsuario = { ...usuario };
    this.editando = true;
  }

  eliminarUsuario(id: number) {
    this.http.delete(`http://localhost:8080/api/v1/usuarios/${id}`)
      .subscribe(() => this.cargarUsuarios());
  }

  resetForm() {
    this.nuevoUsuario = { id: 0, nombre: '', email: '', rol: 'Veterinario', estado: 'Activo' };
    this.editando = false;
  }
}