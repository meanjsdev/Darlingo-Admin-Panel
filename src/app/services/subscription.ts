import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Subscription as SubscriptionModel } from '../models/subscription.model';

export interface ApiResponse<T> {
  success: boolean;
  count?: number;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = `${environment.apiUrl}/admin/subscriptions`;

  constructor(private http: HttpClient) { }

  // Get all subscriptions
  getSubscriptions(): Observable<ApiResponse<SubscriptionModel[]>> {
    return this.http.get<ApiResponse<SubscriptionModel[]>>(this.apiUrl);
  }

  // Get subscription by ID
  getSubscription(id: string): Observable<ApiResponse<SubscriptionModel>> {
    return this.http.get<ApiResponse<SubscriptionModel>>(`${this.apiUrl}/${id}`);
  }

  // Create new subscription
  createSubscription(subscription: Omit<SubscriptionModel, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<SubscriptionModel>> {
    return this.http.post<ApiResponse<SubscriptionModel>>(this.apiUrl, subscription);
  }

  // Update subscription
  updateSubscription(id: string, updates: Partial<SubscriptionModel>): Observable<ApiResponse<SubscriptionModel>> {
    return this.http.put<ApiResponse<SubscriptionModel>>(`${this.apiUrl}/${id}`, updates);
  }

  // Toggle subscription status
  toggleSubscriptionStatus(id: string, isActive: boolean): Observable<ApiResponse<SubscriptionModel>> {
    return this.http.patch<ApiResponse<SubscriptionModel>>(
      `${this.apiUrl}/${id}/toggle-status`,
      { isActive }
    );
  }

  // Delete subscription
  deleteSubscription(id: string): Observable<ApiResponse<{ message: string }>> {
    return this.http.delete<ApiResponse<{ message: string }>>(
      `${this.apiUrl}/${id}`
    );
  }
}
