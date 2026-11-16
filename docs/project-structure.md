# SitePilot Architecture & Project Structure Guide

This document describes the complete modular architecture of **SitePilot**, explaining where each file originates, how data flows between the backend and frontend, and how to maintain and extend modules cleanly.

---

## 1. Directory Tree Overview

```text
SitePilot/
│
├── frontend/
│   ├── public/                    # Static assets, favicon, manifest
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # Reusable UI primitives (Button, Modal, DataTable, etc.)
│   │   │   ├── layout/            # Shell architecture (Sidebar, Header, MainLayout, PageHeader)
│   │   │   └── dashboard/         # Metric cards, progress charts, live status feeds
│   │   ├── pages/
│   │   │   ├── auth/              # Login & credentials
│   │   │   ├── dashboard/         # Main portfolio overview
│   │   │   ├── projects/          # Sites & project list
│   │   │   ├── billing/           # RA bills, invoices, ledger
│   │   │   ├── workforce/         # Labour & contractor attendance & wages
│   │   │   ├── materials/         # Material stock & alerts
│   │   │   └── reports/           # Financial analytics & PDF exports
│   │   ├── services/              # Domain-specific API clients (api.js, projectService.js, etc.)
│   │   ├── context/               # Global state providers (AuthContext, ProjectContext)
│   │   ├── routes/                # Unified application route switcher (AppRoutes.jsx)
│   │   ├── utils/                 # Currency formatters (INR) and date formatting helpers
│   │   ├── App.jsx                # Application root with context providers
│   │   ├── main.jsx               # Vite React DOM entry point
│   │   └── index.css              # Liquid acrylic glassmorphism styling & design system
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/                # Environment and MySQL pool connection
│   │   ├── middleware/            # Auth, RBAC, project scoping, uploads, and errors
│   │   ├── modules/               # Modular business logic units
│   │   ├── controllers/           # API request controllers (Projects, Accounts, Labour, etc.)
│   │   ├── routes/                # Express router endpoints
│   │   ├── utils/                 # PDF generator, invoice numbering, and response wrappers
│   │   ├── app.js                 # Configured Express application
│   │   └── server.js              # Production HTTP listener
│   ├── uploads/                   # Media & file attachments (dpr, invoices, receipts)
│   ├── .env.example               # Config template
│   └── package.json
│
├── database/
│   ├── schema.sql                 # Complete MySQL DDL schema
│   └── migrations/                # Versioned migration scripts
│
└── docs/
    ├── project-structure.md       # (This file) Architecture guide
    ├── api-documentation.md       # REST API reference
    └── user-roles.md              # Role-Based Access Control matrix
```

---

## 2. Frontend Layer Structure

### `src/components/common/`
Reusable atomic UI controls shared across all views:
- `Button.jsx`: Supports variants (`primary`, `secondary`, `glass`, `danger`) with acrylic blur and micro-animations.
- `Modal.jsx`: Centered glass backdrop modal for adding projects, creating vouchers, or viewing details.
- `DataTable.jsx`: Responsive striped glass table with status badges and action toolbars.
- `SearchBar.jsx`: Quick search box with debounced callbacks.
- `Pagination.jsx`: Numbered pagination controls.
- `ConfirmDialog.jsx`: Confirmation modal for destructive operations.

### `src/components/layout/`
- `Sidebar.jsx`: Dubai-style frosted acrylic sidebar with brand identity, active route indicator, and quick logout.
- `Header.jsx`: Top navigation with global search, live date indicator, notification bell, and user avatar.
- `MainLayout.jsx`: Master layout wrapper keeping sidebar and header in sync.
- `PageHeader.jsx`: Breadcrumb and title header for individual subpages.

### `src/components/dashboard/`
- `StatCard.jsx`: Glass metric cards with trend indicators (+12%, -4%).
- `ProjectCard.jsx`: Progress bar and location overview for construction sites.
- `ProgressChart.jsx`: Monthly execution and completion visualization.
- `RecentActivities.jsx`: Real-time site activity feed.

### `src/services/`
Domain-specific API wrappers decoupling views from HTTP transport:
- `api.js`: Unified HTTP client handling baseURL (`http://localhost:5000/api`), headers, and JSON parsing.
- `projectService.js`: `getProjects()`, `getProjectById()`, `createProject()`, `updateProject()`.
- `billingService.js`: `getAccountsOverview()`, `getTransactions()`, `createTransaction()`.
- `dprService.js`: Daily Progress Report endpoints.
- `authService.js`: Current user session and authentication tokens.

### `src/context/`
- `AuthContext.jsx`: Current user identity, role, and logout action.
- `ProjectContext.jsx`: Selected project site filter, active sites count, and project cache.

---

## 3. Backend Layer Structure

### `src/config/`
- `database.js`: MySQL connection pool using `mysql2/promise` with automatic reconnects and environment-based credentials.
- `environment.js`: Centralized access to environment variables with sane defaults.

### `src/middleware/`
- `authMiddleware.js`: Reads Bearer tokens and populates `req.user`.
- `roleMiddleware.js`: Restricts routes to authorized roles (e.g., `Owner`, `Project Manager`, `Accountant`).
- `projectAccessMiddleware.js`: Validates that a user has permission to read or modify a specific project.
- `uploadMiddleware.js`: Manages destination directories for uploaded documents and images.
- `errorMiddleware.js`: Catches unhandled errors and returns standardized JSON responses.

### `src/utils/`
- `responseHandler.js`: Helper functions (`successResponse`, `errorResponse`, `paginatedResponse`) ensuring every API endpoint returns a predictable envelope.
- `generateInvoiceNumber.js`: Standardized invoice (`INV-YYYYMM-XXXX`) and RA bill (`RA-PRJ-XXX`) numbering.
- `generatePDF.js`: Prepares report schemas for PDF generation.

---

## 4. Design System & Glassmorphism Styling

All visual aesthetics are governed by `frontend/src/index.css`:
- **Background**: Soft luxury architectural gradient overlay with warm ambient glow.
- **Glass Shell**: Frosted acrylic container (`background: rgba(255, 255, 255, 0.45)`, `backdrop-filter: blur(28px)`).
- **Cards**: Milky frosted glass (`rgba(255, 255, 255, 0.65)`) with crisp borders (`rgba(255, 255, 255, 0.8)`).
- **Accent**: Construction vibrant warm amber `#f97316` and gold accents.
- **Typography**: Plus Jakarta Sans for crisp corporate legibility.

