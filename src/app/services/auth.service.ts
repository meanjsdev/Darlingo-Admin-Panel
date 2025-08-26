import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  // Add other user properties as needed
}

export interface LoginCredentials {
  email: string;
  loginType: string;
  role: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = 'auth_token';

  constructor(private api: ApiService, private router: Router) {
    // Initialize user from localStorage if available
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      // In a real app, you would decode the token to get user info
      // For now, we'll just set a dummy user
      // this.currentUserSubject.next(JSON.parse(userStr));
    }
  }

  /**
   * Login user with email and password
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.api.post<{ user: User; token: string }>('/admin/login', credentials).pipe(
      tap(response => {
        // Store token and user info
        localStorage.setItem(this.tokenKey, response.token);
        this.currentUserSubject.next(response.user);
      }),
      map(response => response.user)
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    // Remove token and user info
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if user has required role
   */
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === role;
  }
}
