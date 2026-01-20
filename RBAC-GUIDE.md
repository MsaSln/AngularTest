# RBAC System Guide

This guide explains how to use the Role-Based Access Control (RBAC) system in this application.

## Overview

The RBAC system allows you to control access to features and UI elements based on user roles and permissions. Users can have multiple roles, and each role contains multiple permissions.

## Database Setup

### 1. Run the Seed Script

To populate the database with sample permissions and roles:

```sql
-- Connect to your SQL Server database and run:
USE YourDatabaseName;
GO

-- Run the seed script
-- (Copy and paste the contents of backend/seed-rbac.sql)
```

### 2. Assign Roles to Users

After creating users, assign roles using SQL:

```sql
-- Assign Administrator role to a user
INSERT INTO user_roles (userId, roleId)
SELECT u.id, r.id
FROM users u
CROSS JOIN roles r
WHERE u.username = 'your_username' AND r.name = 'Administrator';
```

## Permission Naming Convention

Permissions follow the pattern: `resource.action`

Examples:
- `menu.groups.export` - Export menu groups
- `users.create` - Create users
- `dashboard.view` - View dashboard

## Frontend Usage

### 1. Directive Usage - Conditional Rendering

Use the `*hasPermission` directive to show/hide UI elements:

```html
<!-- Single permission -->
<button *hasPermission="'menu.groups.export'" (click)="export()">
  Export
</button>

<!-- Multiple permissions with OR logic (default) -->
<button *hasPermission="['users.create', 'users.update']">
  Manage Users
</button>

<!-- Multiple permissions with AND logic -->
<button
  *hasPermission="['menu.groups.view', 'menu.groups.export']"
  [hasPermissionOp]="'AND'">
  Export
</button>
```

### 2. Service Usage - Programmatic Checks

```typescript
import { PermissionService } from './services/permission.service';

export class MyComponent {
  constructor(private permissionService: PermissionService) {}

  doSomething() {
    // Check single permission
    if (this.permissionService.hasPermission('menu.groups.export')) {
      // Perform action
    }

    // Check any permission
    if (this.permissionService.hasAnyPermission(['users.create', 'users.update'])) {
      // Perform action
    }

    // Check all permissions
    if (this.permissionService.hasAllPermissions(['menu.groups.view', 'menu.groups.export'])) {
      // Perform action
    }

    // Get all user permissions
    const permissions = this.permissionService.getUserPermissions();
  }
}
```

### 3. Route Guard - Protect Routes

Protect routes using the `permissionGuard`:

```typescript
import { Routes } from '@angular/router';
import { permissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [permissionGuard],
    data: {
      permissions: ['users.view', 'users.create'],
      permissionsOp: 'OR' // Optional, defaults to 'OR'
    }
  },
  {
    path: 'super-admin',
    component: SuperAdminComponent,
    canActivate: [permissionGuard],
    data: {
      permissions: ['users.delete', 'roles.manage'],
      permissionsOp: 'AND' // User must have ALL permissions
    }
  }
];
```

## Backend API Endpoints

### Permissions

- `GET /permissions` - Get all permissions
- `GET /permissions/:id` - Get permission by ID
- `GET /permissions/resource/:resource` - Get permissions by resource
- `POST /permissions` - Create permission
- `PATCH /permissions/:id` - Update permission
- `DELETE /permissions/:id` - Delete permission

### Roles

- `GET /roles` - Get all roles
- `GET /roles/:id` - Get role by ID
- `GET /roles/my-permissions` - Get current user's permissions (requires auth)
- `POST /roles` - Create role
- `PATCH /roles/:id` - Update role
- `DELETE /roles/:id` - Delete role

## Sample Roles

### Administrator
Full system access with all permissions.

### Menu Manager
Can manage menus and export data:
- All menu.* permissions

### Viewer
Read-only access:
- *.view permissions

### User Manager
Can manage users:
- All users.* permissions

## Example Workflow

1. **Login**: User logs in, system automatically loads their permissions
2. **Permission Check**: UI elements check permissions using directives
3. **Action**: User can only see and interact with authorized elements
4. **Route Navigation**: Guards prevent access to unauthorized routes
5. **Logout**: Permissions are cleared from memory

## Adding New Permissions

When adding a new feature:

1. **Define Permission** in code:
   ```typescript
   // In your component
   export const FEATURE_EXPORT_PERMISSION = 'feature.export';
   ```

2. **Add to Database**:
   ```sql
   INSERT INTO permissions (name, description, resource, action)
   VALUES ('feature.export', 'Export feature data', 'feature', 'export');
   ```

3. **Assign to Roles**:
   ```sql
   INSERT INTO role_permissions (roleId, permissionId)
   SELECT r.id, p.id FROM roles r, permissions p
   WHERE r.name = 'Administrator' AND p.name = 'feature.export';
   ```

4. **Use in UI**:
   ```html
   <button *hasPermission="'feature.export'" (click)="export()">
     Export
   </button>
   ```

## Best Practices

1. **Permission Names**: Use clear, hierarchical naming (resource.action)
2. **Granular Permissions**: Create specific permissions for each action
3. **Default Deny**: Only show/enable features when permission exists
4. **User Feedback**: Show appropriate messages when access is denied
5. **Role Organization**: Group related permissions into logical roles
6. **Documentation**: Keep permission names and purposes documented
7. **Testing**: Test with users having different role combinations

## Troubleshooting

### Permissions not loading
- Check that user has at least one active role
- Verify role has permissions assigned in database
- Check browser console for API errors
- Ensure JWT token is valid

### Button/feature visible without permission
- Verify `HasPermissionDirective` is imported in component
- Check permission name spelling in directive
- Confirm permission exists in database

### Route guard not working
- Ensure `permissionGuard` is in route's `canActivate` array
- Check route `data.permissions` is correctly set
- Verify user is logged in before navigation
