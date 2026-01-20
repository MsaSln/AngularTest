import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../services/menu.service';
import {
  MenuGroup,
  MenuItem,
  CreateMenuGroupDto,
  CreateMenuItemDto,
  MenuLocation
} from '../../models/menu.model';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-management.html',
  styleUrl: './menu-management.css',
})
export class MenuManagement implements OnInit {
  menuGroups = signal<MenuGroup[]>([]);
  selectedGroup = signal<MenuGroup | null>(null);
  showGroupForm = signal<boolean>(false);
  showItemForm = signal<boolean>(false);
  editingGroup = signal<MenuGroup | null>(null);
  editingItem = signal<MenuItem | null>(null);

  // Form data
  groupForm = signal<CreateMenuGroupDto>({
    name: '',
    icon: '',
    order: 0,
    isActive: true
  });

  itemForm = signal<CreateMenuItemDto>({
    title: '',
    description: '',
    route: '',
    icon: '',
    location: MenuLocation.SIDEBAR,
    order: 0,
    isActive: true,
    menuGroupId: 0
  });

  MenuLocation = MenuLocation;

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenuGroups();
  }

  loadMenuGroups(): void {
    this.menuService.getMenuGroups().subscribe(groups => {
      this.menuGroups.set(groups);
    });
  }

  // Group operations
  openGroupForm(group?: MenuGroup): void {
    if (group) {
      this.editingGroup.set(group);
      this.groupForm.set({
        name: group.name,
        icon: group.icon,
        order: group.order,
        isActive: group.isActive
      });
    } else {
      this.editingGroup.set(null);
      this.resetGroupForm();
    }
    this.showGroupForm.set(true);
  }

  closeGroupForm(): void {
    this.showGroupForm.set(false);
    this.editingGroup.set(null);
    this.resetGroupForm();
  }

  saveGroup(): void {
    const form = this.groupForm();
    if (!form.name.trim()) {
      alert('Please enter a group name');
      return;
    }

    const editing = this.editingGroup();
    if (editing) {
      this.menuService.updateMenuGroup(editing.id, form).subscribe(() => {
        this.loadMenuGroups();
        this.closeGroupForm();
      });
    } else {
      this.menuService.createMenuGroup(form).subscribe(() => {
        this.loadMenuGroups();
        this.closeGroupForm();
      });
    }
  }

  deleteGroup(group: MenuGroup): void {
    if (confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
      this.menuService.deleteMenuGroup(group.id).subscribe(() => {
        this.loadMenuGroups();
        if (this.selectedGroup()?.id === group.id) {
          this.selectedGroup.set(null);
        }
      });
    }
  }

  resetGroupForm(): void {
    this.groupForm.set({
      name: '',
      icon: '',
      order: 0,
      isActive: true
    });
  }

  // Item operations
  openItemForm(item?: MenuItem): void {
    if (item) {
      this.editingItem.set(item);
      this.itemForm.set({
        title: item.title,
        description: item.description,
        route: item.route,
        icon: item.icon,
        location: item.location,
        order: item.order,
        isActive: item.isActive,
        menuGroupId: item.menuGroupId
      });
    } else {
      this.editingItem.set(null);
      this.resetItemForm();
      const selected = this.selectedGroup();
      if (selected) {
        this.itemForm.update(f => ({ ...f, menuGroupId: selected.id }));
      }
    }
    this.showItemForm.set(true);
  }

  closeItemForm(): void {
    this.showItemForm.set(false);
    this.editingItem.set(null);
    this.resetItemForm();
  }

  saveItem(): void {
    const form = this.itemForm();
    if (!form.title.trim() || !form.route.trim() || !form.menuGroupId) {
      alert('Please fill in all required fields');
      return;
    }

    const editing = this.editingItem();
    if (editing) {
      this.menuService.updateMenuItem(editing.id, form).subscribe(() => {
        this.loadMenuGroups();
        this.closeItemForm();
      });
    } else {
      this.menuService.createMenuItem(form).subscribe(() => {
        this.loadMenuGroups();
        this.closeItemForm();
      });
    }
  }

  deleteItem(item: MenuItem): void {
    if (confirm(`Are you sure you want to delete the item "${item.title}"?`)) {
      this.menuService.deleteMenuItem(item.id).subscribe(() => {
        this.loadMenuGroups();
      });
    }
  }

  resetItemForm(): void {
    this.itemForm.set({
      title: '',
      description: '',
      route: '',
      icon: '',
      location: MenuLocation.SIDEBAR,
      order: 0,
      isActive: true,
      menuGroupId: this.selectedGroup()?.id || 0
    });
  }

  selectGroup(group: MenuGroup): void {
    this.selectedGroup.set(group);
  }

  updateGroupFormField<K extends keyof CreateMenuGroupDto>(
    field: K,
    value: CreateMenuGroupDto[K]
  ): void {
    this.groupForm.update(f => ({ ...f, [field]: value }));
  }

  updateItemFormField<K extends keyof CreateMenuItemDto>(
    field: K,
    value: CreateMenuItemDto[K]
  ): void {
    this.itemForm.update(f => ({ ...f, [field]: value }));
  }
}
