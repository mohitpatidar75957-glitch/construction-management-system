# SitePilot User Roles & Permission Matrix

SitePilot implements Role-Based Access Control (RBAC) to ensure security, segregation of financial duties, and appropriate visibility across construction operations.

---

## 1. Role Profiles

### 👑 1. Owner / Executive
- **Scope**: Full multi-site visibility across all projects in the portfolio.
- **Key Responsibilities**:
  - High-level financial governance (Profit & Loss, Total Contract Value, Budget Variance).
  - Monitoring site milestones, progress curves, and project delays.
  - Reviewing critical material shortage alerts and contractor escalations.
  - Final approvals for major expenditures exceeding budget thresholds.

### 🏗️ 2. Project Manager (PM)
- **Scope**: Assigned projects / construction sites.
- **Key Responsibilities**:
  - Daily site oversight, schedule tracking, and milestone delivery.
  - DPR (Daily Progress Report) submission and review.
  - Material requisition creation and contractor coordination.
  - Equipment allocation and downtime monitoring.

### 👷 3. Site Engineer
- **Scope**: Specific site package or work zone.
- **Key Responsibilities**:
  - Daily labour attendance and headcounts.
  - Material receipt verification against Purchase Orders.
  - Snag list and quality control checks.
  - Submitting daily site photos and activity logs.

### 💰 4. Accountant / Billing Manager
- **Scope**: Financial transactions, invoicing, and subcontractor vouchers.
- **Key Responsibilities**:
  - Creating client RA (Running Account) bills and collecting receivables.
  - Verifying vendor invoices and material delivery challans.
  - Processing weekly labour wages and contractor advances.
  - Expense bookkeeping and tax compliance reports.

---

## 2. Permission Matrix

| Feature / Module | Owner | Project Manager | Site Engineer | Accountant |
| :--- | :---: | :---: | :---: | :---: |
| **Portfolio Overview Dashboard** | Full Access | Assigned Sites | Read-Only | Read-Only |
| **Create / Archive Projects** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Approve Financial Vouchers** | ✅ Yes | ⚠️ Up to ₹50k | ❌ No | ✅ Review |
| **Manage Invoices & RA Bills** | Full Access | Read-Only | ❌ No | Full Access |
| **Material Requisitions** | Approve | Create & Approve | Create | Read-Only |
| **Labour Attendance** | Read-Only | Manage | Manage | Read-Only |
| **Wage Disbursement** | Approve | Review | ❌ No | Execute |
| **Export Financial Audits** | ✅ Yes | ❌ No | ❌ No | ✅ Yes |
| **System Settings & User Roles**| ✅ Yes | ❌ No | ❌ No | ❌ No |

