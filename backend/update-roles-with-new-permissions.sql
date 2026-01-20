-- ========================================
-- UPDATE ROLES WITH NEW PERMISSIONS
-- This script updates existing roles with comprehensive permissions
-- Run this AFTER seed-all-permissions.sql
-- ========================================

-- ========================================
-- 1. ADMINISTRATOR ROLE - ALL PERMISSIONS
-- ========================================
DECLARE @AdminRoleId INT;
SELECT @AdminRoleId = id FROM roles WHERE name = 'Administrator';

IF @AdminRoleId IS NOT NULL
BEGIN
    -- Clear existing permissions for Administrator
    DELETE FROM role_permissions WHERE roleId = @AdminRoleId;

    -- Assign ALL permissions to Administrator
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @AdminRoleId, id FROM permissions;

    PRINT 'Administrator role updated with all permissions.';
END
ELSE
BEGIN
    PRINT 'Administrator role not found. Creating it...';
    INSERT INTO roles (name, description, isActive) VALUES
    ('Administrator', 'Full system access with all permissions', 1);

    SELECT @AdminRoleId = SCOPE_IDENTITY();

    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @AdminRoleId, id FROM permissions;

    PRINT 'Administrator role created with all permissions.';
END

-- ========================================
-- 2. MENU MANAGER ROLE
-- ========================================
DECLARE @MenuManagerRoleId INT;
SELECT @MenuManagerRoleId = id FROM roles WHERE name = 'Menu Manager';

IF @MenuManagerRoleId IS NOT NULL
BEGIN
    DELETE FROM role_permissions WHERE roleId = @MenuManagerRoleId;
END
ELSE
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('Menu Manager', 'Can manage menus and export data', 1);
    SELECT @MenuManagerRoleId = SCOPE_IDENTITY();
END

-- Assign menu-related permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT @MenuManagerRoleId, id FROM permissions
WHERE resource IN ('menu', 'menu.groups', 'menu.items')
   OR name = 'dashboard.view';

PRINT 'Menu Manager role updated.';

-- ========================================
-- 3. USER MANAGER ROLE
-- ========================================
DECLARE @UserManagerRoleId INT;
SELECT @UserManagerRoleId = id FROM roles WHERE name = 'User Manager';

IF @UserManagerRoleId IS NOT NULL
BEGIN
    DELETE FROM role_permissions WHERE roleId = @UserManagerRoleId;
END
ELSE
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('User Manager', 'Can manage users and roles', 1);
    SELECT @UserManagerRoleId = SCOPE_IDENTITY();
END

-- Assign user and role management permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT @UserManagerRoleId, id FROM permissions
WHERE resource IN ('users', 'roles')
   OR name = 'dashboard.view';

PRINT 'User Manager role updated.';

-- ========================================
-- 4. VIEWER ROLE - READ-ONLY ACCESS
-- ========================================
DECLARE @ViewerRoleId INT;
SELECT @ViewerRoleId = id FROM roles WHERE name = 'Viewer';

IF @ViewerRoleId IS NOT NULL
BEGIN
    DELETE FROM role_permissions WHERE roleId = @ViewerRoleId;
END
ELSE
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('Viewer', 'Read-only access to system data', 1);
    SELECT @ViewerRoleId = SCOPE_IDENTITY();
END

-- Assign view-only permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT @ViewerRoleId, id FROM permissions
WHERE action = 'view'
   OR name IN ('dashboard.view', 'dashboard.analytics', 'profile.view', 'profile.update', 'profile.change-password');

PRINT 'Viewer role updated.';

-- ========================================
-- 5. REPORTER ROLE - REPORTS AND EXPORTS
-- ========================================
DECLARE @ReporterRoleId INT;
SELECT @ReporterRoleId = id FROM roles WHERE name = 'Reporter';

IF @ReporterRoleId IS NULL
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('Reporter', 'Can view data and export reports', 1);
    SELECT @ReporterRoleId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    DELETE FROM role_permissions WHERE roleId = @ReporterRoleId;
END

-- Assign view and export permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT @ReporterRoleId, id FROM permissions
WHERE action IN ('view', 'export', 'analytics')
   OR resource = 'reports';

PRINT 'Reporter role created/updated.';

-- ========================================
-- 6. SUPPORT ROLE - BASIC USER SUPPORT
-- ========================================
DECLARE @SupportRoleId INT;
SELECT @SupportRoleId = id FROM roles WHERE name = 'Support';

IF @SupportRoleId IS NULL
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('Support', 'Can view users and reset passwords', 1);
    SELECT @SupportRoleId = SCOPE_IDENTITY();
END
ELSE
BEGIN
    DELETE FROM role_permissions WHERE roleId = @SupportRoleId;
END

-- Assign support-related permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT @SupportRoleId, id FROM permissions
WHERE name IN (
    'users.view',
    'users.view-profile',
    'users.reset-password',
    'dashboard.view',
    'profile.view',
    'profile.update',
    'profile.change-password'
);

PRINT 'Support role created/updated.';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

PRINT '========================================';
PRINT 'Role Permission Summary:';
PRINT '========================================';

-- Show permission count per role
SELECT
    r.name as RoleName,
    r.description,
    COUNT(rp.permissionId) as PermissionCount,
    r.isActive as Active
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.roleId
GROUP BY r.id, r.name, r.description, r.isActive
ORDER BY r.name;

-- Show detailed permissions per role
SELECT
    r.name as RoleName,
    p.resource as Resource,
    STRING_AGG(p.action, ', ') as Actions
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.roleId
LEFT JOIN permissions p ON rp.permissionId = p.id
GROUP BY r.id, r.name, p.resource
ORDER BY r.name, p.resource;

PRINT 'Roles updated successfully!';
