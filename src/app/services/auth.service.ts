import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

export interface User {
  id: number;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSignal = signal<User | null>(null);

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(private http: HttpClient, private router: Router) {
    this.checkStatus().subscribe();
  }

  checkStatus(): Observable<boolean> {
    return this.http.get<{ authenticated: boolean; user?: User }>(`${this.apiUrl}/status`, { withCredentials: true }).pipe(
      tap(res => {
        if (res.authenticated && res.user) {
          this.currentUserSignal.set(res.user);
        } else {
          this.currentUserSignal.set(null);
        }
      }),
      map(res => res.authenticated),
      catchError(() => {
        this.currentUserSignal.set(null);
        return of(false);
      })
    );
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }, { withCredentials: true }).pipe(
      tap(user => {
        this.currentUserSignal.set(user);
        this.router.navigate(['/apps']);
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<User>(`${this.apiUrl}/register`, { username, password }, { withCredentials: true }).pipe(
      switchMap(() => this.login(username, password))
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.currentUserSignal.set(null);
        this.router.navigate(['/about']);
      }),
      catchError(() => {
        this.currentUserSignal.set(null);
        this.router.navigate(['/about']);
        return of(null);
      })
    ).subscribe();
  }
}
