import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
export type Role = 'dueno' | 'veterinario' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string; 
  role: Role;
  verified: boolean;
}

export interface LoginResp {
  token: string;
  user: Omit<User,'passwordHash'>;
}

const LS_USERS = 'pl_users';
const LS_TOKEN = 'pl_token';
const SS_TOKEN = 'pl_token_ss';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user$ = new BehaviorSubject<LoginResp['user'] | null>(this.getUserFromToken());
  user$ = this._user$.asObservable();

  // ===== Registro (US01) =====
  register(name: string, email: string, password: string, role: Role = 'dueno'): Observable<LoginResp> {
  const users = this.getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return throwError(() => new Error('El correo ya está registrado.'));
  }
  const newUser: User = {
    id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
    name, email,
    passwordHash: btoa(password), 
    role,
    verified: false
  };
  localStorage.setItem(LS_USERS, JSON.stringify([...users, newUser]));

  // genera token igual que en login
  const token = btoa(JSON.stringify({ sub: newUser.id, email: newUser.email, role: newUser.role }));
  localStorage.setItem(LS_TOKEN, token);

  const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, verified: newUser.verified };
  this._user$.next(safeUser);

  // devuelve igual que login
  return of({ token, user: safeUser });
}

  // ===== Login (US02) =====
  login(email: string, password: string, remember = true): Observable<LoginResp> {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return throwError(() => new Error('Credenciales inválidas.'));
    if (user.passwordHash !== btoa(password)) {
      return throwError(() => new Error('Credenciales inválidas.'));
    }
    // token mock + persistencia remember me
    const token = btoa(JSON.stringify({ sub: user.id, email: user.email, role: user.role }));
    const storageKey = remember ? LS_TOKEN : SS_TOKEN;
    (remember ? localStorage : sessionStorage).setItem(storageKey, token);
    // limpia el otro storage
    (remember ? sessionStorage : localStorage).removeItem(remember ? SS_TOKEN : LS_TOKEN);

    const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, verified: user.verified };
    this._user$.next(safeUser);
    return of({ token, user: safeUser });
  }

  // ===== Recordar sesión (US02: “recordar sesión”) =====
  isLoggedIn(): boolean {
    return !!(localStorage.getItem(LS_TOKEN) || sessionStorage.getItem(SS_TOKEN));
  }

  get currentUser(): LoginResp['user'] | null {
    return this._user$.value;
  }

  logout() {
    localStorage.removeItem(LS_TOKEN);
    sessionStorage.removeItem(SS_TOKEN);
    this._user$.next(null);
  }

  // ===== Confirmación y recuperación (US01/US03) =====
  confirmEmail(email: string): Observable<'ok'> {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return throwError(() => new Error('Usuario no encontrado'));
    users[idx] = { ...users[idx], verified: true };
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    return of('ok');
  }

  requestReset(email: string): Observable<'ok'> {
    // mock: “envia” enlace. Guarda un flag simple.
    localStorage.setItem(`pl_reset_${email.toLowerCase()}`, '1');
    return of('ok');
  }

  resetPassword(email: string, newPassword: string): Observable<'ok'> {
    if (!localStorage.getItem(`pl_reset_${email.toLowerCase()}`)) {
      return throwError(() => new Error('Enlace inválido o expirado'));
    }
    const users = this.getUsers();
    const idx = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (idx === -1) return throwError(() => new Error('Usuario no encontrado'));
    users[idx] = { ...users[idx], passwordHash: btoa(newPassword) };
    localStorage.setItem(LS_USERS, JSON.stringify(users));
    localStorage.removeItem(`pl_reset_${email.toLowerCase()}`);
    return of('ok');
  }

  // ===== Helpers =====
  private getUsers(): User[] {
    try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]'); } catch { return []; }
  }

  private getUserFromToken(): LoginResp['user'] | null {
  const raw = localStorage.getItem(LS_TOKEN) || sessionStorage.getItem(SS_TOKEN);
  if (!raw) return null;
  try {
    const payload = JSON.parse(atob(raw));
    // Busca al usuario real en localStorage para tener todos los campos
    const users = this.getUsers();
    const u = users.find(x => x.id === payload.sub);
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, role: u.role, verified: u.verified };
  } catch { 
    return null; 
  }
}
 recoverPassword(email: string): Observable<any> {
    // Valida formato simple de email
    if (!email.includes('@')) {
      return throwError(() => new Error('Correo inválido'));
    }

    // Simula el envío de correo (mock)
    return of({ message: 'Enlace enviado a ' + email }).pipe(delay(1500));
  }
}