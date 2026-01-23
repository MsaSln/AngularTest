import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel, CreatePersonnelDto, UpdatePersonnelDto } from '../../models/medops';
import { PaginatedResponse } from './vehicle.service';

export { PaginatedResponse };

@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = 'http://localhost:3000/medops/personnel';

  constructor(private http: HttpClient) {}

  getAll(
    search?: string,
    isActive?: boolean,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<Personnel>> {
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

    return this.http.get<PaginatedResponse<Personnel>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.apiUrl}/${id}`);
  }

  create(personnel: CreatePersonnelDto): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, personnel);
  }

  update(id: number, personnel: UpdatePersonnelDto): Observable<Personnel> {
    return this.http.patch<Personnel>(`${this.apiUrl}/${id}`, personnel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
