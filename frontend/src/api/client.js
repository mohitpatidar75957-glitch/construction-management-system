const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const api = {
  // Dashboard stats
  getDashboard: () => fetch(`${API_BASE}/reports/dashboard`).then(r => r.json()),

  // Projects
  getProjects: () => fetch(`${API_BASE}/projects`).then(r => r.json()),
  getProjectById: (id) => fetch(`${API_BASE}/projects/${id}`).then(r => r.json()),
  createProject: (data) => fetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateProject: (id, data) => fetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteProject: (id) => fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Materials & Inventory
  getMaterials: (projectId) => fetch(`${API_BASE}/materials${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.json()),
  createMaterial: (data) => fetch(`${API_BASE}/materials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  deleteMaterial: (id) => fetch(`${API_BASE}/materials/${id}`, { method: 'DELETE' }).then(r => r.json()),

  // Labour
  getLabour: (projectId) => fetch(`${API_BASE}/labour${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.json()),
  createLabour: (data) => fetch(`${API_BASE}/labour`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  updateLabourPayment: (id, status) => fetch(`${API_BASE}/labour/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ payment_status: status })
  }).then(r => r.json()),

  // Equipment Fleet
  getEquipment: (projectId) => fetch(`${API_BASE}/equipment${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.json()),
  createEquipment: (data) => fetch(`${API_BASE}/equipment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // Accounts & Payments
  getAccounts: () => fetch(`${API_BASE}/accounts/overview`).then(r => r.json()),
  createTransaction: (data) => fetch(`${API_BASE}/accounts/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  // DPR Reports
  getDpr: (projectId) => fetch(`${API_BASE}/reports/dpr${projectId ? `?projectId=${projectId}` : ''}`).then(r => r.json()),
  createDpr: (data) => fetch(`${API_BASE}/reports/dpr`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
};

