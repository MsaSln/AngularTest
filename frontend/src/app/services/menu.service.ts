import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  MenuGroup,
  MenuItem,
  CreateMenuGroupDto,
  UpdateMenuGroupDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
  MenuLocation
} from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:3000';
  private menuGroupsSubject = new BehaviorSubject<MenuGroup[]>([]);
  public menuGroups$ = this.menuGroupsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Menu Groups
  getMenuGroups(): Observable<MenuGroup[]> {
    return this.http.get<MenuGroup[]>(`${this.apiUrl}/menu-groups`).pipe(
      tap(groups => this.menuGroupsSubject.next(groups))
    );
  }

  getActiveMenuGroups(): Observable<MenuGroup[]> {
    return this.http.get<MenuGroup[]>(`${this.apiUrl}/menu-groups/active`).pipe(
      tap(groups => this.menuGroupsSubject.next(groups))
    );
  }

  getMenuGroup(id: number): Observable<MenuGroup> {
    return this.http.get<MenuGroup>(`${this.apiUrl}/menu-groups/${id}`);
  }

  createMenuGroup(dto: CreateMenuGroupDto): Observable<MenuGroup> {
    return this.http.post<MenuGroup>(`${this.apiUrl}/menu-groups`, dto).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  updateMenuGroup(id: number, dto: UpdateMenuGroupDto): Observable<MenuGroup> {
    return this.http.patch<MenuGroup>(`${this.apiUrl}/menu-groups/${id}`, dto).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  deleteMenuGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu-groups/${id}`).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  // Menu Items
  getMenuItems(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu-items`);
  }

  getMenuItemsByGroup(groupId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.apiUrl}/menu-items/group/${groupId}`);
  }

  getMenuItem(id: number): Observable<MenuItem> {
    return this.http.get<MenuItem>(`${this.apiUrl}/menu-items/${id}`);
  }

  createMenuItem(dto: CreateMenuItemDto): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${this.apiUrl}/menu-items`, dto).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  updateMenuItem(id: number, dto: UpdateMenuItemDto): Observable<MenuItem> {
    return this.http.patch<MenuItem>(`${this.apiUrl}/menu-items/${id}`, dto).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  deleteMenuItem(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/menu-items/${id}`).pipe(
      tap(() => this.getMenuGroups().subscribe())
    );
  }

  // Helper methods
  getSidebarMenuItems(): Observable<MenuGroup[]> {
    return this.getActiveMenuGroups();
  }

  getHeaderMenuItems(): MenuItem[] {
    const groups = this.menuGroupsSubject.value;
    const headerItems: MenuItem[] = [];

    groups.forEach(group => {
      group.menuItems.forEach(item => {
        if (item.isActive && (item.location === MenuLocation.HEADER || item.location === MenuLocation.BOTH)) {
          headerItems.push(item);
        }
      });
    });

    return headerItems.sort((a, b) => a.order - b.order);
  }
}
