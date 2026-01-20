import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { PermissionService } from './permission.service';

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost:3000';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private permissionService = inject(PermissionService);

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();

    // Load permissions if user is already logged in
    if (storedUser) {
      this.permissionService.loadMyPermissions().subscribe();
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        }),
        switchMap((response) =>
          this.permissionService.loadMyPermissions().pipe(
            tap(() => console.log('Permissions loaded successfully')),
            switchMap(() => [response])
          )
        )
      );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/auth/register`, {
      username,
      email,
      password,
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.permissionService.clearPermissions();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
