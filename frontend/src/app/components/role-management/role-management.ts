import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../services/permission.service';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { Role, Permission, CreateRoleDto, UpdateRoleDto } from '../../models/rbac.model';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './role-management.html',
  styleUrl: './role-management.css',
})
export class RoleManagement implements OnInit {
  roles = signal<Role[]>([]);
  allPermissions = signal<Permission[]>([]);
  groupedPermissions = signal<Map<string, Permission[]>>(new Map());
  showRoleForm = signal<boolean>(false);
  editingRole = signal<Role | null>(null);

  // Form data
  roleForm = signal<CreateRoleDto | UpdateRoleDto>({
    name: '',
    description: '',
    isActive: true,
    permissionIds: []
  });

  constructor(private permissionService: PermissionService) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
  }

  loadRoles(): void {
    this.permissionService.getRoles().subscribe(roles => {
      this.roles.set(roles);
    });
  }

  loadPermissions(): void {
    this.permissionService.getPermissions().subscribe(permissions => {
      this.allPermissions.set(permissions);
      this.groupPermissions(permissions);
    });
  }

  groupPermissions(permissions: Permission[]): void {
    const grouped = new Map<string, Permission[]>();

    permissions.forEach(permission => {
      const resource = permission.resource || 'Other';
      if (!grouped.has(resource)) {
        grouped.set(resource, []);
      }
      grouped.get(resource)!.push(permission);
    });

    this.groupedPermissions.set(grouped);
  }

  // Role operations
  openRoleForm(role?: Role): void {
    if (role) {
      this.editingRole.set(role);
      this.roleForm.set({
        name: role.name,
        description: role.description,
        isActive: role.isActive,
        permissionIds: role.permissions.map(p => p.id)
      });
    } else {
      this.editingRole.set(null);
      this.resetRoleForm();
    }
    this.showRoleForm.set(true);
  }

  closeRoleForm(): void {
    this.showRoleForm.set(false);
    this.editingRole.set(null);
    this.resetRoleForm();
  }

  saveRole(): void {
    const form = this.roleForm();
    if (!form.name?.trim()) {
      alert('Please enter a role name');
      return;
    }

    const editing = this.editingRole();
    if (editing) {
      // Update existing role
      this.permissionService.updateRole(editing.id, form as UpdateRoleDto).subscribe({
        next: () => {
          this.loadRoles();
          this.closeRoleForm();
        },
        error: (error) => {
          alert(error.error.message || 'Failed to update role');
        }
      });
    } else {
      // Create new role
      this.permissionService.createRole(form as CreateRoleDto).subscribe({
        next: () => {
          this.loadRoles();
          this.closeRoleForm();
        },
        error: (error) => {
          alert(error.error.message || 'Failed to create role');
        }
      });
    }
  }

  deleteRole(role: Role): void {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      this.permissionService.deleteRole(role.id).subscribe({
        next: () => {
          this.loadRoles();
        },
        error: (error) => {
          alert(error.error.message || 'Failed to delete role');
        }
      });
    }
  }

  resetRoleForm(): void {
    this.roleForm.set({
      name: '',
      description: '',
      isActive: true,
      permissionIds: []
    });
  }

  updateFormField<K extends keyof CreateRoleDto>(
    field: K,
    value: CreateRoleDto[K]
  ): void {
    this.roleForm.update(f => ({ ...f, [field]: value }));
  }

  togglePermission(permissionId: number): void {
    const form = this.roleForm();
    const permissionIds = form.permissionIds || [];
    const index = permissionIds.indexOf(permissionId);

    if (index > -1) {
      // Remove permission
      this.roleForm.update(f => ({
        ...f,
        permissionIds: permissionIds.filter(id => id !== permissionId)
      }));
    } else {
      // Add permission
      this.roleForm.update(f => ({
        ...f,
        permissionIds: [...permissionIds, permissionId]
      }));
    }
  }

  isPermissionSelected(permissionId: number): boolean {
    const form = this.roleForm();
    return form.permissionIds?.includes(permissionId) || false;
  }

  selectAllInResource(resource: string): void {
    const permissions = this.groupedPermissions().get(resource) || [];
    const permissionIds = permissions.map(p => p.id);
    const form = this.roleForm();
    const currentIds = form.permissionIds || [];

    // Check if all are already selected
    const allSelected = permissionIds.every(id => currentIds.includes(id));

    if (allSelected) {
      // Deselect all from this resource
      this.roleForm.update(f => ({
        ...f,
        permissionIds: currentIds.filter(id => !permissionIds.includes(id))
      }));
    } else {
      // Select all from this resource
      const newIds = Array.from(new Set([...currentIds, ...permissionIds]));
      this.roleForm.update(f => ({
        ...f,
        permissionIds: newIds
      }));
    }
  }

  isAllSelectedInResource(resource: string): boolean {
    const permissions = this.groupedPermissions().get(resource) || [];
    const permissionIds = permissions.map(p => p.id);
    const form = this.roleForm();
    const currentIds = form.permissionIds || [];

    return permissionIds.length > 0 && permissionIds.every(id => currentIds.includes(id));
  }

  getPermissionCount(role: Role): number {
    return role.permissions.length;
  }

  getResourceGroups(): string[] {
    return Array.from(this.groupedPermissions().keys()).sort();
  }
}
