import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OpenWindowResponse {
  success: boolean;
  message: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WindowManagerService {
  private apiUrl = 'http://localhost:3000/window-manager';

  constructor(private http: HttpClient) {}

  openOnPrimaryMonitor(url: string, width = 1000, height = 800): Observable<OpenWindowResponse> {
    return this.http.post<OpenWindowResponse>(`${this.apiUrl}/open-on-primary-monitor`, {
      url,
      width,
      height
    });
  }
}
