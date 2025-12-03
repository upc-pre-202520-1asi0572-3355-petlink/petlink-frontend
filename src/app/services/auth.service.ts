import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private loggedIn = new BehaviorSubject<boolean>(this.checkLogin());

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userEmail', credentials.email);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.loggedIn.next(false);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  private checkLogin(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}