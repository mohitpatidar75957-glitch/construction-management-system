-- Construction Management System Database Schema
CREATE DATABASE IF NOT EXISTS construction_db;
USE construction_db;

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    project_code VARCHAR(50) UNIQUE NOT NULL,
    site_location VARCHAR(200),
    client_name VARCHAR(100),
    contractor_name VARCHAR(100),
    budget DECIMAL(15,2) NOT NULL DEFAULT 0,
    spent DECIMAL(15,2) DEFAULT 0,
    start_date DATE,
    completion_date DATE,
    status ENUM('PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED') DEFAULT 'IN_PROGRESS',
    progress_percent INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Materials & Inventory Table
CREATE TABLE IF NOT EXISTS materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    material_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    unit VARCHAR(20),
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_threshold DECIMAL(10,2) DEFAULT 10,
    unit_price DECIMAL(10,2) DEFAULT 0,
    supplier_name VARCHAR(100),
    last_restocked TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 3. Labour Attendance & Wages
CREATE TABLE IF NOT EXISTS labour_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    worker_name VARCHAR(100) NOT NULL,
    category ENUM('MASON', 'CARPENTER', 'BAR_BENDER', 'ELECTRICIAN', 'PLUMBER', 'GENERAL_LABOUR') DEFAULT 'GENERAL_LABOUR',
    contractor_agency VARCHAR(100),
    daily_wage DECIMAL(10,2) NOT NULL DEFAULT 500,
    attendance_status ENUM('PRESENT', 'ABSENT', 'HALF_DAY') DEFAULT 'PRESENT',
    work_date DATE NOT NULL,
    payment_status ENUM('PAID', 'PENDING') DEFAULT 'PENDING',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 4. Heavy Equipment & Machinery Fleet
CREATE TABLE IF NOT EXISTS equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    equipment_name VARCHAR(100) NOT NULL,
    model_no VARCHAR(50),
    ownership ENUM('OWNED', 'RENTED') DEFAULT 'OWNED',
    daily_rental_cost DECIMAL(10,2) DEFAULT 0,
    fuel_litres_per_day DECIMAL(8,2) DEFAULT 0,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'IDLE') DEFAULT 'OPERATIONAL',
    operator_name VARCHAR(100),
    last_service_date DATE,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- 5. Daily Progress Reports (DPR)
CREATE TABLE IF NOT EXISTS daily_progress_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    report_date DATE NOT NULL,
    weather VARCHAR(50) DEFAULT 'Clear / Sunny',
    milestone_activity VARCHAR(150),
    work_description TEXT,
    progress_percent_achieved INT DEFAULT 0,
    issues_or_delays TEXT,
    supervisor_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- 6. Financial Expenses
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    category ENUM('MATERIAL', 'LABOUR', 'EQUIPMENT', 'PERMITS', 'MISC') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    payment_mode ENUM('BANK_TRANSFER', 'UPI', 'CHEQUE', 'CASH') DEFAULT 'BANK_TRANSFER',
    invoice_no VARCHAR(100),
    vendor_payee VARCHAR(150),
    expense_date DATE NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Sample Data Seeding
INSERT IGNORE INTO projects (id, project_name, project_code, site_location, client_name, contractor_name, budget, spent, start_date, completion_date, status, progress_percent) VALUES
(1, 'Skyline Commercial Tower', 'PRJ-2026-001', 'Super Corridor, Sector 3, Indore', 'Skyline Infra Corp', 'Apex Builders Pvt Ltd', 125000000.00, 48200000.00, '2026-01-15', '2027-06-30', 'IN_PROGRESS', 42),
(2, 'Grand Horizon Residential Enclave', 'PRJ-2026-002', 'Bypass Road, Near Emerald Heights, Indore', 'Horizon Realty Group', 'Shree Ram Construction', 85000000.00, 61500000.00, '2025-08-01', '2026-12-15', 'IN_PROGRESS', 74),
(3, 'Metro Viaduct Infrastructure Package 4', 'PRJ-2026-003', 'MR-10 Ring Road, Indore', 'Indore Metro Rail Corp', 'L&T Heavy Civil', 320000000.00, 95000000.00, '2026-02-10', '2028-03-31', 'IN_PROGRESS', 30);

