import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import type { 
  User, 
  UserStatus, 
  UserQueryParams as ModelUserQueryParams, 
  UserListResponse as ModelUserListResponse 
} from '../models/user.model';

export type { User, UserStatus } from '../models/user.model';

export interface UserListResponse extends Omit<ModelUserListResponse, 'data'> {
  data: {
    users: User[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface UserQueryParams extends Omit<ModelUserQueryParams, 'status'> {
  status?: UserStatus;
  role?: string;
  fromDate?: string;
  toDate?: string;
  isVerified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface UserStats {
  stats: {
    totalUsers: number;
    totalActiveUsers: number;
    totalInactiveUsers: number;
    newThisWeek: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  /**
   * Get all users with pagination and filtering
   */
  getUsers(params?: UserQueryParams): Observable<UserListResponse> {
    return this.api.get<UserListResponse>('/admin/users', params);
  }

  /**
   * Get a single user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.api.get<User>(`/admin/users/${id}`);
  }

  /**
   * Create a new user
   */
  createUser(userData: Partial<User>): Observable<User> {
    return this.api.post<User>('/admin/users/register', userData);
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.api.put<User>(`/admin/users/update-profile/${id}`, userData);
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/users/${id}`);
  }

  /**
   * Update user activation status
   */
  updateUserStatus(id: string, status: string): Observable<User> {
    let data = { userId: id, accountStatus : status };
    return this.api.post<User>(`/admin/update-user-account-status`, data);
  }

  /**
   * Update user role
   */
  updateUserRole(id: string, role: string): Observable<User> {
    return this.api.patch<User>(`/admin/users/${id}/role`, { role });
  }

  /**
   * Upload user profile picture
   */
  uploadProfilePicture(userId: string, file: File): Observable<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.api.post<ApiResponse<{ url: string }>>(
      '/upload/single-image-file',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<ApiResponse<UserStats>> {
    return this.api.get<ApiResponse<UserStats>>('/admin/users-stats');
  }
}
