import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiUrl;
  }

  /**
   * Generic request method
   */
  private request<T>(
    method: HttpMethod,
    path: string,
    body?: any,
    options: ApiOptions = {}
  ): Observable<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = new HttpHeaders(options.headers);
    const params = this.createParams(options.params);

    const httpOptions = {
      headers,
      params,
      responseType: options.responseType as any
    };

    switch (method) {
      case 'GET':
        return this.http.get<T>(url, httpOptions);
      case 'POST':
        return this.http.post<T>(url, body, httpOptions);
      case 'PUT':
        return this.http.put<T>(url, body, httpOptions);
      case 'DELETE':
        return this.http.delete<T>(url, httpOptions);
      default:
        throw new Error(`Unsupported request: ${method}`);
    }
  }

  /**
   * Convert object to HttpParams
   */
  private createParams(params: Record<string, any> = {}): HttpParams {
    let httpParams = new HttpParams();
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(item => {
            httpParams = httpParams.append(key, item);
          });
        } else {
          httpParams = httpParams.set(key, value);
        }
      }
    });
    
    return httpParams;
  }

  // HTTP Methods
  get<T>(path: string, params?: any, options: Omit<ApiOptions, 'params'> = {}): Observable<T> {
    return this.request<T>('GET', path, null, { ...options, params });
  }

  post<T>(path: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T>(path: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T>(path: string, body: any, options: ApiOptions = {}): Observable<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options: ApiOptions = {}): Observable<T> {
    return this.request<T>('DELETE', path, null, options);
  }
}
