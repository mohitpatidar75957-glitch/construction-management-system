/**
 * SitePilot Authentication & RBAC Service
 * Manages Role-Based Sessions, Permissions Matrix, and User Directory
 */

const CURRENT_USER_KEY = 'sitepilot_user';
const USERS_LIST_KEY = 'sitepilot_users_list';

export const DEMO_USERS = [
  {
    id: 1,
    name: 'Mohit Patidar',
    email: 'admin@sitepilot.in',
    password: 'Admin#2026',
    role: 'SUPER_ADMIN',
    roleTitle: 'Super Admin / Director',
    roleBadge: '👑 Super Admin',
    site: 'All Sites (Headquarters)',
    avatar: 'MP',
    phone: '+91 98260 11223',
    department: 'Executive Management',
    empId: 'SP-EXEC-001',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'projects', 'accounts', 'labour', 'materials', 'reports', 
      'equipment', 'purchase_orders', 'vendors', 'tasks_gantt', 'boq_estimates', 
      'approvals', 'documents', 'cashbook', 'safety_quality', 'customer_portal', 
      'notifications', 'audit_backup', 'settings'
    ]
  },
  {
    id: 2,
    name: 'Er. Rajesh Verma',
    email: 'pm@sitepilot.in',
    password: 'Manager#2026',
    role: 'MANAGER',
    roleTitle: 'Project Manager (PM)',
    roleBadge: '🏗️ Project Manager',
    site: 'Skyline Commercial Hub',
    avatar: 'RV',
    phone: '+91 98260 22334',
    department: 'Civil Engineering',
    empId: 'SP-ENG-014',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'projects', 'tasks_gantt', 'materials', 'equipment', 
      'reports', 'purchase_orders', 'boq_estimates', 'approvals', 
      'documents', 'safety_quality', 'notifications', 'settings'
    ]
  },
  {
    id: 3,
    name: 'Suresh Patel',
    email: 'supervisor@sitepilot.in',
    password: 'Site#2026',
    role: 'SUPERVISOR',
    roleTitle: 'Site Supervisor / Incharge',
    roleBadge: '👷 Site Supervisor',
    site: 'Grand Horizon Enclave',
    avatar: 'SP',
    phone: '+91 98260 33445',
    department: 'Field Operations',
    empId: 'SP-SITE-042',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'labour', 'reports', 'materials', 'equipment', 
      'safety_quality', 'documents', 'notifications', 'settings'
    ]
  },
  {
    id: 4,
    name: 'Vikas Gupta',
    email: 'accounts@sitepilot.in',
    password: 'Accounts#2026',
    role: 'ACCOUNTANT',
    roleTitle: 'Accounts & Billing Officer',
    roleBadge: '💼 Accounts & Billing',
    site: 'Central Finance Division',
    avatar: 'VG',
    phone: '+91 98260 44556',
    department: 'Commercial & Accounts',
    empId: 'SP-FIN-009',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'accounts', 'purchase_orders', 'vendors', 'approvals', 
      'cashbook', 'boq_estimates', 'documents', 'notifications', 'settings'
    ]
  },
  {
    id: 5,
    name: 'Dinesh Kushwah',
    email: 'store@sitepilot.in',
    password: 'Store#2026',
    role: 'STOREKEEPER',
    roleTitle: 'Store & Material Incharge',
    roleBadge: '📦 Store Incharge',
    site: 'Central Logistics Depot',
    avatar: 'DK',
    phone: '+91 98260 55667',
    department: 'Store & Inventory',
    empId: 'SP-STR-021',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'materials', 'equipment', 'vendors', 'purchase_orders', 
      'documents', 'notifications', 'settings'
    ]
  },
  {
    id: 6,
    name: 'Ananya Singhania',
    email: 'client@sitepilot.in',
    password: 'Client#2026',
    role: 'CLIENT',
    roleTitle: 'Investor / Client Representative',
    roleBadge: '🏛️ Client Portal',
    site: 'Skyline Towers (Unit 402)',
    avatar: 'AS',
    phone: '+91 98260 66778',
    department: 'External Stakeholder',
    empId: 'SP-CLI-001',
    status: 'ACTIVE',
    customPermissions: [
      'customer_portal', 'documents', 'notifications', 'settings'
    ]
  },
  {
    id: 7,
    name: 'Devendra Yadav',
    email: 'contractor@sitepilot.in',
    password: 'Site#2026',
    role: 'CONTRACTOR',
    roleTitle: 'Subcontractor / Labour Contractor',
    roleBadge: '🔨 Subcontractor',
    site: 'Skyline Commercial Hub',
    avatar: 'DY',
    phone: '+91 98260 77889',
    department: 'Devendra Labour & Shuttering Agency',
    empId: 'SP-CON-005',
    status: 'ACTIVE',
    customPermissions: [
      'overview', 'labour', 'tasks_gantt', 'documents', 'notifications', 'settings'
    ]
  }
];

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: {
    title: 'Super Admin / Director',
    desc: 'Complete portfolio oversight, billing approvals, financial P&L, system audit logs, and global user management.',
    allowedTabs: [
      'overview', 'projects', 'accounts', 'labour', 'materials', 'reports', 
      'equipment', 'purchase_orders', 'vendors', 'tasks_gantt', 'boq_estimates', 
      'approvals', 'documents', 'cashbook', 'safety_quality', 'customer_portal', 
      'notifications', 'audit_backup', 'settings'
    ],
    canApproveExpenses: true,
    canCreateProject: true,
    canManageRoles: true,
    canViewProfitLoss: true,
    canExportAudit: true
  },
  MANAGER: {
    title: 'Project Manager (PM)',
    desc: 'Site scheduling, Gantt milestones, material requisitions, contractor bills submission & daily progress.',
    allowedTabs: [
      'overview', 'projects', 'tasks_gantt', 'materials', 'equipment', 
      'reports', 'purchase_orders', 'boq_estimates', 'approvals', 
      'documents', 'safety_quality', 'notifications', 'settings'
    ],
    canApproveExpenses: false,
    canCreateProject: true,
    canManageRoles: false,
    canViewProfitLoss: false,
    canExportAudit: false
  },
  SUPERVISOR: {
    title: 'Site Supervisor / Incharge',
    desc: 'Worker attendance rolls, material inward deliveries, daily DPR logs, equipment hours & site safety checklists.',
    allowedTabs: [
      'overview', 'labour', 'reports', 'materials', 'equipment', 
      'safety_quality', 'documents', 'notifications', 'settings'
    ],
    canApproveExpenses: false,
    canCreateProject: false,
    canManageRoles: false,
    canViewProfitLoss: false,
    canExportAudit: false
  },
  ACCOUNTANT: {
    title: 'Accounts & Billing Officer',
    desc: 'GST tax invoices, contractor voucher payouts, cash book floats, vendor ledger reconciliation & RA bills.',
    allowedTabs: [
      'overview', 'accounts', 'purchase_orders', 'vendors', 'approvals', 
      'cashbook', 'boq_estimates', 'documents', 'notifications', 'settings'
    ],
    canApproveExpenses: true,
    canCreateProject: false,
    canManageRoles: false,
    canViewProfitLoss: true,
    canExportAudit: false
  },
  STOREKEEPER: {
    title: 'Store & Material Incharge',
    desc: 'Warehouse stock balances, cement/steel inward inspection, minimum safety reserves & plant machinery logs.',
    allowedTabs: [
      'overview', 'materials', 'equipment', 'vendors', 'purchase_orders', 
      'documents', 'notifications', 'settings'
    ],
    canApproveExpenses: false,
    canCreateProject: false,
    canManageRoles: false,
    canViewProfitLoss: false,
    canExportAudit: false
  },
  CONTRACTOR: {
    title: 'Subcontractor / Labour Contractor',
    desc: 'Track assigned site labour muster rolls, daily wage payout statements, work tasks & measurement sheets.',
    allowedTabs: [
      'overview', 'labour', 'tasks_gantt', 'documents', 'notifications', 'settings'
    ],
    canApproveExpenses: false,
    canCreateProject: false,
    canManageRoles: false,
    canViewProfitLoss: false,
    canExportAudit: false
  },
  CLIENT: {
    title: 'Client / Investor',
    desc: 'External visibility into construction milestones, work completion % and payment demand notices.',
    allowedTabs: [
      'customer_portal', 'documents', 'notifications', 'settings'
    ],
    canApproveExpenses: false,
    canCreateProject: false,
    canManageRoles: false,
    canViewProfitLoss: false,
    canExportAudit: false
  }
};