INSERT IGNORE INTO materials (id, project_id, material_name, category, unit, current_stock, min_threshold, unit_price, supplier_name) VALUES
(1, 1, 'UltraTech OPC 53 Grade Cement', 'Civil', 'Bags', 1450.00, 300.00, 395.00, 'UltraTech Cements Indore'),
(2, 1, 'Fe550D TMT Steel Bars (16mm)', 'Civil', 'Tons', 48.50, 15.00, 64200.00, 'Tata Tiscon Distributors'),
(3, 1, 'Washed River Sand', 'Civil', 'Brass', 85.00, 20.00, 5200.00, 'Narmada Aggregate Supplies'),
(4, 1, 'Crushed Blue Metal Aggregate (20mm)', 'Civil', 'Brass', 110.00, 25.00, 3800.00, 'Malwa Stone Crusher'),
(5, 2, 'AAC Lightweight Blocks (600x200x150)', 'Civil', 'Pieces', 3200.00, 800.00, 72.00, 'Siporex India'),
(6, 2, 'Finolex FRLS Copper Cables (2.5 sq mm)', 'Electrical', 'Coils', 120.00, 30.00, 2150.00, 'Indore Electric Store');

INSERT IGNORE INTO labour_attendance (id, project_id, worker_name, category, contractor_agency, daily_wage, attendance_status, work_date, payment_status) VALUES
(1, 1, 'Rameshwar Patel', 'MASON', 'Devendra Labour Supply', 850.00, 'PRESENT', CURDATE(), 'PAID'),
(2, 1, 'Santosh Kumar', 'BAR_BENDER', 'Devendra Labour Supply', 800.00, 'PRESENT', CURDATE(), 'PENDING'),
(3, 1, 'Dilip Yadav', 'CARPENTER', 'Verma Shuttering Works', 780.00, 'PRESENT', CURDATE(), 'PAID'),
(4, 1, 'Mukesh Bheel', 'GENERAL_LABOUR', 'Narmada Manpower', 550.00, 'PRESENT', CURDATE(), 'PENDING'),
(5, 2, 'Imran Khan', 'ELECTRICIAN', 'Bright Electric Agency', 900.00, 'PRESENT', CURDATE(), 'PAID');

INSERT IGNORE INTO equipment (id, project_id, equipment_name, model_no, ownership, daily_rental_cost, fuel_litres_per_day, status, operator_name, last_service_date) VALUES
(1, 1, 'JCB 3DX EcoXcellence Backhoe Loader', '3DX-2024', 'OWNED', 0.00, 45.00, 'OPERATIONAL', 'Surendra Singh', '2026-10-15'),
(2, 1, 'Schwing Stetter Transit Mixer (6 Cu.M)', 'CP-30', 'RENTED', 6500.00, 60.00, 'OPERATIONAL', 'Vikram Rathore', '2026-10-28'),
(3, 1, 'Potain Topkit Tower Crane (5 Ton)', 'MCT-88', 'OWNED', 0.00, 0.00, 'OPERATIONAL', 'Mohan Lal', '2026-11-01'),
(4, 2, 'Kirloskar 125 kVA Silent DG Set', 'KG125-WS', 'OWNED', 0.00, 25.00, 'OPERATIONAL', 'Arvind Meena', '2026-09-20');

INSERT IGNORE INTO daily_progress_reports (id, project_id, report_date, weather, milestone_activity, work_description, progress_percent_achieved, issues_or_delays, supervisor_name) VALUES
(1, 1, CURDATE(), 'Clear / Sunny', 'Tower A - 5th Floor Slab Casting', 'Poured 85 cubic meters of M30 grade concrete. Steel reinforcement and electrical conduits approved by structural consultant.', 42, 'None. Work completed on schedule.', 'Er. Ankit Sharma (Site Incharge)'),
(2, 2, CURDATE(), 'Clear / Sunny', 'Block 2 - External Plaster & Painting', 'Completed base coat primer on south wing facade. Plumbing shaft piping testing in progress.', 74, 'Minor delay in tile delivery from Morbi.', 'Er. Neeraj Verma');

INSERT IGNORE INTO expenses (id, project_id, category, amount, payment_mode, invoice_no, vendor_payee, expense_date, description) VALUES
(1, 1, 'MATERIAL', 572750.00, 'BANK_TRANSFER', 'INV-UT-8941', 'UltraTech Cements Ltd', CURDATE(), '1450 Bags of OPC 53 Cement for 5th floor slab'),
(2, 1, 'LABOUR', 42500.00, 'UPI', 'VOUCH-LAB-102', 'Devendra Labour Supply', CURDATE(), 'Weekly wage payout for 48 site workers'),
(3, 1, 'EQUIPMENT', 39000.00, 'BANK_TRANSFER', 'INV-SCH-4412', 'Schwing Stetter Transit Rental', CURDATE(), '6 Days transit concrete mixer rental charges');

