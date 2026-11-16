const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const DEFAULT_PROJECTS = [
  {
    id: 1,
    project_name: 'Skyline Commercial Hub (Project A)',
    project_code: 'PRJ-IND-01',
    site_location: 'Super Corridor, Indore',
    client_name: 'Skyline Infra Corp',
    contractor_name: 'Apex Builders Pvt Ltd',
    budget: 125000000,
    spent: 98000000,
    start_date: '2025-01-10',
    completion_date: '2026-12-30',
    status: 'IN_PROGRESS',
    progress_percent: 85
  },
  {
    id: 2,
    project_name: 'Grand Horizon Enclave (Project B)',
    project_code: 'PRJ-BHO-02',
    site_location: 'Arera Hills, Bhopal',
    client_name: 'Horizon Realty Group',
    contractor_name: 'Shree Ram Construction',
    budget: 85000000,
    spent: 48000000,
    start_date: '2025-06-15',
    completion_date: '2027-04-15',
    status: 'IN_PROGRESS',
    progress_percent: 60
  },
  {
    id: 3,
    project_name: 'Mahakal Metro Package (Project C)',
    project_code: 'PRJ-UJJ-03',
    site_location: 'Nanakheda Ring Road, Ujjain',
    client_name: 'MP Metro Rail Corp',
    contractor_name: 'L&T Heavy Civil',
    budget: 240000000,
    spent: 92000000,
    start_date: '2025-08-01',
    completion_date: '2028-06-30',
    status: 'ON_HOLD',
    progress_percent: 35
  },
  {
    id: 4,
    project_name: 'Chamunda Industrial Park (Project D)',
    project_code: 'PRJ-DEW-04',
    site_location: 'Industrial Area, Dewas',
    client_name: 'Dewas Mega Logistics',
    contractor_name: 'Malwa Infrastructure Ltd',
    budget: 65000000,
    spent: 56000000,
    start_date: '2024-11-01',
    completion_date: '2026-11-30',
    status: 'IN_PROGRESS',
    progress_percent: 90
  }
];

export const DEFAULT_MATERIALS = [
  { id: 1, project_id: 1, material_name: 'UltraTech 53G Cement', category: 'Cement', unit: 'Bags', current_stock: 1450, min_threshold: 500, unit_price: 390, supplier_name: 'UltraTech Depot Indore', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 2, project_id: 1, material_name: 'Tata Tiscon Fe550D Sariya (16mm)', category: 'Steel', unit: 'Tons', current_stock: 38.5, min_threshold: 15, unit_price: 64500, supplier_name: 'Tata Tiscon Distributors', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 3, project_id: 1, material_name: 'Red Clay Bricks (Class 1)', category: 'Bricks', unit: 'Pieces', current_stock: 8500, min_threshold: 10000, unit_price: 9.5, supplier_name: 'Malwa Brick Kiln (Low Stock Alert)', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 4, project_id: 2, material_name: 'Ambuja PPC Cement', category: 'Cement', unit: 'Bags', current_stock: 280, min_threshold: 400, unit_price: 375, supplier_name: 'Bhopal Cement Agency (Low Stock Alert)', project_name: 'Grand Horizon Enclave (Project B)' },
  { id: 5, project_id: 2, material_name: 'Jindal Panther TMT Sariya (12mm)', category: 'Steel', unit: 'Tons', current_stock: 18, min_threshold: 10, unit_price: 62000, supplier_name: 'Jindal Steel Bhopal', project_name: 'Grand Horizon Enclave (Project B)' },
  { id: 6, project_id: 3, material_name: 'AAC Lightweight Blocks', category: 'Bricks', unit: 'Pieces', current_stock: 4500, min_threshold: 1500, unit_price: 72, supplier_name: 'Siporex Ujjain', project_name: 'Mahakal Metro Package (Project C)' },
  { id: 7, project_id: 4, material_name: 'River Sand (Coarse)', category: 'Aggregates', unit: 'Brass', current_stock: 120, min_threshold: 30, unit_price: 5200, supplier_name: 'Narmada Sand Supplies', project_name: 'Chamunda Industrial Park (Project D)' }
];

