import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../auth/login/login.component';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, LoginComponent, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  onLoginSuccess() {
    const loginToggle = document.getElementById('login-toggle') as HTMLInputElement;
    if (loginToggle) loginToggle.checked = false;
  }

  onLogout() {
    this.authService.logout();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.currentUserValue;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.rol === 'admin';
  }
}
