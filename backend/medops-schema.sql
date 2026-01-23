-- ========================================
-- MedOps Application Database Schema
-- MSSQL Server
-- ========================================

-- ========================================
-- ENUM LOOKUP TABLES
-- ========================================

-- Team Types Lookup
CREATE TABLE team_types (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE,
    code NVARCHAR(20) NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- Team Detail Types Lookup
CREATE TABLE team_detail_types (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(50) NOT NULL UNIQUE,
    code NVARCHAR(20) NOT NULL UNIQUE,
    description NVARCHAR(200),
    display_order INT DEFAULT 0,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

-- ========================================
-- CORE ENTITIES
-- ========================================

-- Vehicles (Araçlar)
CREATE TABLE vehicles (
    id INT PRIMARY KEY IDENTITY(1,1),
    plate NVARCHAR(20) NOT NULL UNIQUE, -- Full plate (e.g., "34ASD34")
    plate_province NVARCHAR(3) NOT NULL, -- Province code (e.g., "34")
    plate_letters NVARCHAR(5) NOT NULL, -- Letter part (e.g., "ASD")
    plate_numbers NVARCHAR(5) NOT NULL, -- Number part (e.g., "34")
    vehicle_number NVARCHAR(50) NOT NULL UNIQUE,
    brand NVARCHAR(100),
    model NVARCHAR(100),
    phone_telsiz NVARCHAR(50),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by INT,
    deleted_at DATETIME2,
    deleted_by INT,
    CONSTRAINT FK_vehicle_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT FK_vehicle_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT FK_vehicle_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

-- Locations (Lokasyonlar)
CREATE TABLE locations (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(200) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    district NVARCHAR(100) NOT NULL,
    address NVARCHAR(500),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by INT,
    deleted_at DATETIME2,
    deleted_by INT,
    CONSTRAINT FK_location_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT FK_location_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT FK_location_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

-- Personnel (Personel)
CREATE TABLE personnel (
    id INT PRIMARY KEY IDENTITY(1,1),
    registration_number NVARCHAR(50) NOT NULL UNIQUE,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(50),
    email NVARCHAR(200),
    position NVARCHAR(100),
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by INT,
    deleted_at DATETIME2,
    deleted_by INT,
    CONSTRAINT FK_personnel_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT FK_personnel_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT FK_personnel_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

-- Teams (Ekipler)
CREATE TABLE teams (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(200) NOT NULL,
    team_number NVARCHAR(50) NOT NULL UNIQUE,
    team_type_id INT NOT NULL,
    detail_type_id INT NOT NULL,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by INT,
    deleted_at DATETIME2,
    deleted_by INT,
    CONSTRAINT FK_team_type FOREIGN KEY (team_type_id) REFERENCES team_types(id),
    CONSTRAINT FK_team_detail_type FOREIGN KEY (detail_type_id) REFERENCES team_detail_types(id),
    CONSTRAINT FK_team_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT FK_team_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    CONSTRAINT FK_team_deleted_by FOREIGN KEY (deleted_by) REFERENCES users(id)
);

-- Team Details (Ekip Detayları)
-- Polymorphic relationship based on detail_type_id
CREATE TABLE team_details (
    id INT PRIMARY KEY IDENTITY(1,1),
    team_id INT NOT NULL,
    location_id INT NULL,
    vehicle_id INT NULL,
    personnel_id INT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    created_by INT,
    updated_at DATETIME2 DEFAULT GETDATE(),
    updated_by INT,
    CONSTRAINT FK_team_detail_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    CONSTRAINT FK_team_detail_location FOREIGN KEY (location_id) REFERENCES locations(id),
    CONSTRAINT FK_team_detail_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    CONSTRAINT FK_team_detail_personnel FOREIGN KEY (personnel_id) REFERENCES personnel(id),
    CONSTRAINT FK_team_detail_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT FK_team_detail_updated_by FOREIGN KEY (updated_by) REFERENCES users(id),
    -- Business rule: At least one relationship must exist
    CONSTRAINT CHK_team_detail_has_relation CHECK (
        location_id IS NOT NULL OR
        vehicle_id IS NOT NULL OR
        personnel_id IS NOT NULL
    )
);

-- ========================================
-- SEED DATA
-- ========================================

-- Team Types
INSERT INTO team_types (name, code, display_order) VALUES
('Ambulans', 'AMBULANCE', 1),
('Evde Bakım', 'HOME_CARE', 2);

-- Team Detail Types
INSERT INTO team_detail_types (name, code, description, display_order) VALUES
('Lokasyon + Araç', 'LOCATION_VEHICLE', 'Ekip bir lokasyon ve bir araç ile ilişkilendirilir', 1),
('Araç', 'VEHICLE', 'Ekip sadece bir araç ile ilişkilendirilir', 2),
('Personel', 'PERSONNEL', 'Ekip bir personel ile ilişkilendirilir', 3);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Vehicles
CREATE INDEX IX_vehicles_plate ON vehicles(plate);
CREATE INDEX IX_vehicles_is_active ON vehicles(is_active);
CREATE INDEX IX_vehicles_created_at ON vehicles(created_at DESC);

-- Locations
CREATE INDEX IX_locations_name ON locations(name);
CREATE INDEX IX_locations_province_district ON locations(province, district);
CREATE INDEX IX_locations_is_active ON locations(is_active);

-- Personnel
CREATE INDEX IX_personnel_registration_number ON personnel(registration_number);
CREATE INDEX IX_personnel_name ON personnel(last_name, first_name);
CREATE INDEX IX_personnel_is_active ON personnel(is_active);

-- Teams
CREATE INDEX IX_teams_team_number ON teams(team_number);
CREATE INDEX IX_teams_type ON teams(team_type_id);
CREATE INDEX IX_teams_detail_type ON teams(detail_type_id);
CREATE INDEX IX_teams_is_active ON teams(is_active);

-- Team Details
CREATE INDEX IX_team_details_team ON team_details(team_id);
CREATE INDEX IX_team_details_location ON team_details(location_id);
CREATE INDEX IX_team_details_vehicle ON team_details(vehicle_id);
CREATE INDEX IX_team_details_personnel ON team_details(personnel_id);

-- ========================================
-- VIEWS FOR EASIER QUERIES
-- ========================================

-- View for active vehicles
CREATE VIEW vw_active_vehicles AS
SELECT
    id,
    plate,
    plate_province,
    plate_letters,
    plate_numbers,
    vehicle_number,
    brand,
    model,
    phone_telsiz,
    created_at,
    updated_at
FROM vehicles
WHERE is_active = 1 AND deleted_at IS NULL;
GO

-- View for active locations
CREATE VIEW vw_active_locations AS
SELECT
    id,
    name,
    province,
    district,
    address,
    created_at,
    updated_at
FROM locations
WHERE is_active = 1 AND deleted_at IS NULL;
GO

-- View for active personnel
CREATE VIEW vw_active_personnel AS
SELECT
    id,
    registration_number,
    first_name,
    last_name,
    CONCAT(first_name, ' ', last_name) AS full_name,
    phone,
    email,
    position,
    created_at,
    updated_at
FROM personnel
WHERE is_active = 1 AND deleted_at IS NULL;
GO

-- View for teams with full details
CREATE VIEW vw_teams_full AS
SELECT
    t.id,
    t.name,
    t.team_number,
    tt.name AS team_type,
    tt.code AS team_type_code,
    dt.name AS detail_type,
    dt.code AS detail_type_code,
    td.location_id,
    l.name AS location_name,
    td.vehicle_id,
    v.plate AS vehicle_plate,
    v.vehicle_number,
    td.personnel_id,
    CONCAT(p.first_name, ' ', p.last_name) AS personnel_name,
    t.is_active,
    t.created_at,
    t.updated_at
FROM teams t
LEFT JOIN team_types tt ON t.team_type_id = tt.id
LEFT JOIN team_detail_types dt ON t.detail_type_id = dt.id
LEFT JOIN team_details td ON t.id = td.team_id
LEFT JOIN locations l ON td.location_id = l.id
LEFT JOIN vehicles v ON td.vehicle_id = v.id
LEFT JOIN personnel p ON td.personnel_id = p.id
WHERE t.deleted_at IS NULL;
GO

-- ========================================
-- COMMENTS / DOCUMENTATION
-- ========================================

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'MedOps vehicle management table. Stores all vehicles with plate information split for easy entry.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'vehicles';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'MedOps location management table. Stores service locations.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'locations';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'MedOps personnel management table. Stores staff information.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'personnel';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'MedOps team management table. Main table for teams with type information.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'teams';

EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'MedOps team details table. Polymorphic relationship to locations, vehicles, or personnel based on team detail type.',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'team_details';
