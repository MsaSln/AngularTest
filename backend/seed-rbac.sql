-- RBAC System Seed Data
-- This script creates sample permissions, roles, and assigns them to users

-- ========================================
-- PERMISSIONS
-- ========================================
-- Menu Management Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('menu.groups.view', 'View menu groups', 'menu', 'view'),
('menu.groups.create', 'Create menu groups', 'menu', 'create'),
('menu.groups.update', 'Update menu groups', 'menu', 'update'),
('menu.groups.delete', 'Delete menu groups', 'menu', 'delete'),
('menu.groups.export', 'Export menu groups to Excel', 'menu', 'export'),
('menu.items.view', 'View menu items', 'menu', 'view'),
('menu.items.create', 'Create menu items', 'menu', 'create'),
('menu.items.update', 'Update menu items', 'menu', 'update'),
('menu.items.delete', 'Delete menu items', 'menu', 'delete');

-- User Management Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('users.view', 'View users', 'users', 'view'),
('users.create', 'Create users', 'users', 'create'),
('users.update', 'Update users', 'users', 'update'),
('users.delete', 'Delete users', 'users', 'delete');

-- Dashboard Permissions
INSERT INTO permissions (name, description, resource, action) VALUES
('dashboard.view', 'View dashboard', 'dashboard', 'view'),
('dashboard.analytics', 'View dashboard analytics', 'dashboard', 'analytics');

-- ========================================
-- ROLES
-- ========================================
-- Admin Role - Full access
INSERT INTO roles (name, description, isActive) VALUES
('Administrator', 'Full system access with all permissions', 1);

-- Menu Manager Role - Menu management only
INSERT INTO roles (name, description, isActive) VALUES
('Menu Manager', 'Can manage menus and export data', 1);

-- Viewer Role - Read-only access
INSERT INTO roles (name, description, isActive) VALUES
('Viewer', 'Read-only access to menus and dashboard', 1);

-- User Manager Role - User management
INSERT INTO roles (name, description, isActive) VALUES
('User Manager', 'Can manage users', 1);

-- ========================================
-- ROLE-PERMISSION MAPPINGS
-- ========================================
-- Administrator: All permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Administrator';

-- Menu Manager: Menu permissions including export
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Menu Manager'
  AND p.resource = 'menu';

-- Viewer: View-only permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'Viewer'
  AND p.action = 'view';

-- User Manager: User management permissions
INSERT INTO role_permissions (roleId, permissionId)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'User Manager'
  AND p.resource = 'users';

-- ========================================
-- ASSIGN ROLES TO USERS
-- ========================================
-- Note: You need to have users in the database first
-- Replace 'username' with actual usernames from your users table

-- Example: Assign Administrator role to user 'admin'
-- INSERT INTO user_roles (userId, roleId)
-- SELECT u.id, r.id
-- FROM users u
-- CROSS JOIN roles r
-- WHERE u.username = 'admin' AND r.name = 'Administrator';

-- Example: Assign Menu Manager role to user 'menuadmin'
-- INSERT INTO user_roles (userId, roleId)
-- SELECT u.id, r.id
-- FROM users u
-- CROSS JOIN roles r
-- WHERE u.username = 'menuadmin' AND r.name = 'Menu Manager';

-- Example: Assign Viewer role to user 'viewer'
-- INSERT INTO user_roles (userId, roleId)
-- SELECT u.id, r.id
-- FROM users u
-- CROSS JOIN roles r
-- WHERE u.username = 'viewer' AND r.name = 'Viewer';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- Uncomment to verify the data

-- View all permissions
-- SELECT * FROM permissions ORDER BY resource, action;

-- View all roles with permission count
-- SELECT r.name, r.description, COUNT(rp.permissionId) as permission_count
-- FROM roles r
-- LEFT JOIN role_permissions rp ON r.id = rp.roleId
-- GROUP BY r.id, r.name, r.description;

-- View role permissions
-- SELECT r.name as role_name, p.name as permission_name, p.description
-- FROM roles r
-- JOIN role_permissions rp ON r.id = rp.roleId
-- JOIN permissions p ON rp.permissionId = p.id
-- ORDER BY r.name, p.resource, p.action;

-- View user roles and permissions
-- SELECT u.username, r.name as role_name, p.name as permission_name
-- FROM users u
-- JOIN user_roles ur ON u.id = ur.userId
-- JOIN roles r ON ur.roleId = r.id
-- JOIN role_permissions rp ON r.id = rp.roleId
-- JOIN permissions p ON rp.permissionId = p.id
-- ORDER BY u.username, r.name, p.name;
