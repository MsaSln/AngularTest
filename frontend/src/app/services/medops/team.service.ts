import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team, CreateTeamDto, UpdateTeamDto, TeamType, TeamDetailType } from '../../models/medops';
import { PaginatedResponse } from './vehicle.service';

export type { PaginatedResponse };

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = 'http://localhost:3000/medops/teams';

  constructor(private http: HttpClient) {}

  getAll(
    search?: string,
    isActive?: boolean,
    teamTypeId?: number,
    detailTypeId?: number,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    limit: number = 10
  ): Observable<PaginatedResponse<Team>> {
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

    if (teamTypeId) {
      params = params.set('teamTypeId', teamTypeId.toString());
    }

    if (detailTypeId) {
      params = params.set('detailTypeId', detailTypeId.toString());
    }

    return this.http.get<PaginatedResponse<Team>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/${id}`);
  }

  create(team: CreateTeamDto): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }

  update(id: number, team: UpdateTeamDto): Observable<Team> {
    return this.http.patch<Team>(`${this.apiUrl}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
