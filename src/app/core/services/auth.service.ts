import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'spotify_access_token';

  constructor(private router: Router) { }

  login(): void {
    window.location.href = 'http://localhost:3000/auth/login';
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
