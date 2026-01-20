-- ========================================
-- COMPREHENSIVE PERMISSIONS INSERT SCRIPT
-- All screens and actions for the application
-- ========================================

-- Clear existing permissions (optional - comment out if you want to keep existing data)
-- DELETE FROM role_permissions;
-- DELETE FROM permissions;
-- DBCC CHECKIDENT ('permissions', RESEED, 0);

-- ========================================
-- DASHBOARD PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('dashboard.view', 'View dashboard', 'dashboard', 'view'),
('dashboard.analytics', 'View dashboard analytics and reports', 'dashboard', 'analytics'),
('dashboard.export', 'Export dashboard data', 'dashboard', 'export');

-- ========================================
-- MENU MANAGEMENT PERMISSIONS
-- ========================================
-- Menu Groups
INSERT INTO permissions (name, description, resource, action) VALUES
('menu.groups.view', 'View menu groups', 'menu.groups', 'view'),
('menu.groups.create', 'Create menu groups', 'menu.groups', 'create'),
('menu.groups.update', 'Update menu groups', 'menu.groups', 'update'),
('menu.groups.delete', 'Delete menu groups', 'menu.groups', 'delete'),
('menu.groups.export', 'Export menu groups to Excel', 'menu.groups', 'export');

-- Menu Items
INSERT INTO permissions (name, description, resource, action) VALUES
('menu.items.view', 'View menu items', 'menu.items', 'view'),
('menu.items.create', 'Create menu items', 'menu.items', 'create'),
('menu.items.update', 'Update menu items', 'menu.items', 'update'),
('menu.items.delete', 'Delete menu items', 'menu.items', 'delete'),
('menu.items.export', 'Export menu items to Excel', 'menu.items', 'export');

-- Menu Management General
INSERT INTO permissions (name, description, resource, action) VALUES
('menu.manage', 'Full menu management access', 'menu', 'manage');

-- ========================================
-- USER MANAGEMENT PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('users.view', 'View users list', 'users', 'view'),
('users.create', 'Create new users', 'users', 'create'),
('users.update', 'Update user information', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete'),
('users.export', 'Export users to Excel', 'users', 'export'),
('users.import', 'Import users from Excel', 'users', 'import'),
('users.reset-password', 'Reset user passwords', 'users', 'reset-password'),
('users.activate', 'Activate/Deactivate users', 'users', 'activate'),
('users.assign-roles', 'Assign roles to users', 'users', 'assign-roles'),
('users.view-profile', 'View user profile details', 'users', 'view-profile'),
('users.manage', 'Full user management access', 'users', 'manage');

-- ========================================
-- ROLE MANAGEMENT PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('roles.view', 'View roles list', 'roles', 'view'),
('roles.create', 'Create new roles', 'roles', 'create'),
('roles.update', 'Update role information', 'roles', 'update'),
('roles.delete', 'Delete roles', 'roles', 'delete'),
('roles.export', 'Export roles to Excel', 'roles', 'export'),
('roles.assign-permissions', 'Assign permissions to roles', 'roles', 'assign-permissions'),
('roles.view-permissions', 'View role permissions', 'roles', 'view-permissions'),
('roles.manage', 'Full role management access', 'roles', 'manage');

-- ========================================
-- PERMISSION MANAGEMENT PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('permissions.view', 'View permissions list', 'permissions', 'view'),
('permissions.create', 'Create new permissions', 'permissions', 'create'),
('permissions.update', 'Update permission information', 'permissions', 'update'),
('permissions.delete', 'Delete permissions', 'permissions', 'delete'),
('permissions.export', 'Export permissions to Excel', 'permissions', 'export'),
('permissions.view-by-resource', 'View permissions by resource', 'permissions', 'view-by-resource'),
('permissions.manage', 'Full permission management access', 'permissions', 'manage');

-- ========================================
-- SYSTEM SETTINGS PERMISSIONS (Future use)
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('settings.view', 'View system settings', 'settings', 'view'),
('settings.update', 'Update system settings', 'settings', 'update'),
('settings.export', 'Export system settings', 'settings', 'export'),
('settings.manage', 'Full settings management access', 'settings', 'manage');

-- ========================================
-- AUDIT LOG PERMISSIONS (Future use)
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('audit.view', 'View audit logs', 'audit', 'view'),
('audit.export', 'Export audit logs', 'audit', 'export'),
('audit.search', 'Search audit logs', 'audit', 'search'),
('audit.manage', 'Full audit log access', 'audit', 'manage');

-- ========================================
-- REPORTS PERMISSIONS (Future use)
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('reports.view', 'View reports', 'reports', 'view'),
('reports.create', 'Create custom reports', 'reports', 'create'),
('reports.export', 'Export reports', 'reports', 'export'),
('reports.schedule', 'Schedule automated reports', 'reports', 'schedule'),
('reports.manage', 'Full reports management access', 'reports', 'manage');

-- ========================================
-- NOTIFICATIONS PERMISSIONS (Future use)
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('notifications.view', 'View notifications', 'notifications', 'view'),
('notifications.create', 'Create notifications', 'notifications', 'create'),
('notifications.send', 'Send notifications to users', 'notifications', 'send'),
('notifications.manage', 'Full notification management access', 'notifications', 'manage');

-- ========================================
-- PROFILE PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('profile.view', 'View own profile', 'profile', 'view'),
('profile.update', 'Update own profile', 'profile', 'update'),
('profile.change-password', 'Change own password', 'profile', 'change-password');

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Count permissions by resource
SELECT
    resource,
    COUNT(*) as permission_count
FROM permissions
GROUP BY resource
ORDER BY resource;

-- View all permissions
SELECT
    id,
    name,
    description,
    resource,
    action
FROM permissions
ORDER BY resource, action;

-- Count total permissions
SELECT COUNT(*) as total_permissions FROM permissions;

-- View permissions grouped by resource
SELECT
    resource,
    STRING_AGG(action, ', ') as actions
FROM permissions
GROUP BY resource
ORDER BY resource;

PRINT 'Permissions inserted successfully!';
PRINT 'Total resources: ' + CAST((SELECT COUNT(DISTINCT resource) FROM permissions) AS VARCHAR);
PRINT 'Total permissions: ' + CAST((SELECT COUNT(*) FROM permissions) AS VARCHAR);
