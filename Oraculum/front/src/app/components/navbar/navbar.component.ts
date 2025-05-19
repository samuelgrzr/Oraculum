import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../usuarios/login/login.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);

  onLoginSuccess() {
    const loginToggle = document.getElementById('login-toggle') as HTMLInputElement;
    if (loginToggle) loginToggle.checked = false;
  }

  onLogout() {
    this.authService.logout();
    this.toastService.showMessage('Sesión cerrada correctamente');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.currentUserValue;
  }
}
