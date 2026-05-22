import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  User, AuthResponse, LoginRequest,
  RegisterFarmerRequest, RegisterBuyerRequest
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Load user from localStorage on app start
    const userJson = localStorage.getItem('agrilink_user');
    if (userJson) {
      try {
        this.currentUserSubject.next(JSON.parse(userJson));
      } catch {
        this.logout();
      }
    }
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('agrilink_token');
  }

  get userRole(): string | null {
    return this.currentUser?.role ?? null;
  }

  getToken(): string | null {
    return localStorage.getItem('agrilink_token');
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  registerFarmer(request: RegisterFarmerRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/farmer`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  registerBuyer(request: RegisterBuyerRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register/buyer`, request).pipe(
      tap(response => this.handleAuth(response))
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  logout(): void {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('agrilink_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuth(response: AuthResponse): void {
    localStorage.setItem('agrilink_token', response.token);
    localStorage.setItem('agrilink_user', JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }
}