-- Menu System Seed Data
-- This script creates menu groups and menu items for the application

-- Note: Adjust the menu group IDs based on your database auto-increment values
-- You may need to run SELECT * FROM menu_groups; after inserting groups to get the correct IDs

-- ========================================
-- MENU GROUPS
-- ========================================
INSERT INTO menu_groups (name, icon, [order], isActive) VALUES
('System Management', '⚙️', 1, 1),
('Dashboard', '📊', 0, 1);

-- ========================================
-- MENU ITEMS
-- ========================================
-- Note: Replace @SystemGroupId and @DashboardGroupId with actual IDs from menu_groups table
-- You can get these IDs by running: SELECT id, name FROM menu_groups;

-- Dashboard Menu Item
-- DECLARE @DashboardGroupId INT = (SELECT id FROM menu_groups WHERE name = 'Dashboard');
-- INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
-- ('Dashboard', 'Main dashboard', '/dashboard', '📊', 'BOTH', 0, 1, @DashboardGroupId);

-- System Management Menu Items
-- DECLARE @SystemGroupId INT = (SELECT id FROM menu_groups WHERE name = 'System Management');

-- INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
-- ('Menu Management', 'Manage application menus', '/menu-management', '📋', 'SIDEBAR', 1, 1, @SystemGroupId),
-- ('User Management', 'Manage system users', '/user-management', '👥', 'SIDEBAR', 2, 1, @SystemGroupId),
-- ('Role Management', 'Manage roles and permissions', '/role-management', '🔐', 'SIDEBAR', 3, 1, @SystemGroupId);

-- ========================================
-- ALTERNATIVE: Manual Insertion
-- ========================================
-- If the above doesn't work, use this approach:
-- 1. First, insert menu groups and note their IDs
-- 2. Then manually insert menu items with the correct menuGroupId

-- Example after getting group IDs:
-- Assuming System Management group has ID = 1 and Dashboard group has ID = 2

-- INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
-- ('Dashboard', 'Main dashboard', '/dashboard', '📊', 'BOTH', 0, 1, 2);

-- INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
-- ('Menu Management', 'Manage application menus', '/menu-management', '📋', 'SIDEBAR', 1, 1, 1),
-- ('User Management', 'Manage system users', '/user-management', '👥', 'SIDEBAR', 2, 1, 1),
-- ('Role Management', 'Manage roles and permissions', '/role-management', '🔐', 'SIDEBAR', 3, 1, 1);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- View all menu groups
-- SELECT * FROM menu_groups ORDER BY [order];

-- View all menu items with their groups
-- SELECT mi.title, mi.route, mi.location, mg.name as group_name
-- FROM menu_items mi
-- JOIN menu_groups mg ON mi.menuGroupId = mg.id
-- ORDER BY mg.[order], mi.[order];
