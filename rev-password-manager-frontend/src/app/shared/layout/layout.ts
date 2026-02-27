import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class Layout {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  logout() {

  const token = this.auth.getToken();

  // If no token, just redirect
  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  this.auth.logout().subscribe({
    next: () => {
      this.auth.clearToken();
      this.auth.clearTempUsername();
      this.router.navigate(['/login']);
    },
    error: () => {
      // Even if backend fails, force logout locally
      this.auth.clearToken();
      this.auth.clearTempUsername();
      this.router.navigate(['/']);
    }
  });
}
}