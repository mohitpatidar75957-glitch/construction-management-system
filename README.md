# SitePilot — Smart Construction Management System

SitePilot is an enterprise-grade full-stack construction operations platform designed for construction firm owners, project directors, site managers, and commercial accountants.

It delivers real-time site telemetry, multi-project budget tracking, material inventory monitoring, and workforce management wrapped in a frosted **liquid acrylic glassmorphism UI**.

---

## 🚀 Key Features

- **Owner Portfolio Overview**: Real-time cross-site analytics (Active Sites, Contract Values, Completion %, Budget Utilization).
- **All Projects / Sites Directory**: Detailed progress tracking, milestones, and site locations (Indore, Bhopal, Ujjain, Dewas).
- **Accounts & Financial Ledger**: Site-wise budget tracking, contractor payouts, material vouchers, and RA billing.
- **Labour & Contractor Management**: Daily attendance, active workforce distribution, and wage disbursements.
- **Material & Inventory Tracking**: Stock register, delivery challans, and real-time low-stock re-order alerts.
- **Reports & Analytics**: High-level financial health, monthly progress curves, and PDF export capabilities.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 (Vite)
  - Lucide React Icons
  - Pure Liquid Acrylic Glassmorphism (CSS3 backdrop-filter & frosted glass styling)
  - Plus Jakarta Sans typography
- **Backend**:
  - Node.js & Express
  - RESTful API Architecture with Modular Controllers & Services
  - Role-Based Access Control (RBAC)
- **Database**:
  - MySQL with relational schema (`construction_db`)
  - Full connection pooling with `mysql2/promise`

---

## 📂 Architecture Overview

```text
SitePilot/
├── frontend/          # React client application (Vite)
├── backend/           # Node.js Express REST API server
├── database/          # MySQL schema DDL & migration scripts
└── docs/              # Architectural, API, and RBAC documentation
```

For a comprehensive explanation of file paths and responsibilities, see [docs/project-structure.md](file:///docs/project-structure.md).

---

## ⚡ Quick Start

### 1. Database Setup
Ensure MySQL is running on `localhost:3306`, then import the schema:
```bash
mysql -u root -p construction_db < database/schema.sql
```

### 2. Backend Server
```bash
cd backend
npm install
node src/server.js
```
The API server starts on `http://localhost:5000`.

### 3. Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:3000`.

