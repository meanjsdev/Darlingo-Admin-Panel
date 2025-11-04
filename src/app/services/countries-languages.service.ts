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

export interface CountryLanguageItem {
  _id?: string;
  id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesLanguagesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Countries methods
  getCountries(): Observable<CountryLanguageItem[]> {
    return this.http.get<ApiResponse<CountryLanguageItem[]>>(`${this.apiUrl}/admin/get-all-nationalities`).pipe(
      map((response: ApiResponse<CountryLanguageItem[]>) => {
        if (response.success && response.data) {
          return response.data.map((item: CountryLanguageItem) => ({
            ...item,
            id: item._id
          }));
        }
        return [];
      })
    );
  }

  getCountry(id: string): Observable<CountryLanguageItem> {
    return this.http.get<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/get-nationality/${id}`).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error('Country not found');
      })
    );
  }

  addCountry(country: CountryLanguageItem): Observable<CountryLanguageItem> {
    const { id, ...countryData } = country;
    return this.http.post<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/create-nationality`, countryData).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to add country');
      })
    );
  }

  updateCountry(id: string, country: CountryLanguageItem): Observable<CountryLanguageItem> {
    const { id: _, ...countryData } = country;
    return this.http.put<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/update-nationality/${id}`, countryData).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to update country');
      })
    );
  }

  deleteCountry(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/delete-nationality/${id}`).pipe(
      map((response: ApiResponse<null>) => response.success)
    );
  }

  // Languages methods
  getLanguages(): Observable<CountryLanguageItem[]> {
    return this.http.get<ApiResponse<CountryLanguageItem[]>>(`${this.apiUrl}/admin/get-all-native-languages`).pipe(
      map((response: ApiResponse<CountryLanguageItem[]>) => {
        if (response.success && response.data) {
          return response.data.map((item: CountryLanguageItem) => ({
            ...item,
            id: item._id
          }));
        }
        return [];
      })
    );
  }

  getLanguage(id: string): Observable<CountryLanguageItem> {
    return this.http.get<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/get-native-language/${id}`).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error('Language not found');
      })
    );
  }

  addLanguage(language: CountryLanguageItem): Observable<CountryLanguageItem> {
    const { id, ...languageData } = language;
    return this.http.post<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/create-native-language`, languageData).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to add language');
      })
    );
  }

  updateLanguage(id: string, language: CountryLanguageItem): Observable<CountryLanguageItem> {
    const { id: _, ...languageData } = language;
    return this.http.put<ApiResponse<CountryLanguageItem>>(`${this.apiUrl}/admin/update-native-language/${id}`, languageData).pipe(
      map((response: ApiResponse<CountryLanguageItem>) => {
        if (response.success && response.data) {
          return {
            ...response.data,
            id: response.data._id
          };
        }
        throw new Error(response.message || 'Failed to update language');
      })
    );
  }

  deleteLanguage(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/admin/delete-native-language/${id}`).pipe(
      map((response: ApiResponse<null>) => response.success)
    );
  }
}