export const DEFAULT_LABOUR = [
  { id: 1, project_id: 1, worker_name: 'Rameshwar Patel', category: 'MASON', contractor_agency: 'Devendra Labour Supply', daily_wage: 850, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PAID', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 2, project_id: 1, worker_name: 'Santosh Kumar', category: 'BAR_BENDER', contractor_agency: 'Devendra Labour Supply', daily_wage: 800, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PENDING', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 3, project_id: 1, worker_name: 'Dilip Yadav', category: 'CARPENTER', contractor_agency: 'Verma Shuttering Works', daily_wage: 780, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PAID', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 4, project_id: 2, worker_name: 'Mukesh Bheel', category: 'GENERAL_LABOUR', contractor_agency: 'Bhopal Manpower Agency', daily_wage: 550, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PENDING', project_name: 'Grand Horizon Enclave (Project B)' },
  { id: 5, project_id: 2, worker_name: 'Imran Khan', category: 'ELECTRICIAN', contractor_agency: 'Bright Electric Works', daily_wage: 900, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PAID', project_name: 'Grand Horizon Enclave (Project B)' },
  { id: 6, project_id: 3, worker_name: 'Gopal Verma', category: 'BAR_BENDER', contractor_agency: 'Ujjain Civil Contractors', daily_wage: 820, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PENDING', project_name: 'Mahakal Metro Package (Project C)' },
  { id: 7, project_id: 4, worker_name: 'Surendra Singh', category: 'MASON', contractor_agency: 'Dewas Labour Force', daily_wage: 850, attendance_status: 'PRESENT', work_date: '2026-11-16', payment_status: 'PAID', project_name: 'Chamunda Industrial Park (Project D)' }
];

export const DEFAULT_EQUIPMENT = [
  { id: 1, project_id: 1, equipment_name: 'JCB 3DX Super Backhoe Loader', model_no: 'JCB-3DX-2024', ownership: 'RENTED', daily_rental_cost: 4500, fuel_litres_per_day: 35, status: 'OPERATIONAL', operator_name: 'Raju Dhakad', project_name: 'Skyline Commercial Hub (Project A)', last_service_date: '05 Nov, 2026' },
  { id: 2, project_id: 1, equipment_name: 'Schwing Stetter Concrete Transit Mixer (6 Cum)', model_no: 'AM6SH-N', ownership: 'OWNED', daily_rental_cost: 0, fuel_litres_per_day: 45, status: 'OPERATIONAL', operator_name: 'Devendra Yadav', project_name: 'Skyline Commercial Hub (Project A)', last_service_date: '02 Nov, 2026' },
  { id: 3, project_id: 2, equipment_name: 'Potain Top-Slewing Tower Crane (50m Jib)', model_no: 'MCT-85', ownership: 'RENTED', daily_rental_cost: 12000, fuel_litres_per_day: 0, status: 'OPERATIONAL', operator_name: 'Er. Manoj Verma', project_name: 'Grand Horizon Enclave (Project B)', last_service_date: '10 Oct, 2026' },
  { id: 4, project_id: 2, equipment_name: 'Sany Hydraulic Rotary Piling Rig', model_no: 'SR-215', ownership: 'RENTED', daily_rental_cost: 28000, fuel_litres_per_day: 65, status: 'MAINTENANCE', operator_name: 'Kailash Sharma', project_name: 'Grand Horizon Enclave (Project B)', last_service_date: '11 Nov, 2026' },
  { id: 5, project_id: 3, equipment_name: 'Tata LPK 1618 Tipper Dumper (10 Wheeler)', model_no: 'Tata-1618', ownership: 'OWNED', daily_rental_cost: 0, fuel_litres_per_day: 40, status: 'OPERATIONAL', operator_name: 'Vikram Singh', project_name: 'Mahakal Metro Package (Project C)', last_service_date: '01 Nov, 2026' }
];

export const DEFAULT_ACCOUNTS = {
  summary: {
    totalContractValue: 515000000,
    totalCustomerReceived: 129000000,
    pendingCustomerPayments: 386000000,
    totalActualExpenses: 294000000,
    netCashflow: -165000000,
    breakdown: {
      material: 95000000,
      labour: 48000000,
      contractor: 132000000,
      equipment: 15000000,
      misc: 4000000
    }
  },
  sitePL: [
    {
      id: 1,
      project_name: 'Skyline Commercial Hub (Project A)',
      code: 'PRJ-IND-01',
      location: 'Super Corridor, Indore',
      progress: 85,
      budget: 125000000,
      spent: 98000000,
      customer_received: 45000000,
      pending_customer: 80000000,
      estimated_profit: 27000000,
      profit_margin_pct: 22,
      status: 'PROFITABLE'
    },
    {
      id: 2,
      project_name: 'Grand Horizon Enclave (Project B)',
      code: 'PRJ-BHO-02',
      location: 'Arera Hills, Bhopal',
      progress: 60,
      budget: 85000000,
      spent: 48000000,
      customer_received: 32000000,
      pending_customer: 53000000,
      estimated_profit: 37000000,
      profit_margin_pct: 44,
      status: 'PROFITABLE'
    },
    {
      id: 3,
      project_name: 'Mahakal Metro Package (Project C)',
      code: 'PRJ-UJJ-03',
      location: 'Nanakheda Ring Road, Ujjain',
      progress: 35,
      budget: 240000000,
      spent: 92000000,
      customer_received: 0,
      pending_customer: 240000000,
      estimated_profit: 148000000,
      profit_margin_pct: 62,
      status: 'PROFITABLE'
    },
    {
      id: 4,
      project_name: 'Chamunda Industrial Park (Project D)',
      code: 'PRJ-DEW-04',
      location: 'Industrial Area, Dewas',
      progress: 90,
      budget: 65000000,
      spent: 56000000,
      customer_received: 52000000,
      pending_customer: 13000000,
      estimated_profit: 9000000,
      profit_margin_pct: 14,
      status: 'PROFITABLE'
    }
  ],
  transactions: [
    { id: 1, project_id: 1, category: 'CUSTOMER_PAYMENT', amount: 45000000, payment_mode: 'BANK_TRANSFER', invoice_no: 'REC-IND-001', vendor_payee: 'Skyline Infra Corp (Client Milestone 4)', expense_date: '2026-11-15', description: 'Stage 4 slab casting payment received from client', project_name: 'Skyline Commercial Hub (Project A)' },
    { id: 2, project_id: 1, category: 'MATERIAL', amount: 1250000, payment_mode: 'BANK_TRANSFER', invoice_no: 'INV-UT-8941', vendor_payee: 'UltraTech Depot Indore', expense_date: '2026-11-14', description: '1450 Bags of OPC 53 Cement for floor slab', project_name: 'Skyline Commercial Hub (Project A)' },
    { id: 3, project_id: 1, category: 'LABOUR', amount: 185000, payment_mode: 'UPI', invoice_no: 'VOUCH-LAB-102', vendor_payee: 'Devendra Labour Supply', expense_date: '2026-11-13', description: 'Weekly wage payout for 48 site workers', project_name: 'Skyline Commercial Hub (Project A)' },
    { id: 4, project_id: 1, category: 'CONTRACTOR', amount: 2500000, payment_mode: 'CHEQUE', invoice_no: 'CONT-PAY-551', vendor_payee: 'Apex Builders Pvt Ltd', expense_date: '2026-11-12', description: 'Contractor monthly RA Bill No. 8', project_name: 'Skyline Commercial Hub (Project A)' },
    { id: 5, project_id: 2, category: 'CUSTOMER_PAYMENT', amount: 32000000, payment_mode: 'BANK_TRANSFER', invoice_no: 'REC-BHO-002', vendor_payee: 'Horizon Realty Group (Client Advance)', expense_date: '2026-11-11', description: 'Facade finishing advance received', project_name: 'Grand Horizon Enclave (Project B)' },
    { id: 6, project_id: 2, category: 'MATERIAL', amount: 850000, payment_mode: 'BANK_TRANSFER', invoice_no: 'INV-JIN-221', vendor_payee: 'Jindal Steel Bhopal', expense_date: '2026-11-10', description: '18 Tons TMT Steel Bars', project_name: 'Grand Horizon Enclave (Project B)' },
    { id: 7, project_id: 3, category: 'EQUIPMENT', amount: 420000, payment_mode: 'BANK_TRANSFER', invoice_no: 'INV-SCH-4412', vendor_payee: 'Schwing Stetter Transit Rental', expense_date: '2026-11-09', description: 'Transit concrete mixer and crane monthly rental', project_name: 'Mahakal Metro Package (Project C)' },
    { id: 8, project_id: 4, category: 'CUSTOMER_PAYMENT', amount: 52000000, payment_mode: 'BANK_TRANSFER', invoice_no: 'REC-DEW-004', vendor_payee: 'Dewas Mega Logistics (Final Handover)', expense_date: '2026-11-08', description: 'Pre-handover final installment 90% completed', project_name: 'Chamunda Industrial Park (Project D)' }
  ]
};

export const DEFAULT_DPR = [
  { id: 1, project_id: 1, report_date: '2026-11-16', weather: 'Clear / Sunny', milestone_activity: 'Tower A - 9th Floor Slab Casting', work_description: 'Poured 110 cubic meters of M35 grade concrete. Shuttering and electrical conduits inspected by structural engineer.', progress_percent_achieved: 85, issues_or_delays: 'None. Work moving as per baseline schedule.', supervisor_name: 'Er. Ankit Sharma (Site Incharge)', project_name: 'Skyline Commercial Hub (Project A)' },
  { id: 2, project_id: 2, report_date: '2026-11-16', weather: 'Clear / Sunny', milestone_activity: 'Block B - Facade Glazing & External Plaster', work_description: 'Installed double-glazed aluminium panels on east wing facade. Internal MEP conduit routing 80% done.', progress_percent_achieved: 60, issues_or_delays: 'None. On Track.', supervisor_name: 'Er. Neeraj Verma', project_name: 'Grand Horizon Enclave (Project B)' },
  { id: 3, project_id: 3, report_date: '2026-11-16', weather: 'Partly Cloudy', milestone_activity: 'Pier P-14 Reinforcement & Shuttering', work_description: 'Pier cap steel reinforcement tying in progress. Awaiting clearance from utility line authority.', progress_percent_achieved: 35, issues_or_delays: 'Delayed: Underground pipeline relocation pending from municipal dept.', supervisor_name: 'Er. Rajesh Chouhan', project_name: 'Mahakal Metro Package (Project C)' },
  { id: 4, project_id: 4, report_date: '2026-11-16', weather: 'Clear / Sunny', milestone_activity: 'Warehouse Shed 3 - Pre-Engineered Roofing', work_description: 'Completed insulated PUF sandwich panel roofing. Floor epoxy leveling and road paving commenced.', progress_percent_achieved: 90, issues_or_delays: 'None. Almost Complete, handover next week.', supervisor_name: 'Er. Vikas Malviya', project_name: 'Chamunda Industrial Park (Project D)' }
];

export const DEFAULT_DOCUMENTS = [
  {
    id: 'DOC-101',
    title: 'Architectural Floor Plans & Structural CAD Layout (G+12)',
    category: 'Blueprint',
    project_id: 1,
    site: 'Skyline Commercial Hub (Project A)',
    type: 'DWG / CAD',
    version: 'Rev 4.2',
    size: '28.4 MB',
    upload_date: '2026-10-15',
    expiry_date: '2029-12-31',
    status: 'VALID',
    uploaded_by: 'Er. Ankit Sharma (Chief Architect)',
    preview_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    description: 'Complete working drawings for Ground to 12th Floor including column grid, shear walls, and MEP shafts.'
  },
  {
    id: 'DOC-102',
    title: 'Municipal Corporation Building Sanction & Commencement Certificate',
    category: 'NOC & Sanction',
    project_id: 1,
    site: 'Skyline Commercial Hub (Project A)',
    type: 'PDF Scan',
    version: 'Approval No. IMC/2024/7821',
    size: '4.8 MB',
    upload_date: '2025-01-20',
    expiry_date: '2026-12-15',
    status: 'EXPIRING_SOON',
    uploaded_by: 'Legal & Liaison Dept',
    preview_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    description: 'Official municipal building permission certificate. Renewal application required before 15 Dec 2026.'
  },
  {
    id: 'DOC-103',
    title: 'State Pollution Control Board Environmental Clearance (CTE / CTO)',
    category: 'Clearance',
    project_id: 2,
    site: 'Grand Horizon Enclave (Project B)',
    type: 'PDF Signed',
    version: 'Consent Order PCB/IND/884',
    size: '6.2 MB',
    upload_date: '2024-11-10',
    expiry_date: '2026-11-20',
    status: 'CRITICAL',
    uploaded_by: 'Compliance Officer',
    preview_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    description: 'Consent to Operate and air/water quality compliance certificate issued by MPPCB. Renewal required urgently.'
  },
  {
    id: 'DOC-104',
    title: 'Main Civil Contractor EPC Agreement with Liquidated Damages Clause',
    category: 'Legal Contract',
    project_id: 2,
    site: 'Grand Horizon Enclave (Project B)',
    type: 'PDF Signed',
    version: 'Contract Ref: GHE-EPC-2025',
    size: '12.1 MB',
    upload_date: '2025-03-01',
    expiry_date: '2027-03-01',
    status: 'VALID',
    uploaded_by: 'Contract Admin',
    preview_url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80',
    description: 'Executed construction contract with Larsen Civil Infra Ltd with milestone release schedule.'
  },
  {
    id: 'DOC-105',
    title: 'Underground Metro Pier Structural Stability & Soil Mechanics Report',
    category: 'Blueprint',
    project_id: 3,
    site: 'Mahakal Metro Package (Project C)',
    type: 'PDF / CAD',
    version: 'IIT Structural Audit v2',
    size: '34.6 MB',
    upload_date: '2026-05-18',
    expiry_date: '2027-05-18',
    status: 'VALID',
    uploaded_by: 'Er. Rajesh Chouhan',
    preview_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=800&auto=format&fit=crop&q=80',
    description: 'Geotechnical bore log and structural stability clearance for metro viaduct piers P-10 to P-24.'
  },
  {
    id: 'DOC-106',
    title: 'Tower Crane & Passenger Hoist Annual Third-Party Safety Fitness NOC',
    category: 'Safety & Insurance',
    project_id: 3,
    site: 'Mahakal Metro Package (Project C)',
    type: 'PDF Scan',
    version: 'Safety Certificate #TC-991',
    size: '3.1 MB',
    upload_date: '2025-10-10',
    expiry_date: '2026-10-10',
    status: 'EXPIRED',
    uploaded_by: 'Site Safety Engineer',
    preview_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    description: 'Statutory annual load-test and wire rope inspection certificate. EXPIRED — renewal mandatory before operating.'
  },
  {
    id: 'DOC-107',
    title: 'Pre-Engineered Building (PEB) Structural Blueprint & Roof Truss CAD',
    category: 'Blueprint',
    project_id: 4,
    site: 'Chamunda Industrial Park (Project D)',
    type: 'DWG / CAD',
    version: 'PEB-Shed3-Rev2',
    size: '19.8 MB',
    upload_date: '2026-08-12',
    expiry_date: '2030-01-01',
    status: 'VALID',
    uploaded_by: 'Er. Vikas Malviya',
    preview_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&auto=format&fit=crop&q=80',
    description: 'Detailed structural drawing for 60-meter clear span industrial warehouse shed with crane gantry beams.'
  },
  {
    id: 'DOC-108',
    title: 'Workmen Compensation & Commercial General Liability (CGL) Insurance',
    category: 'Safety & Insurance',
    project_id: 4,
    site: 'Chamunda Industrial Park (Project D)',
    type: 'PDF Signed',
    version: 'Policy #BAJAJ-CGL-4482',
    size: '5.5 MB',
    upload_date: '2025-12-05',
    expiry_date: '2026-12-04',
    status: 'EXPIRING_SOON',
    uploaded_by: 'HR & Accounts Dept',
    preview_url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    description: 'Covers 150 site workers, subcontractors, and third-party liabilities up to ₹10 Crore.'
  }
];

export const DEFAULT_DASHBOARD = {
  total_projects: 4,
  total_budget: 515000000,
  total_spent: 294000000,
  avg_progress: 67.5,
  siteStatus: [
    { id: 1, name: 'Skyline Commercial Hub (Project A)', progress: 85, status: 'On Track', statusType: 'success', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Grand Horizon Enclave (Project B)', progress: 60, status: 'On Track', statusType: 'success', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Mahakal Metro Package (Project C)', progress: 35, status: 'Delayed', statusType: 'danger', img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Chamunda Industrial Park (Project D)', progress: 90, status: 'On Track', statusType: 'success', img: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=150&auto=format&fit=crop&q=80' }
  ],
  materialsAlerts: [
    { id: 3, name: 'Red Clay Bricks (Class 1)', current_stock: 8500, min_threshold: 10000, unit: 'Pieces', isUrgent: true, isLow: true, img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop&q=80' },
    { id: 4, name: 'Ambuja PPC Cement', current_stock: 280, min_threshold: 400, unit: 'Bags', isUrgent: true, isLow: true, img: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=100&auto=format&fit=crop&q=80' }
  ]
};

// Storage helper functions
function getStored(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
  } catch (e) {}
  return defaultValue;
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

async function safeFetch(url, options = {}, fallbackFn) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Backend API is either down, unreachable, or running in static Vercel mode
  }
  return typeof fallbackFn === 'function' ? fallbackFn() : fallbackFn;
}

export const api = {
  // Dashboard stats
  getDashboard: () => safeFetch(`${API_BASE}/reports/dashboard`, {}, () => DEFAULT_DASHBOARD),

  // Projects
  getProjects: () => safeFetch(`${API_BASE}/projects`, {}, () => getStored('sitepilot_projects', DEFAULT_PROJECTS)),
  
  getProjectById: (id) => safeFetch(`${API_BASE}/projects/${id}`, {}, () => {
    const list = getStored('sitepilot_projects', DEFAULT_PROJECTS);
    return list.find(p => String(p.id) === String(id)) || list[0];
  }),

  createProject: (data) => safeFetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const current = getStored('sitepilot_projects', DEFAULT_PROJECTS);
    const newProj = {
      id: Date.now(),
      project_name: data.project_name || 'New Construction Site',
      project_code: data.project_code || `PRJ-NEW-${Math.floor(Math.random() * 90 + 10)}`,
      site_location: data.site_location || 'Madhya Pradesh',
      client_name: data.client_name || 'Client Corp',
      contractor_name: data.contractor_name || 'Prime Contractor',
      budget: Number(data.budget) || 10000000,
      spent: 0,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      completion_date: data.completion_date || '',
      status: data.status || 'IN_PROGRESS',
      progress_percent: Number(data.progress_percent) || 10
    };
    const updated = [newProj, ...current];
    setStored('sitepilot_projects', updated);
    return newProj;
  }),

  updateProject: (id, data) => safeFetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const current = getStored('sitepilot_projects', DEFAULT_PROJECTS);
    const updated = current.map(p => {
      if (String(p.id) === String(id)) {
        return { ...p, ...data };
      }
      return p;
    });
    setStored('sitepilot_projects', updated);
    return { success: true };
  }),

  deleteProject: (id) => safeFetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' }, () => {
    const current = getStored('sitepilot_projects', DEFAULT_PROJECTS);
    const updated = current.filter(p => String(p.id) !== String(id));
    setStored('sitepilot_projects', updated);
    return { success: true };
  }),

  // Materials & Inventory
  getMaterials: (projectId) => safeFetch(`${API_BASE}/materials${projectId ? `?projectId=${projectId}` : ''}`, {}, () => {
    const list = getStored('sitepilot_materials', DEFAULT_MATERIALS);
    if (projectId) {
      return list.filter(m => String(m.project_id) === String(projectId));
    }
    return list;
  }),

  createMaterial: (data) => safeFetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const list = getStored('sitepilot_materials', DEFAULT_MATERIALS);
    const newMat = {
      id: Date.now(),
      project_id: data.project_id || 1,
      material_name: data.material_name || 'Material Item',
      category: data.category || 'Cement',
      unit: data.unit || 'Units',
      current_stock: Number(data.current_stock) || 0,
      min_threshold: Number(data.min_threshold) || 10,
      unit_price: Number(data.unit_price) || 0,
      supplier_name: data.supplier_name || 'Site Vendor'
    };
    const updated = [newMat, ...list];
    setStored('sitepilot_materials', updated);
    return newMat;
  }),

  deleteMaterial: (id) => safeFetch(`${API_BASE}/materials/${id}`, { method: 'DELETE' }, () => {
    const list = getStored('sitepilot_materials', DEFAULT_MATERIALS);
    const updated = list.filter(m => String(m.id) !== String(id));
    setStored('sitepilot_materials', updated);
    return { success: true };
  }),

  // Labour
  getLabour: (projectId) => safeFetch(`${API_BASE}/labour${projectId ? `?projectId=${projectId}` : ''}`, {}, () => {
    const list = getStored('sitepilot_labour', DEFAULT_LABOUR);
    if (projectId) {
      return list.filter(l => String(l.project_id) === String(projectId));
    }
    return list;
  }),

  createLabour: (data) => safeFetch(`${API_BASE}/labour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const list = getStored('sitepilot_labour', DEFAULT_LABOUR);
    const newLabour = {
      id: Date.now(),
      project_id: data.project_id || 1,
      worker_name: data.worker_name || 'Worker',
      category: data.category || 'MASON',
      contractor_agency: data.contractor_agency || 'Site Agency',
      daily_wage: Number(data.daily_wage) || 750,
      attendance_status: data.attendance_status || 'PRESENT',
      work_date: data.work_date || new Date().toISOString().split('T')[0],
      payment_status: data.payment_status || 'PENDING'
    };
    const updated = [newLabour, ...list];
    setStored('sitepilot_labour', updated);
    return newLabour;
  }),

  updateLabourPayment: (id, status) => safeFetch(`${API_BASE}/labour/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: status })
  }, () => {
    const list = getStored('sitepilot_labour', DEFAULT_LABOUR);
    const updated = list.map(l => {
      if (String(l.id) === String(id)) {
        return { ...l, payment_status: status };
      }
      return l;
    });
    setStored('sitepilot_labour', updated);
    return { success: true };
  }),

  // Equipment Fleet
  getEquipment: (projectId) => safeFetch(`${API_BASE}/equipment${projectId ? `?projectId=${projectId}` : ''}`, {}, () => {
    const list = getStored('sitepilot_equipment', DEFAULT_EQUIPMENT);
    if (projectId) {
      return list.filter(e => String(e.project_id) === String(projectId));
    }
    return list;
  }),

  createEquipment: (data) => safeFetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const list = getStored('sitepilot_equipment', DEFAULT_EQUIPMENT);
    const newEq = {
      id: Date.now(),
      project_id: data.project_id || 1,
      equipment_name: data.equipment_name || 'Fleet Machinery',
      model_no: data.model_no || 'MOD-01',
      ownership: data.ownership || 'RENTED',
      daily_rental_cost: Number(data.daily_rental_cost) || 0,
      fuel_litres_per_day: Number(data.fuel_litres_per_day) || 30,
      status: data.status || 'OPERATIONAL',
      operator_name: data.operator_name || 'Assigned Operator',
      last_service_date: data.last_service_date || new Date().toISOString().split('T')[0]
    };
    const updated = [newEq, ...list];
    setStored('sitepilot_equipment', updated);
    return newEq;
  }),

  // Accounts & Payments
  getAccounts: () => safeFetch(`${API_BASE}/accounts/overview`, {}, () => getStored('sitepilot_accounts', DEFAULT_ACCOUNTS)),

  createTransaction: (data) => safeFetch(`${API_BASE}/accounts/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const current = getStored('sitepilot_accounts', DEFAULT_ACCOUNTS);
    const amt = Number(data.amount) || 0;
    const newTx = {
      id: Date.now(),
      project_id: data.project_id || 1,
      category: data.category || 'CUSTOMER_PAYMENT',
      amount: amt,
      payment_mode: data.payment_mode || 'BANK_TRANSFER',
      invoice_no: data.invoice_no || `TX-${Date.now().toString().slice(-4)}`,
      vendor_payee: data.vendor_payee || 'Payee',
      expense_date: data.expense_date || new Date().toISOString().split('T')[0],
      description: data.description || 'Transaction entry'
    };
    const updatedTx = [newTx, ...(current.transactions || [])];
    const isReceived = data.category === 'CUSTOMER_PAYMENT';
    const updatedSummary = {
      ...current.summary,
      totalCustomerReceived: isReceived ? current.summary.totalCustomerReceived + amt : current.summary.totalCustomerReceived,
      totalActualExpenses: !isReceived ? current.summary.totalActualExpenses + amt : current.summary.totalActualExpenses
    };
    const updated = {
      ...current,
      summary: updatedSummary,
      transactions: updatedTx
    };
    setStored('sitepilot_accounts', updated);
    return { success: true, id: newTx.id };
  }),

  // DPR Reports
  getDpr: (projectId) => safeFetch(`${API_BASE}/reports/dpr${projectId ? `?projectId=${projectId}` : ''}`, {}, () => {
    const list = getStored('sitepilot_dpr', DEFAULT_DPR);
    if (projectId) {
      return list.filter(d => String(d.project_id) === String(projectId));
    }
    return list;
  }),

  createDpr: (data) => safeFetch(`${API_BASE}/reports/dpr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const list = getStored('sitepilot_dpr', DEFAULT_DPR);
    const newDpr = {
      id: Date.now(),
      project_id: data.project_id || 1,
      report_date: data.report_date || new Date().toISOString().split('T')[0],
      weather: data.weather || 'Clear / Sunny',
      milestone_activity: data.milestone_activity || 'Site Construction Work',
      work_description: data.work_description || '',
      progress_percent_achieved: Number(data.progress_percent_achieved) || 50,
      issues_or_delays: data.issues_or_delays || 'None. On schedule.',
      supervisor_name: data.supervisor_name || 'Site Supervisor'
    };
    const updated = [newDpr, ...list];
    setStored('sitepilot_dpr', updated);
    return newDpr;
  }),

  // Documents & Blueprints Vault
  getDocuments: (projectId) => safeFetch(`${API_BASE}/documents${projectId ? `?projectId=${projectId}` : ''}`, {}, () => {
    const list = getStored('sitepilot_documents', DEFAULT_DOCUMENTS);
    if (projectId) {
      return list.filter(d => String(d.project_id) === String(projectId));
    }
    return list;
  }),

  uploadDocument: (data) => safeFetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, () => {
    const list = getStored('sitepilot_documents', DEFAULT_DOCUMENTS);
    const newDoc = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      title: data.title || 'Untitled Construction Document',
      category: data.category || 'Blueprint',
      project_id: Number(data.project_id) || 1,
      site: data.site || 'Skyline Commercial Hub (Project A)',
      type: data.type || 'PDF / DWG',
      version: data.version || 'Rev 1.0',
      size: data.size || '5.2 MB',
      upload_date: data.upload_date || new Date().toISOString().split('T')[0],
      expiry_date: data.expiry_date || '2028-12-31',
      status: data.status || 'VALID',
      uploaded_by: data.uploaded_by || 'Site Engineer',
      preview_url: data.preview_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      description: data.description || 'Uploaded blueprint and statutory compliance document'
    };
    const updated = [newDoc, ...list];
    setStored('sitepilot_documents', updated);
    return newDoc;
  }),

  renewDocument: (id, newExpiryDate) => safeFetch(`${API_BASE}/documents/${id}/renew`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expiry_date: newExpiryDate })
  }, () => {
    const list = getStored('sitepilot_documents', DEFAULT_DOCUMENTS);
    const updated = list.map(d => {
      if (String(d.id) === String(id)) {
        return {
          ...d,
          expiry_date: newExpiryDate,
          status: 'VALID'
        };
      }
      return d;
    });
    setStored('sitepilot_documents', updated);
    return { success: true };
  }),

  deleteDocument: (id) => safeFetch(`${API_BASE}/documents/${id}`, {
    method: 'DELETE'
  }, () => {
    const list = getStored('sitepilot_documents', DEFAULT_DOCUMENTS);
    const updated = list.filter(d => String(d.id) !== String(id));
    setStored('sitepilot_documents', updated);
    return { success: true };
  })
};

