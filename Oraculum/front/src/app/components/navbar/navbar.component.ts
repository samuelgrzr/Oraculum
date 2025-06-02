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
    this.closeLoginMenu();
  }

  onLogout() {
    this.authService.logout();
    this.closeUserMenu();
  }

  closeMainMenu() {
    const menuToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    if (menuToggle) menuToggle.checked = false;
  }

  closeLoginMenu() {
    const loginToggle = document.getElementById('login-toggle') as HTMLInputElement;
    if (loginToggle) loginToggle.checked = false;
  }

  closeUserMenu() {
    const userMenuToggle = document.getElementById('user-menu-toggle') as HTMLInputElement;
    if (userMenuToggle) userMenuToggle.checked = false;
  }

  navigateTo(route: string[]) {
    this.closeMainMenu();
    this.closeLoginMenu();
    this.closeUserMenu();
    
    this.router.navigate(route);
    
    return false;
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
