import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ✅ واحد موحّد للجميع: Student / Teacher / Admin
  login(data: { email: string; password: string }) {
    return this.http.post<{ token: string }>(
      `${this.baseUrl}/User/login`,
      data
    );
  }

  // === Token helpers ===

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    try {
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(base64);
      const data = JSON.parse(json);
      console.log('Decoded JWT payload:', data);
      return data;
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  getUserId(): number | null {
    const payload = this.decodeToken();
    if (!payload) return null;

    const id =
      payload.nameid ??
      payload.nameId ??
      payload.sub ??
      payload.id ??
      payload.Id ??
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    if (!id) return null;

    const num = Number(id);
    return isNaN(num) ? null : num;
  }

  getUserRole(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;

    return (
      payload.role ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      null
    );
  }

  getUserName(): string | null {
    const payload = this.decodeToken();
    if (!payload) return null;

    const nameClaim =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      payload.name ||
      null;

    return nameClaim;
  }
}