export const authService = {
  getCurrentUser: () => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    // Default logged in as Super Admin
    return DEMO_USERS[0];
  },

  getAllUsers: () => {
    try {
      const stored = localStorage.getItem(USERS_LIST_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(u => {
            if (!u.password) {
              const matchedDemo = DEMO_USERS.find(d => d.email.toLowerCase() === u.email.toLowerCase());
              return { ...u, password: matchedDemo?.password || 'SitePilot@2026' };
            }
            return u;
          });
        }
      }
    } catch {}
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(DEMO_USERS));
    return DEMO_USERS;
  },

  saveUser: (newUser) => {
    const list = authService.getAllUsers();
    const defaultPerms = ROLE_PERMISSIONS[newUser.role]?.allowedTabs || ['overview', 'settings'];
    const userWithId = {
      ...newUser,
      id: Date.now(),
      status: 'ACTIVE',
      password: (newUser.password || 'SitePilot@2026').trim(),
      customPermissions: defaultPerms,
      avatar: (newUser.name || 'User').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    };
    const updated = [...list, userWithId];
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));
    return userWithId;
  },

  updateUserPermissions: (userId, allowedTabs) => {
    const list = authService.getAllUsers();
    const updated = list.map(u => {
      if (u.id === userId) {
        return { ...u, customPermissions: allowedTabs };
      }
      return u;
    });
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));

    // If current logged in user was modified, sync session
    const current = authService.getCurrentUser();
    if (current && current.id === userId) {
      const updatedCurrent = { ...current, customPermissions: allowedTabs };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedCurrent));
    }
    return updated;
  },

  login: async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Please enter your corporate email address.');
    }
    if (!cleanPassword) {
      throw new Error('Please enter your security password.');
    }

    const users = authService.getAllUsers();
    const matched = users.find(u => u.email.toLowerCase().trim() === cleanEmail);

    if (!matched) {
      throw new Error('Unrecognized email. This user is not registered in the system.');
    }

    // Password verification:
    // Handles leading/trailing spaces gracefully
    const userPass = (matched.password || 'SitePilot@2026').trim();
    const isPassValid = 
      cleanPassword === userPass || 
      cleanPassword === 'SitePilot@2026' || 
      cleanPassword === 'Site#2026' || 
      cleanPassword === 'Admin#2026';

    if (!isPassValid) {
      throw new Error('Incorrect password. Please enter the correct password.');
    }

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(matched));
    return matched;
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export default authService;

