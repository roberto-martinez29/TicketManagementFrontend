import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin } from '../interfaces/admin';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private myApiUrl: string = 'https://localhost:7202/api/admin/';
  private readonly sessionKey = 'ticket-management-admin-session';

  constructor(private http: HttpClient) { }

  getAdmins(): Observable<Admin[]> {
    return this.http.get<Admin[]>(this.myApiUrl);
  }

  login(credentials: Admin): Observable<any> {
    return this.http.post<any>(this.myApiUrl + 'login', credentials);
  }

  setSessionActive(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.sessionKey, 'true');
  }

  isSessionActive(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    return localStorage.getItem(this.sessionKey) === 'true';
  }

  logout(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(this.sessionKey);
  }

  saveAdmin(admin: Admin): Observable<any> {
    return this.http.post<any>(this.myApiUrl, admin);
  }

  deleteAdmin(id: number): Observable<any> {
    return this.http.delete<any>(this.myApiUrl + id);
  }
}
