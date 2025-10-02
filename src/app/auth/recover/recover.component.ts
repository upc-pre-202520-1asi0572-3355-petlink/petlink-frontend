import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recover.component.html',
  styleUrls: ['./recover.component.css']
})
export class RecoverComponent {
  email = '';
  loading = false;
  error = '';
  success = false;

  constructor(private auth: AuthService) {}

  submit() {
    this.error = '';
    this.success = false;

    if (!this.email) {
      this.error = 'Por favor ingresa un correo válido';
      return;
    }

    this.loading = true;
    this.auth.recoverPassword(this.email.trim()).subscribe({
  next: (res) => {   
    console.log(res.message);
    this.loading = false;
    this.success = true;
  },
  error: (e) => {
    this.loading = false;
    this.error = e.error?.error || 'Error al enviar el enlace';
  }
});
  }
}