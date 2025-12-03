import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    // Si ya está logueado, redirigir al home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.error = '';
    
    if (!this.email || !this.password) {
      this.error = 'Por favor completa todos los campos';
      return;
    }

    this.loading = true;

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/home']);
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al iniciar sesión';
        console.error('Error login:', err);
      }
    });
  }
}