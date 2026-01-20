import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { Auth, User } from '../../services/auth';
import { MenuItem } from '../../models/menu.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  menuItems = signal<MenuItem[]>([]);
  currentUser = signal<User | null>(null);
  showUserMenu = signal<boolean>(false);

  constructor(
    private menuService: MenuService,
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadHeaderMenu();
    this.authService.currentUser.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  loadHeaderMenu(): void {
    this.menuService.menuGroups$.subscribe(() => {
      const items = this.menuService.getHeaderMenuItems();
      this.menuItems.set(items);
    });

    // Initial load
    this.menuService.getActiveMenuGroups().subscribe();
  }

  toggleUserMenu(): void {
    this.showUserMenu.set(!this.showUserMenu());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
