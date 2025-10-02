import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
  this.error = '';
  if (this.password !== this.confirmPassword) {
    this.error = 'Las contraseñas no coinciden';
    return;
  }

  this.loading = true;
  this.auth.register(this.name, this.email.trim(), this.password).subscribe({
  next: () => {
    this.loading = false;
    this.router.navigate(['/home']);  
  },
  error: (e) => {
    this.error = e.message || 'Error al registrarse';
    this.loading = false;
  }
});
}
}