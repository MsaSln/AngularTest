import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { PermissionService } from '../../services/permission.service';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { User, CreateUserDto, UpdateUserDto } from '../../models/user.model';
import { Role } from '../../models/rbac.model';

interface UserFormData {
  username?: string;
  email?: string;
  roleIds?: number[];
  isActive?: boolean;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, HasPermissionDirective],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
})
export class UserManagement implements OnInit {
  users = signal<User[]>([]);
  availableRoles = signal<Role[]>([]);
  showUserForm = signal<boolean>(false);
  editingUser = signal<User | null>(null);
  generatedPassword = signal<string>('');
  showPasswordModal = signal<boolean>(false);

  // Form data
  userForm = signal<UserFormData>({
    username: '',
    email: '',
    roleIds: []
  });

  constructor(
    private userService: UserService,
    private permissionService: PermissionService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  loadRoles(): void {
    this.permissionService.getRoles().subscribe(roles => {
      this.availableRoles.set(roles);
    });
  }

  // User operations
  openUserForm(user?: User): void {
    if (user) {
      this.editingUser.set(user);
      this.userForm.set({
        username: user.username,
        email: user.email,
        roleIds: user.roles.map(r => r.id),
        isActive: user.isActive
      });
    } else {
      this.editingUser.set(null);
      this.resetUserForm();
    }
    this.showUserForm.set(true);
  }

  closeUserForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
    this.resetUserForm();
  }

  saveUser(): void {
    const form = this.userForm();
    if (!form.username?.trim() || !form.email?.trim()) {
      alert('Please enter username and email');
      return;
    }

    if (!form.roleIds || form.roleIds.length === 0) {
      alert('Please select at least one role');
      return;
    }

    const editing = this.editingUser();
    if (editing) {
      // Update existing user
      this.userService.updateUser(editing.id, form as UpdateUserDto).subscribe({
        next: () => {
          this.loadUsers();
          this.closeUserForm();
        },
        error: (error) => {
          alert(error.error.message || 'Failed to update user');
        }
      });
    } else {
      // Create new user
      this.userService.createUser(form as CreateUserDto).subscribe({
        next: (response) => {
          this.loadUsers();
          this.closeUserForm();
          // Show generated password
          this.generatedPassword.set(response.generatedPassword);
          this.showPasswordModal.set(true);
        },
        error: (error) => {
          alert(error.error.message || 'Failed to create user');
        }
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          alert(error.error.message || 'Failed to delete user');
        }
      });
    }
  }

  resetPassword(user: User): void {
    if (confirm(`Are you sure you want to reset password for user "${user.username}"?`)) {
      this.userService.resetPassword(user.id).subscribe({
        next: (response) => {
          this.generatedPassword.set(response.generatedPassword);
          this.showPasswordModal.set(true);
        },
        error: (error) => {
          alert(error.error.message || 'Failed to reset password');
        }
      });
    }
  }

  toggleActive(user: User): void {
    this.userService.toggleActive(user.id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        alert(error.error.message || 'Failed to toggle user status');
      }
    });
  }

  resetUserForm(): void {
    this.userForm.set({
      username: '',
      email: '',
      roleIds: []
    });
  }

  updateFormField<K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ): void {
    this.userForm.update(f => ({ ...f, [field]: value }));
  }

  toggleRole(roleId: number): void {
    const form = this.userForm();
    const roleIds = form.roleIds || [];
    const index = roleIds.indexOf(roleId);

    if (index > -1) {
      // Remove role
      this.userForm.update(f => ({
        ...f,
        roleIds: roleIds.filter(id => id !== roleId)
      }));
    } else {
      // Add role
      this.userForm.update(f => ({
        ...f,
        roleIds: [...roleIds, roleId]
      }));
    }
  }

  isRoleSelected(roleId: number): boolean {
    const form = this.userForm();
    return form.roleIds?.includes(roleId) || false;
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
    this.generatedPassword.set('');
  }

  copyPassword(): void {
    const password = this.generatedPassword();
    navigator.clipboard.writeText(password).then(() => {
      alert('Password copied to clipboard!');
    });
  }

  getRoleNames(roles: Role[]): string {
    return roles.map(r => r.name).join(', ');
  }
}
