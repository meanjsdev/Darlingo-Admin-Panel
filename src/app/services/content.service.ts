import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}

export interface ContentItem {
  _id?: string;
  id?: string; // For backward compatibility
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private getContentTypePath(contentType: string): string {
    // Map content type to API endpoint
    const typeMap: {[key: string]: string} = {
      'sexual-orientation': 'sexual-orientation',
      'looking-for': 'current-situation',
      'education': 'education',
      'workout': 'workout',
      'religion': 'religion',
      'smoking': 'smoking',
      'drinking': 'drinking',
      'interests': 'interest',
      'nationalities': 'nationality',
      'native-languages': 'native-language',
      'current-situations': 'current-situation'
    };
    
    return typeMap[contentType] || contentType;
  }

  // Get all items for a content type
  getItems(contentType: string): Observable<ContentItem[]> {
    const path = this.getContentTypePath(contentType);
    const endpointMap: {[key: string]: string} = {
      'sexual-orientation': 'get-all-sexual-orientations',
      'current-situation': 'get-all-current-situations',
      'education': 'get-all-educations',
      'workout': 'get-all-workouts',
      'religion': 'get-all-religions',
      'smoking': 'get-all-smokings',
      'drinking': 'get-all-drinkings',
      'interest': 'get-all-interests',
      'nationality': 'get-all-nationalities',
      'native-language': 'get-all-native-languages'
    };
    const endpoint = endpointMap[path] || `get-all-${path}s`;
    return this.http.get<ApiResponse<ContentItem[]>>(`${this.apiUrl}/admin/${endpoint}`).pipe(
      map((response: ApiResponse<ContentItem[]>) => {
        if (response.success && response.data) {
return response.data.map((item: ContentItem) => ({
            ...item,
            id: item._id // Map _id to id for backward compatibility
          }));
        }
        return [];
      })
    );
  }

  // Get a single item by ID
  getItem(contentType: string, id: string): Observable<ContentItem> {
    const path = this.getContentTypePath(contentType);
    const endpointMap: {[key: string]: string} = {
      'sexual-orientation': 'get-sexual-orientation',
      'current-situation': 'get-current-situation',
      'education': 'get-education',
      'workout': 'get-workout',
      'religion': 'get-religion',
      'smoking': 'get-smoking',
      'drinking': 'get-drinking',
      'interest': 'get-interest',
      'nationality': 'get-nationality',
      'native-language': 'get-native-language'
    };
    const endpoint = endpointMap[path] || `get-${path}`;
    return this.http.get<ApiResponse<ContentItem>>(`${this.apiUrl}/admin/${endpoint}/${id}`).pipe(
      map((response: ApiResponse<ContentItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id // Map _id to id for backward compatibility
          };
        }
        throw new Error('Item not found');
      })
    );
  }

  // Add a new item
  addItem(contentType: string, item: ContentItem): Observable<ContentItem> {
    const path = this.getContentTypePath(contentType);
    const endpointMap: {[key: string]: string} = {
      'interest': 'create-interest',
      'sexual-orientation': 'create-sexual-orientation',
      'current-situation': 'create-current-situation',
      'education': 'create-education',
      'workout': 'create-workout',
      'religion': 'create-religion',
      'smoking': 'create-smoking',
      'drinking': 'create-drinking',
      'nationality': 'create-nationality',
      'native-language': 'create-native-language'
    };
    const endpoint = endpointMap[path] || `create-${path}`;
    const { id, ...itemData } = item; // Remove id if present
    return this.http.post<ApiResponse<ContentItem>>(
      `${this.apiUrl}/admin/${endpoint}`, 
      itemData
    ).pipe(
      map((response: ApiResponse<ContentItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to add item');
      })
    );
  }

  // Update an existing item
  updateItem(contentType: string, id: string, item: ContentItem): Observable<ContentItem> {
    const path = this.getContentTypePath(contentType);
    const endpointMap: {[key: string]: string} = {
      'sexual-orientation': 'update-sexual-orientation',
      'current-situation': 'update-current-situation',
      'education': 'update-education',
      'workout': 'update-workout',
      'religion': 'update-religion',
      'smoking': 'update-smoking',
      'drinking': 'update-drinking',
      'interest': 'update-interest',
      'nationality': 'update-nationality',
      'native-language': 'update-native-language'
    };
    const endpoint = endpointMap[path] || `update-${path}`;
    const { id: _, ...itemData } = item; // Remove id from the update data
    return this.http.put<ApiResponse<ContentItem>>(
      `${this.apiUrl}/admin/${endpoint}/${id}`, 
      itemData
    ).pipe(
      map((response: ApiResponse<ContentItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to update item');
      })
    );
  }

  // Delete an item
  deleteItem(contentType: string, id: string): Observable<boolean> {
    const path = this.getContentTypePath(contentType);
    const endpointMap: {[key: string]: string} = {
      'sexual-orientation': 'delete-sexual-orientation',
      'current-situation': 'delete-current-situation',
      'education': 'delete-education',
      'workout': 'delete-workout',
      'religion': 'delete-religion',
      'smoking': 'delete-smoking',
      'drinking': 'delete-drinking',
      'interest': 'delete-interest',
      'nationality': 'delete-nationality',
      'native-language': 'delete-native-language'
    };
    const endpoint = endpointMap[path] || `delete-${path}`;
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/${endpoint}/${id}`).pipe(
      map((response: ApiResponse<null>) => response.success)
    );
  }

  // Get display name for content type
  getContentTypeDisplayName(contentType: string): string {
    const displayNames: {[key: string]: string} = {
      'sexual-orientation': 'Sexual Orientation',
      'looking-for': 'Looking For',
      'education': 'Education',
      'workout': 'Workout',
      'religion': 'Religion',
      'smoking': 'Smoking',
      'drinking': 'Drinking',
      'interests': 'Interests',
      'nationalities': 'Nationalities',
      'native-languages': 'Native Languages',
      'current-situations': 'Current Situations'
    };
    return displayNames[contentType] || contentType;
  }
}
