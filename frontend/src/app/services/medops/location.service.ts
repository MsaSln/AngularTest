import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location, CreateLocationDto, UpdateLocationDto } from '../../models/medops';
import { environment } from '../../../environments/environment';
import { PaginatedResponse } from './vehicle.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/medops/locations`;

  constructor(private http: HttpClient) {}

  getAll(
    search?: string,
    isActive?: boolean,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<Location>> {
    let params = new HttpParams()
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder)
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (isActive !== undefined) {
      params = params.set('isActive', isActive.toString());
    }

    return this.http.get<PaginatedResponse<Location>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.apiUrl}/${id}`);
  }

  create(location: CreateLocationDto): Observable<Location> {
    return this.http.post<Location>(this.apiUrl, location);
  }

  update(id: number, location: UpdateLocationDto): Observable<Location> {
    return this.http.patch<Location>(`${this.apiUrl}/${id}`, location);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
