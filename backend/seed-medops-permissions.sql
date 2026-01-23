-- ========================================
-- MedOps Permissions
-- All permissions for MedOps module
-- ========================================

-- ========================================
-- VEHICLE PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('vehicles.view', 'View vehicles list', 'vehicles', 'view'),
('vehicles.create', 'Create new vehicles', 'vehicles', 'create'),
('vehicles.update', 'Update vehicle information', 'vehicles', 'update'),
('vehicles.delete', 'Deactivate vehicles', 'vehicles', 'delete'),
('vehicles.export', 'Export vehicles to Excel', 'vehicles', 'export');

-- ========================================
-- LOCATION PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('locations.view', 'View locations list', 'locations', 'view'),
('locations.create', 'Create new locations', 'locations', 'create'),
('locations.update', 'Update location information', 'locations', 'update'),
('locations.delete', 'Deactivate locations', 'locations', 'delete'),
('locations.export', 'Export locations to Excel', 'locations', 'export');

-- ========================================
-- PERSONNEL PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('personnel.view', 'View personnel list', 'personnel', 'view'),
('personnel.create', 'Create new personnel', 'personnel', 'create'),
('personnel.update', 'Update personnel information', 'personnel', 'update'),
('personnel.delete', 'Deactivate personnel', 'personnel', 'delete'),
('personnel.export', 'Export personnel to Excel', 'personnel', 'export');

-- ========================================
-- TEAM PERMISSIONS
-- ========================================
INSERT INTO permissions (name, description, resource, action) VALUES
('teams.view', 'View teams list', 'teams', 'view'),
('teams.create', 'Create new teams', 'teams', 'create'),
('teams.update', 'Update team information', 'teams', 'update'),
('teams.delete', 'Deactivate teams', 'teams', 'delete'),
('teams.export', 'Export teams to Excel', 'teams', 'export'),
('teams.manage-details', 'Manage team details (location/vehicle/personnel)', 'teams', 'manage-details');

-- ========================================
-- ASSIGN MEDOPS PERMISSIONS TO ADMINISTRATOR
-- ========================================
DECLARE @AdminRoleId INT;
SELECT @AdminRoleId = id FROM roles WHERE name = 'Administrator';

IF @AdminRoleId IS NOT NULL
BEGIN
    -- Assign all MedOps permissions to Administrator
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @AdminRoleId, id FROM permissions
    WHERE resource IN ('vehicles', 'locations', 'personnel', 'teams')
    AND NOT EXISTS (
        SELECT 1 FROM role_permissions
        WHERE roleId = @AdminRoleId AND permissionId = permissions.id
    );

    PRINT 'MedOps permissions assigned to Administrator role.';
END

-- ========================================
-- CREATE MEDOPS MANAGER ROLE (Optional)
-- ========================================
DECLARE @MedOpsManagerRoleId INT;

IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MedOps Manager')
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('MedOps Manager', 'Full access to MedOps module (vehicles, locations, personnel, teams)', 1);

    SELECT @MedOpsManagerRoleId = SCOPE_IDENTITY();

    -- Assign all MedOps permissions
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @MedOpsManagerRoleId, id FROM permissions
    WHERE resource IN ('vehicles', 'locations', 'personnel', 'teams');

    -- Also add dashboard view
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @MedOpsManagerRoleId, id FROM permissions
    WHERE name = 'dashboard.view';

    PRINT 'MedOps Manager role created with all MedOps permissions.';
END

-- ========================================
-- CREATE MEDOPS VIEWER ROLE (Optional)
-- ========================================
DECLARE @MedOpsViewerRoleId INT;

IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'MedOps Viewer')
BEGIN
    INSERT INTO roles (name, description, isActive) VALUES
    ('MedOps Viewer', 'Read-only access to MedOps module', 1);

    SELECT @MedOpsViewerRoleId = SCOPE_IDENTITY();

    -- Assign only view permissions
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @MedOpsViewerRoleId, id FROM permissions
    WHERE resource IN ('vehicles', 'locations', 'personnel', 'teams')
    AND action = 'view';

    -- Also add dashboard view
    INSERT INTO role_permissions (roleId, permissionId)
    SELECT @MedOpsViewerRoleId, id FROM permissions
    WHERE name = 'dashboard.view';

    PRINT 'MedOps Viewer role created with view-only permissions.';
END

-- ========================================
-- VERIFICATION
-- ========================================
SELECT
    r.name AS RoleName,
    COUNT(DISTINCT p.id) AS MedOpsPermissions
FROM roles r
JOIN role_permissions rp ON r.id = rp.roleId
JOIN permissions p ON rp.permissionId = p.id
WHERE p.resource IN ('vehicles', 'locations', 'personnel', 'teams')
GROUP BY r.id, r.name
ORDER BY MedOpsPermissions DESC;

PRINT 'MedOps permissions setup completed!';
