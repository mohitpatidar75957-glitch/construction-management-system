# SitePilot REST API Documentation

Base URL: `http://localhost:5000/api`

All responses follow standard HTTP status codes and return JSON payloads.

---

## 1. System Health & Diagnostics

### `GET /health`
Returns the status of the server and database connectivity.

**Response (200 OK):**
```json
{
  "status": "HEALTHY",
  "system": "SitePilot Construction Management System API",
  "database": "MySQL (construction_db)",
  "timestamp": "2026-11-12T13:16:50.000Z"
}
```

---

## 2. Projects & Sites (`/api/projects`)

### `GET /projects`
Fetches all construction sites with status, completion percentage, location, and contract budget.

**Query Parameters:**
- `status` (optional): Filter by status (`Active`, `Delayed`, `On Track`, `Completed`).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Skyline Commercial Hub (Project A)",
    "code": "PRJ-A",
    "location": "Indore, Super Corridor",
    "budget": 185000000.00,
    "progress": 85,
    "status": "On Track",
    "start_date": "2025-01-15",
    "expected_end_date": "2026-12-30"
  }
]
```

### `GET /projects/:id`
Fetches a single project with detailed site metrics.

### `POST /projects`
Creates a new construction project.

**Request Body:**
```json
{
  "name": "Emerald Heights Luxury Enclave",
  "code": "PRJ-E",
  "location": "Bypass Road, Indore",
  "budget": 120000000,
  "start_date": "2026-02-01",
  "expected_end_date": "2027-08-31"
}
```

---

## 3. Financial Accounts & Billing (`/api/accounts`)

### `GET /accounts/overview`
Retrieves total contract value, total cash spent, available budget balance, and pending payments.

**Response (200 OK):**
```json
{
  "totalBudget": 530000000,
  "totalExpenses": 204700000,
  "availableBalance": 325300000,
  "pendingReceivables": 3850000,
  "currency": "INR"
}
```

### `GET /accounts/transactions`
Returns the recent transactions ledger (client inflows, contractor payments, material invoices).

**Query Parameters:**
- `project_id` (optional): Filter by project ID.
- `limit` (default: 50): Number of records.

### `POST /accounts/transactions`
Records a new financial transaction or expense voucher.

---

## 4. Materials & Inventory (`/api/materials`)

### `GET /materials`
Lists all tracked materials, warehouse stock levels, unit measures, and low-stock threshold triggers.

### `GET /materials/alerts`
Fetches items requiring urgent re-orders (e.g. PPC Cement bags, Class-1 Red Clay Bricks).

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "material_name": "Ambuja PPC Cement",
    "current_stock": 280,
    "min_required": 500,
    "unit": "Bags",
    "status": "Urgent"
  }
]
```

---

## 5. Workforce & Labour Management (`/api/labour`)

### `GET /labour/overview`
Returns total active workers across all sites, contractor details, and daily wage totals.

### `GET /labour/attendance`
Retrieves daily muster roll and contractor attendance logs.

---

## 6. Equipment & Plant Machinery (`/api/equipment`)

### `GET /equipment`
Lists heavy machinery (tower cranes, excavators, transit mixers) and their current operating sites.

---

## 7. Reports & Analytics (`/api/reports`)

### `GET /reports/dashboard`
Aggregated telemetry data for the main Owner Overview screen, including monthly progress curves, budget utilization, and critical alerts.

