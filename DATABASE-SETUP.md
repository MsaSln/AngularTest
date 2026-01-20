# Database Setup Guide

This guide explains how to set up the database with all permissions, roles, and initial data.

## Prerequisites

- SQL Server database created and configured
- Backend `.env` file configured with database connection
- Access to SQL Server Management Studio or Azure Data Studio

## Setup Order

Follow these steps in order:

### 1. Create All Permissions

Run the comprehensive permissions script:

**File:** `backend/seed-all-permissions.sql`

This creates **68+ permissions** across all modules:

**Resources:**
- Dashboard (3 permissions)
- Menu Groups (5 permissions)
- Menu Items (5 permissions)
- Menu General (1 permission)
- Users (11 permissions)
- Roles (8 permissions)
- Permissions (7 permissions)
- Settings (4 permissions)
- Audit Logs (4 permissions)
- Reports (5 permissions)
- Notifications (4 permissions)
- Profile (3 permissions)

**Action Types:**
- `view` - View/read data
- `create` - Create new records
- `update` - Edit existing records
- `delete` - Remove records
- `export` - Export to Excel/PDF
- `import` - Import from Excel
- `manage` - Full management access
- `activate` - Enable/disable records
- `assign-*` - Assignment operations
- Custom actions per resource

### 2. Create and Update Roles

Run the roles update script:

**File:** `backend/update-roles-with-new-permissions.sql`

This creates/updates **6 roles**:

1. **Administrator** - All permissions (68+ permissions)
2. **Menu Manager** - Menu management + Dashboard view (12 permissions)
3. **User Manager** - User and role management + Dashboard view (20 permissions)
4. **Viewer** - Read-only access (20+ view permissions)
5. **Reporter** - View + Export permissions (30+ permissions)
6. **Support** - Basic user support (7 permissions)

### 3. Assign Administrator Role to User ID 1

Run the admin assignment script:

**File:** `backend/assign-admin-to-user1.sql`

This assigns the Administrator role to User ID 1, giving full system access.

### 4. (Optional) Create Menu Structure

Run the menu seed script:

**File:** `backend/seed-menu.sql`

This creates the menu structure for:
- Dashboard
- System Management
  - Menu Management
  - User Management
  - Role Management

**Note:** You may need to manually adjust the `menuGroupId` values based on your auto-increment IDs.

## Quick Start SQL Script

Copy and run this in SQL Server Management Studio:

```sql
USE YourDatabaseName;
GO

-- Step 1: Create all permissions
-- (Copy content from backend/seed-all-permissions.sql)

-- Step 2: Create/update roles
-- (Copy content from backend/update-roles-with-new-permissions.sql)

-- Step 3: Assign admin to User ID 1
-- (Copy content from backend/assign-admin-to-user1.sql)

-- Step 4: (Optional) Create menu structure
-- (Copy content from backend/seed-menu.sql)
```

## Verification Queries

After running the scripts, verify the setup:

### Check Total Permissions
```sql
SELECT COUNT(*) as TotalPermissions FROM permissions;
SELECT COUNT(DISTINCT resource) as TotalResources FROM permissions;
```

### Check Roles and Permission Counts
```sql
SELECT
    r.name as RoleName,
    COUNT(rp.permissionId) as PermissionCount,
    r.isActive
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.roleId
GROUP BY r.id, r.name, r.isActive
ORDER BY PermissionCount DESC;
```

### Check User ID 1 Permissions
```sql
SELECT
    u.id,
    u.username,
    r.name as RoleName,
    COUNT(DISTINCT p.id) as TotalPermissions
FROM users u
JOIN user_roles ur ON u.id = ur.userId
JOIN roles r ON ur.roleId = r.id
JOIN role_permissions rp ON r.id = rp.roleId
JOIN permissions p ON rp.permissionId = p.id
WHERE u.id = 1
GROUP BY u.id, u.username, r.name;
```

### View All Permissions for a Specific Role
```sql
-- Replace 'Administrator' with the role name you want to check
SELECT
    p.resource,
    p.action,
    p.name,
    p.description
FROM roles r
JOIN role_permissions rp ON r.id = rp.roleId
JOIN permissions p ON rp.permissionId = p.id
WHERE r.name = 'Administrator'
ORDER BY p.resource, p.action;
```

### View Permissions by Resource
```sql
SELECT
    resource,
    COUNT(*) as PermissionCount,
    STRING_AGG(action, ', ') as Actions
FROM permissions
GROUP BY resource
ORDER BY resource;
```

## Permission Naming Convention

All permissions follow this pattern:

```
resource.action
```

**Examples:**
- `menu.groups.view` - View menu groups
- `users.create` - Create users
- `roles.assign-permissions` - Assign permissions to roles
- `dashboard.analytics` - View dashboard analytics

## Role Hierarchy

```
Administrator (Full Access)
    ├── User Manager (Users + Roles)
    ├── Menu Manager (Menus only)
    └── Reporter (View + Export)
        └── Viewer (View only)
            └── Support (Limited user support)
```

## Troubleshooting

### Issue: Permissions not loading after login

**Solution:** Ensure the user has at least one active role assigned:
```sql
SELECT u.username, r.name, r.isActive
FROM users u
JOIN user_roles ur ON u.id = ur.userId
JOIN roles r ON ur.roleId = r.id
WHERE u.id = 1;
```

### Issue: Permission denied errors

**Solution:** Check if the role has the required permission:
```sql
-- Check if a role has a specific permission
SELECT r.name, p.name
FROM roles r
JOIN role_permissions rp ON r.id = rp.roleId
JOIN permissions p ON rp.permissionId = p.id
WHERE r.name = 'YourRoleName'
  AND p.name = 'permission.name';
```

### Issue: Too many permissions, system slow

**Solution:** The system uses permission caching. Permissions are loaded once at login and cached. This is normal and efficient.

## Adding New Permissions

When adding new features, follow this pattern:

1. **Define Permission in Database:**
```sql
INSERT INTO permissions (name, description, resource, action) VALUES
('feature.action', 'Description of what this allows', 'feature', 'action');
```

2. **Assign to Roles:**
```sql
-- Assign to Administrator (always)
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'Administrator' AND p.name = 'feature.action';

-- Assign to other roles as needed
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SomeRole' AND p.name = 'feature.action';
```

3. **Use in Frontend:**
```html
<button *hasPermission="'feature.action'">
  Do Action
</button>
```

## Best Practices

1. **Always test with non-admin users** - Don't test only with Administrator role
2. **Use specific permissions** - Avoid using `*.manage` permissions except for true admin functions
3. **Group related permissions** - Use consistent resource naming
4. **Document custom permissions** - Keep this file updated when adding new features
5. **Verify before deploying** - Always run verification queries after changes

## Support

If you encounter issues, check:
1. Database connection in `.env` file
2. TypeORM entities are synchronized with database
3. JWT token is valid and contains user ID
4. Role is active (`isActive = 1`)
5. Permission names match exactly (case-sensitive)
