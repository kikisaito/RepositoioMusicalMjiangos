import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'spotify_access_token';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  fetchToken(): Observable<any> {
    return this.http.get('/auth/token').pipe(
      tap((res: any) => {
        if (res.access_token) {
          this.setToken(res.access_token);
        }
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
