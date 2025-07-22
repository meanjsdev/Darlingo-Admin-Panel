import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service
    const authToken = this.authService.getToken();

    // Clone the request and add the authorization header
    let authReq = request;
    if (authToken) {
      authReq = this.addTokenHeader(request, authToken);
    }

    // Send the request and handle errors
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Auto logout if 401 response returned from API
          this.authService.logout();
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        }
        
        // Handle other error statuses
        let errorMessage = 'An error occurred';
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
