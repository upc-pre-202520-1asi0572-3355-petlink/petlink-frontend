import { Component, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.renderer.addClass(document.body, 'dark-mode');
    }
  }

  toggleDarkMode() {
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
      this.renderer.removeClass(body, 'dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      this.renderer.addClass(body, 'dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  }
}