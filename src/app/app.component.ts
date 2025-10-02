import { Component } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PetLink Frontend';

  constructor(public auth: AuthService, private router: Router) {}

  showHeader(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return this.auth.isLoggedIn() && !hiddenRoutes.includes(this.router.url);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}