// Document Expiry & Compliance Evaluator
export function computeDocumentExpiry(doc) {
  if (!doc.expiry_date || String(doc.expiry_date).toLowerCase() === 'perpetual') {
    return {
      status: 'PERPETUAL',
      daysLeft: 9999,
      badgeText: 'Perpetual / Lifetime',
      badgeClass: 'tag-green',
      isExpired: false,
      isExpiringSoon: false
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(doc.expiry_date);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    return {
      status: 'EXPIRED',
      daysLeft,
      badgeText: `Expired ${Math.abs(daysLeft)}d ago`,
      badgeClass: 'tag-red',
      isExpired: true,
      isExpiringSoon: false
    };
  } else if (daysLeft <= 15) {
    return {
      status: 'CRITICAL',
      daysLeft,
      badgeText: `Expires in ${daysLeft}d (Critical)`,
      badgeClass: 'tag-red',
      isExpired: false,
      isExpiringSoon: true
    };
  } else if (daysLeft <= 60) {
    return {
      status: 'EXPIRING_SOON',
      daysLeft,
      badgeText: `Renewal Due in ${daysLeft}d`,
      badgeClass: 'tag-amber',
      isExpired: false,
      isExpiringSoon: true
    };
  } else {
    return {
      status: 'VALID',
      daysLeft,
      badgeText: `Valid (${daysLeft}d remaining)`,
      badgeClass: 'tag-green',
      isExpired: false,
      isExpiringSoon: false
    };
  }
}
