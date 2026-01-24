-- MedOps Team Types and Detail Types Seed Data
-- This script populates the team_types and team_detail_types lookup tables
-- Run this before creating any teams

-- ========================================
-- TEAM TYPES (Ekip Tipleri)
-- ========================================
-- Clear existing data (if needed)
-- DELETE FROM team_types;

-- Insert team types
INSERT INTO team_types (name, code, display_order, is_active) VALUES
('Ambulans', 'AMB', 1, 1),
('Evde Bakım', 'EVD', 2, 1);

-- ========================================
-- TEAM DETAIL TYPES (Ekip Detay Tipleri)
-- ========================================
-- Clear existing data (if needed)
-- DELETE FROM team_detail_types;

-- Insert team detail types
INSERT INTO team_detail_types (name, code, description, display_order, is_active) VALUES
('Lokasyon + Araç', 'LOC_VEH', 'Lokasyon ve Araç birlikte', 1, 1),
('Araç', 'VEH', 'Sadece Araç', 2, 1),
('Personel', 'PER', 'Sadece Personel', 3, 1);

-- ========================================
-- VERIFICATION QUERIES
-- ========================================
-- View all team types
-- SELECT * FROM team_types ORDER BY display_order;

-- View all team detail types
-- SELECT * FROM team_detail_types ORDER BY display_order;

-- ========================================
-- SAMPLE DATA EXPLANATION
-- ========================================
/*
Team Types:
1. Ambulans (AMB) - Ambulans ekipleri için
2. Evde Bakım (EVD) - Evde bakım ekipleri için

Team Detail Types:
1. Lokasyon + Araç (LOC_VEH) - Hem lokasyon hem de araç içeren ekip detayları
   Örnek: Bir ambulans hem bir istasyona (lokasyon) hem de bir araca atanmış

2. Araç (VEH) - Sadece araç içeren ekip detayları
   Örnek: Bir ambulans sadece araca atanmış, belirli bir istasyonu yok

3. Personel (PER) - Sadece personel içeren ekip detayları
   Örnek: Evde bakım ekibi için personel ataması
*/

-- ========================================
-- ROLLBACK (if needed)
-- ========================================
/*
-- To remove all data:
DELETE FROM team_details;
DELETE FROM teams;
DELETE FROM team_detail_types;
DELETE FROM team_types;
*/
