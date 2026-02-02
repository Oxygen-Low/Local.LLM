import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<string | null>(null);
  isLoggedIn = signal<boolean>(false);

  login(username: string): void {
    this.currentUser.set(username);
    this.isLoggedIn.set(true);
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}
