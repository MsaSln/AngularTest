import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuGroup, MenuItem, MenuLocation } from '../../models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  menuGroups = signal<MenuGroup[]>([]);
  isCollapsed = signal<boolean>(false);
  expandedGroups = signal<Set<number>>(new Set());

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  loadMenu(): void {
    this.menuService.getSidebarMenuItems().subscribe(groups => {
      // Filter menu items to show only sidebar and both
      const filteredGroups = groups.map(group => ({
        ...group,
        menuItems: group.menuItems.filter(
          item => item.isActive &&
          (item.location === MenuLocation.SIDEBAR || item.location === MenuLocation.BOTH)
        ).sort((a, b) => a.order - b.order)
      })).filter(group => group.menuItems.length > 0);

      this.menuGroups.set(filteredGroups);

      // Expand first group by default
      if (filteredGroups.length > 0) {
        const expanded = new Set(this.expandedGroups());
        expanded.add(filteredGroups[0].id);
        this.expandedGroups.set(expanded);
      }
    });
  }

  toggleSidebar(): void {
    this.isCollapsed.set(!this.isCollapsed());
  }

  toggleGroup(groupId: number): void {
    const expanded = new Set(this.expandedGroups());
    if (expanded.has(groupId)) {
      expanded.delete(groupId);
    } else {
      expanded.add(groupId);
    }
    this.expandedGroups.set(expanded);
  }

  isGroupExpanded(groupId: number): boolean {
    return this.expandedGroups().has(groupId);
  }
}
