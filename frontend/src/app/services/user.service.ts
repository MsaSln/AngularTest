import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  CreateUserResponse,
  ResetPasswordResponse
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(dto: CreateUserDto): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(this.apiUrl, dto);
  }

  updateUser(id: number, dto: UpdateUserDto): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, dto);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  resetPassword(id: number): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(`${this.apiUrl}/${id}/reset-password`, {});
  }

  toggleActive(id: number): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/toggle-active`, {});
  }
}
