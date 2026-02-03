import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = signal(false);

  constructor(private router: Router) {
    this.checkAuth();
  }

  checkAuth() {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');
    this.isAuthenticated.set(!!token);
  }

  login() {
    // Mock login
    localStorage.setItem('token', 'mock-token');
    this.isAuthenticated.set(true);
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth']);
  }
}
