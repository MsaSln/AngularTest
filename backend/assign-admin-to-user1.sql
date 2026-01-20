-- Assign Administrator role to User ID 1
-- This will give the user all permissions in the system

-- First, check if Administrator role exists
DECLARE @AdminRoleId INT;
SELECT @AdminRoleId = id FROM roles WHERE name = 'Administrator';

IF @AdminRoleId IS NOT NULL
BEGIN
    -- Check if user already has this role
    IF NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE userId = 1 AND roleId = @AdminRoleId
    )
    BEGIN
        -- Assign Administrator role to User ID 1
        INSERT INTO user_roles (userId, roleId)
        VALUES (1, @AdminRoleId);

        PRINT 'Administrator role assigned to User ID 1 successfully.';
    END
    ELSE
    BEGIN
        PRINT 'User ID 1 already has Administrator role.';
    END
END
ELSE
BEGIN
    PRINT 'ERROR: Administrator role not found. Please run seed-rbac.sql first.';
END

-- Verify the assignment
SELECT
    u.id as UserId,
    u.username,
    u.email,
    r.name as RoleName,
    COUNT(p.id) as PermissionCount
FROM users u
LEFT JOIN user_roles ur ON u.id = ur.userId
LEFT JOIN roles r ON ur.roleId = r.id
LEFT JOIN role_permissions rp ON r.id = rp.roleId
LEFT JOIN permissions p ON rp.permissionId = p.id
WHERE u.id = 1
GROUP BY u.id, u.username, u.email, r.name;

-- Show all permissions for User ID 1
SELECT DISTINCT
    p.name as Permission,
    p.description,
    p.resource,
    p.action
FROM users u
JOIN user_roles ur ON u.id = ur.userId
JOIN roles r ON ur.roleId = r.id
JOIN role_permissions rp ON r.id = rp.roleId
JOIN permissions p ON rp.permissionId = p.id
WHERE u.id = 1
ORDER BY p.resource, p.action;
