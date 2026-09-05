import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

export interface MenuNode {
  id: number;
  label: string;
  icon?: string;
  url?: string;
  children?: MenuNode[];
}

export interface UserSession {
  userId: number;
  username: string;
  permissions: string[];
  menus: MenuNode[];
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  // Usamos Signals para manejar el estado reactivo global
  session = signal<UserSession | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    this.loadSession();
  }

  login(username: string, password: string) {
    return this.http.post<{ code: number, message: string, data: { access_token: string } }>(`${environment.apiUrl}/auth/login`, { username, password })
      .pipe(
        tap(response => {
          if (response.data && response.data.access_token) {
            this.handleToken(response.data.access_token);
            this.router.navigate(['/app/configuraciones/usuarios']); // TODO: redirect to default menu
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(environment.tokenKey);
    this.session.set(null);
    this.router.navigate(['/auth/login']);
  }

  private handleToken(token: string) {
    localStorage.setItem(environment.tokenKey, token);
    this.decodeAndSetSession(token);
  }

  private loadSession() {
    const token = localStorage.getItem(environment.tokenKey);
    if (token) {
      try {
        this.decodeAndSetSession(token);
      } catch (e) {
        this.logout();
      }
    }
  }

  private decodeAndSetSession(token: string) {
    const payloadStr = atob(token.split('.')[1]);
    const payload = JSON.parse(payloadStr);
    
    this.session.set({
      userId: payload.sub,
      username: payload.username,
      permissions: payload.permissions,
      menus: payload.menus,
      token
    });
  }
}
