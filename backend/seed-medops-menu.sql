-- MedOps Menu System Seed Data
-- This script creates MedOps menu group and menu items
-- Run this after the main menu seed script

-- ========================================
-- MEDOPS MENU GROUP
-- ========================================
-- Insert MedOps menu group
INSERT INTO menu_groups (name, icon, [order], isActive) VALUES
('MedOps', '🚑', 2, 1);

-- ========================================
-- MEDOPS MENU ITEMS
-- ========================================
-- Get the MedOps group ID
DECLARE @MedOpsGroupId INT = (SELECT id FROM menu_groups WHERE name = 'MedOps');

-- Insert MedOps menu items
INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
('Araç Yönetimi', 'Araç tanımları ve yönetimi', '/vehicles', '🚗', 'SIDEBAR', 1, 1, @MedOpsGroupId),
('Lokasyon Yönetimi', 'Lokasyon tanımları ve yönetimi', '/locations', '📍', 'SIDEBAR', 2, 1, @MedOpsGroupId),
('Personel Yönetimi', 'Personel tanımları ve yönetimi', '/personnel', '👨‍⚕️', 'SIDEBAR', 3, 1, @MedOpsGroupId),
('Ekip Yönetimi', 'Ekip tanımları ve yönetimi', '/teams', '👥', 'SIDEBAR', 4, 1, @MedOpsGroupId);

-- ========================================
-- ALTERNATIVE: Manual Insertion
-- ========================================
-- If the above doesn't work due to database constraints, use this approach:
-- 1. First, get the menu group IDs
-- SELECT id, name FROM menu_groups ORDER BY [order];

-- 2. Then manually insert menu items with the correct menuGroupId
-- Example: Assuming MedOps group has ID = 3

/*
INSERT INTO menu_items (title, description, route, icon, location, [order], isActive, menuGroupId) VALUES
('Araç Yönetimi', 'Araç tanımları ve yönetimi', '/vehicles', '🚗', 'SIDEBAR', 1, 1, 3),
('Lokasyon Yönetimi', 'Lokasyon tanımları ve yönetimi', '/locations', '📍', 'SIDEBAR', 2, 1, 3),
('Personel Yönetimi', 'Personel tanımları ve yönetimi', '/personnel', '👨‍⚕️', 'SIDEBAR', 3, 1, 3),
('Ekip Yönetimi', 'Ekip tanımları ve yönetimi', '/teams', '👥', 'SIDEBAR', 4, 1, 3);
*/

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- View MedOps menu group
-- SELECT * FROM menu_groups WHERE name = 'MedOps';

-- View MedOps menu items
-- SELECT mi.title, mi.route, mi.icon, mi.[order], mi.isActive
-- FROM menu_items mi
-- JOIN menu_groups mg ON mi.menuGroupId = mg.id
-- WHERE mg.name = 'MedOps'
-- ORDER BY mi.[order];

-- View all menu structure
-- SELECT
--     mg.name as [Grup],
--     mg.icon as [Grup İkon],
--     mg.[order] as [Grup Sıra],
--     mi.title as [Menü],
--     mi.route as [Route],
--     mi.icon as [İkon],
--     mi.[order] as [Sıra],
--     mi.isActive as [Aktif]
-- FROM menu_groups mg
-- LEFT JOIN menu_items mi ON mi.menuGroupId = mg.id
-- ORDER BY mg.[order], mi.[order];

-- ========================================
-- ROLLBACK (if needed)
-- ========================================
-- To remove MedOps menu items and group:
/*
DELETE FROM menu_items WHERE menuGroupId = (SELECT id FROM menu_groups WHERE name = 'MedOps');
DELETE FROM menu_groups WHERE name = 'MedOps';
*/
