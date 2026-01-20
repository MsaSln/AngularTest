import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Permission, Role, CreatePermissionDto, UpdatePermissionDto, CreateRoleDto, UpdateRoleDto } from '../models/rbac.model';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'http://localhost:3000';

  // User's permissions cache
  private userPermissions = signal<string[]>([]);

  constructor(private http: HttpClient) {}

  // Load user's permissions
  loadMyPermissions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/roles/my-permissions`).pipe(
      tap(permissions => this.userPermissions.set(permissions))
    );
  }

  // Check if user has a specific permission
  hasPermission(permission: string): boolean {
    return this.userPermissions().includes(permission);
  }

  // Check if user has any of the permissions
  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Check if user has all permissions
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Get user's permissions
  getUserPermissions(): string[] {
    return this.userPermissions();
  }

  // Clear user's permissions (on logout)
  clearPermissions(): void {
    this.userPermissions.set([]);
  }

  // Permissions CRUD
  getPermissions(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions`);
  }

  getPermission(id: number): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/permissions/${id}`);
  }

  getPermissionsByResource(resource: string): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissions/resource/${resource}`);
  }

  createPermission(dto: CreatePermissionDto): Observable<Permission> {
    return this.http.post<Permission>(`${this.apiUrl}/permissions`, dto);
  }

  updatePermission(id: number, dto: UpdatePermissionDto): Observable<Permission> {
    return this.http.patch<Permission>(`${this.apiUrl}/permissions/${id}`, dto);
  }

  deletePermission(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/permissions/${id}`);
  }

  // Roles CRUD
  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/roles`);
  }

  getRole(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/roles/${id}`);
  }

  createRole(dto: CreateRoleDto): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/roles`, dto);
  }

  updateRole(id: number, dto: UpdateRoleDto): Observable<Role> {
    return this.http.patch<Role>(`${this.apiUrl}/roles/${id}`, dto);
  }

  deleteRole(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/roles/${id}`);
  }
}
