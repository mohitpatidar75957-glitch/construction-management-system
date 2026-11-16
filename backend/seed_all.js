const mysql = require('mysql2/promise');
require('dotenv').config({ path: __dirname + '/.env' });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      database: 'construction_db'
    });

    console.log('Connected to MySQL. Updating schema and seeding data...');

    // 1. Projects - Add 4 exact sites: Indore (85% On Track), Bhopal (60% On Track), Ujjain (35% Delayed), Dewas (90% Almost Complete)
    await conn.query('DELETE FROM daily_progress_reports;');
    await conn.query('DELETE FROM expenses;');
    await conn.query('DELETE FROM materials;');
    await conn.query('DELETE FROM labour_attendance;');
    await conn.query('DELETE FROM equipment;');
    await conn.query('DELETE FROM projects;');

    await conn.query(`
      INSERT INTO projects (id, project_name, project_code, site_location, client_name, contractor_name, budget, spent, start_date, completion_date, status, progress_percent) VALUES
      (1, 'Skyline Commercial Hub (Project A)', 'PRJ-IND-01', 'Super Corridor, Indore', 'Skyline Infra Corp', 'Apex Builders Pvt Ltd', 125000000.00, 98000000.00, '2025-01-10', '2026-12-30', 'IN_PROGRESS', 85),
      (2, 'Grand Horizon Enclave (Project B)', 'PRJ-BHO-02', 'Arera Hills, Bhopal', 'Horizon Realty Group', 'Shree Ram Construction', 85000000.00, 48000000.00, '2025-06-15', '2027-04-15', 'IN_PROGRESS', 60),
      (3, 'Mahakal Metro Package (Project C)', 'PRJ-UJJ-03', 'Nanakheda Ring Road, Ujjain', 'MP Metro Rail Corp', 'L&T Heavy Civil', 240000000.00, 92000000.00, '2025-08-01', '2028-06-30', 'ON_HOLD', 35),
      (4, 'Chamunda Industrial Park (Project D)', 'PRJ-DEW-04', 'Industrial Area, Dewas', 'Dewas Mega Logistics', 'Malwa Infrastructure Ltd', 65000000.00, 56000000.00, '2024-11-01', '2026-11-30', 'IN_PROGRESS', 90);
    `);

    // 2. Materials - Cement, Sariya (Steel), Bricks, Sand, Aggregate
    await conn.query(`
      INSERT INTO materials (id, project_id, material_name, category, unit, current_stock, min_threshold, unit_price, supplier_name) VALUES
      (1, 1, 'UltraTech 53G Cement', 'Cement', 'Bags', 1450.00, 500.00, 390.00, 'UltraTech Depot Indore'),
      (2, 1, 'Tata Tiscon Fe550D Sariya (16mm)', 'Steel', 'Tons', 38.50, 15.00, 64500.00, 'Tata Tiscon Distributors'),
      (3, 1, 'Red Clay Bricks (Class 1)', 'Bricks', 'Pieces', 8500.00, 10000.00, 9.50, 'Malwa Brick Kiln (Low Stock Alert)'),
      (4, 2, 'Ambuja PPC Cement', 'Cement', 'Bags', 280.00, 400.00, 375.00, 'Bhopal Cement Agency (Low Stock Alert)'),
      (5, 2, 'Jindal Panther TMT Sariya (12mm)', 'Steel', 'Tons', 18.00, 10.00, 62000.00, 'Jindal Steel Bhopal'),
      (6, 3, 'AAC Lightweight Blocks', 'Bricks', 'Pieces', 4500.00, 1500.00, 72.00, 'Siporex Ujjain'),
      (7, 4, 'River Sand (Coarse)', 'Aggregates', 'Brass', 120.00, 30.00, 5200.00, 'Narmada Sand Supplies');
    `);

    // 3. Labour Attendance & Contractor Assignments
    await conn.query(`
      INSERT INTO labour_attendance (id, project_id, worker_name, category, contractor_agency, daily_wage, attendance_status, work_date, payment_status) VALUES
      (1, 1, 'Rameshwar Patel', 'MASON', 'Devendra Labour Supply', 850.00, 'PRESENT', CURDATE(), 'PAID'),
      (2, 1, 'Santosh Kumar', 'BAR_BENDER', 'Devendra Labour Supply', 800.00, 'PRESENT', CURDATE(), 'PENDING'),
      (3, 1, 'Dilip Yadav', 'CARPENTER', 'Verma Shuttering Works', 780.00, 'PRESENT', CURDATE(), 'PAID'),
      (4, 2, 'Mukesh Bheel', 'GENERAL_LABOUR', 'Bhopal Manpower Agency', 550.00, 'PRESENT', CURDATE(), 'PENDING'),
      (5, 2, 'Imran Khan', 'ELECTRICIAN', 'Bright Electric Works', 900.00, 'PRESENT', CURDATE(), 'PAID'),
      (6, 3, 'Gopal Verma', 'BAR_BENDER', 'Ujjain Civil Contractors', 820.00, 'PRESENT', CURDATE(), 'PENDING'),
      (7, 4, 'Surendra Singh', 'MASON', 'Dewas Labour Force', 850.00, 'PRESENT', CURDATE(), 'PAID');
    `);

    // 4. Accounts & Expenses Table
    try {
      await conn.query("ALTER TABLE expenses MODIFY COLUMN category ENUM('MATERIAL', 'LABOUR', 'EQUIPMENT', 'PERMITS', 'CONTRACTOR', 'CUSTOMER_PAYMENT', 'MISC') NOT NULL;");
    } catch (e) {
      console.log('Category enum alter note:', e.message);
    }

    await conn.query(`
      INSERT INTO expenses (id, project_id, category, amount, payment_mode, invoice_no, vendor_payee, expense_date, description) VALUES
      (1, 1, 'CUSTOMER_PAYMENT', 45000000.00, 'BANK_TRANSFER', 'REC-IND-001', 'Skyline Infra Corp (Client Milestone 4)', CURDATE(), 'Stage 4 slab casting payment received from client'),
      (2, 1, 'MATERIAL', 1250000.00, 'BANK_TRANSFER', 'INV-UT-8941', 'UltraTech Depot Indore', CURDATE(), '1450 Bags of OPC 53 Cement for floor slab'),
      (3, 1, 'LABOUR', 185000.00, 'UPI', 'VOUCH-LAB-102', 'Devendra Labour Supply', CURDATE(), 'Weekly wage payout for 48 site workers'),
      (4, 1, 'CONTRACTOR', 2500000.00, 'CHEQUE', 'CONT-PAY-551', 'Apex Builders Pvt Ltd', CURDATE(), 'Contractor monthly RA Bill No. 8'),
      (5, 2, 'CUSTOMER_PAYMENT', 32000000.00, 'BANK_TRANSFER', 'REC-BHO-002', 'Horizon Realty Group (Client Advance)', CURDATE(), 'Facade finishing advance received'),
      (6, 2, 'MATERIAL', 850000.00, 'BANK_TRANSFER', 'INV-JIN-221', 'Jindal Steel Bhopal', CURDATE(), '18 Tons TMT Steel Bars'),
      (7, 3, 'EQUIPMENT', 420000.00, 'BANK_TRANSFER', 'INV-SCH-4412', 'Schwing Stetter Transit Rental', CURDATE(), 'Transit concrete mixer and crane monthly rental'),
      (8, 4, 'CUSTOMER_PAYMENT', 52000000.00, 'BANK_TRANSFER', 'REC-DEW-004', 'Dewas Mega Logistics (Final Handover)', CURDATE(), 'Pre-handover final installment 90% completed');
    `);

    // 5. Daily Progress Reports (DPR)
    await conn.query(`
      INSERT INTO daily_progress_reports (id, project_id, report_date, weather, milestone_activity, work_description, progress_percent_achieved, issues_or_delays, supervisor_name) VALUES
      (1, 1, CURDATE(), 'Clear / Sunny', 'Tower A - 9th Floor Slab Casting', 'Poured 110 cubic meters of M35 grade concrete. Shuttering and electrical conduits inspected by structural engineer.', 85, 'None. Work moving as per baseline schedule.', 'Er. Ankit Sharma (Site Incharge)'),
      (2, 2, CURDATE(), 'Clear / Sunny', 'Block B - Facade Glazing & External Plaster', 'Installed double-glazed aluminium panels on east wing facade. Internal MEP conduit routing 80% done.', 60, 'None. On Track.', 'Er. Neeraj Verma'),
      (3, 3, CURDATE(), 'Partly Cloudy', 'Pier P-14 Reinforcement & Shuttering', 'Pier cap steel reinforcement tying in progress. Awaiting clearance from utility line authority.', 35, 'Delayed: Underground pipeline relocation pending from municipal dept.', 'Er. Rajesh Chouhan'),
      (4, 4, CURDATE(), 'Clear / Sunny', 'Warehouse Shed 3 - Pre-Engineered Roofing', 'Completed insulated PUF sandwich panel roofing. Floor epoxy leveling and road paving commenced.', 90, 'None. Almost Complete, handover next week.', 'Er. Vikas Malviya');
    `);

    console.log('SUCCESS: All 4 Sites, Materials, Labour, Accounts & DPR populated cleanly!');
    await conn.end();
  } catch (err) {
    console.error('ERROR:', err);
  }
})();
