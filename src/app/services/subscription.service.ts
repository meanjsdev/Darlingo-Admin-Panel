import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subscription as SubscriptionModel } from '../models/subscription.model';

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

/**
 * Service to handle all subscription-related API operations
 */
@Injectable({
  providedIn: 'root',
})
export class SubscriptionService {
  private readonly apiUrl = `${environment.apiUrl}/admin/subscriptions`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches all subscriptions
   * @returns Observable with array of subscriptions
   */
  getSubscriptions(): Observable<ApiResponse<SubscriptionModel[]>> {
    return this.http
      .get<ApiResponse<SubscriptionModel[]>>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches a single subscription by ID
   * @param id Subscription ID
   * @returns Observable with subscription data
   */
  getSubscription(id: string): Observable<ApiResponse<SubscriptionModel>> {
    return this.http
      .get<ApiResponse<SubscriptionModel>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Creates a new subscription
   * @param subscription Subscription data without auto-generated fields
   * @returns Observable with created subscription
   */
  createSubscription(
    subscription: Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'>
  ): Observable<ApiResponse<SubscriptionModel>> {
    return this.http
      .post<ApiResponse<SubscriptionModel>>(this.apiUrl, subscription)
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates an existing subscription
   * @param id Subscription ID
   * @param updates Partial subscription data with updates
   * @returns Observable with updated subscription
   */
  updateSubscription(
    id: string,
    updates: Partial<SubscriptionModel>
  ): Observable<ApiResponse<SubscriptionModel>> {
    return this.http
      .put<ApiResponse<SubscriptionModel>>(`${this.apiUrl}/${id}`, updates)
      .pipe(catchError(this.handleError));
  }

  /**
   * Toggles the active status of a subscription
   * @param id Subscription ID
   * @param isActive New status
   * @returns Observable with updated subscription
   */
  toggleSubscriptionStatus(
    id: string,
    isActive: boolean
  ): Observable<ApiResponse<SubscriptionModel>> {
    return this.http
      .patch<ApiResponse<SubscriptionModel>>(
        `${this.apiUrl}/${id}/toggle-status`,
        { isActive }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a subscription
   * @param id Subscription ID to delete
   * @returns Observable with success message
   */
  deleteSubscription(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http
      .delete<ApiResponse<{ message: string }>>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles HTTP errors
   * @param error HttpErrorResponse
   * @returns Error observable
   * @private
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.message || error.statusText}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
