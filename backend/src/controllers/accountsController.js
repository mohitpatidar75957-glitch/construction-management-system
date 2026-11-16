const db = require('../config/db');

exports.getAccountsOverview = async (req, res) => {
  try {
    // 1. Projects financial aggregates
    const [[budgetStats]] = await db.query(`
      SELECT 
        COALESCE(SUM(budget), 0) AS total_contract_value,
        COALESCE(SUM(spent), 0) AS total_spent
      FROM projects
    `);

    // 2. Customer payments received vs Expenses by Category
    const [expenseCategoryStats] = await db.query(`
      SELECT 
        category,
        COALESCE(SUM(amount), 0) AS total_amount,
        COUNT(*) AS transaction_count
      FROM expenses
      GROUP BY category
    `);

    let totalCustomerReceived = 0;
    let totalMaterialExpense = 0;
    let totalLabourExpense = 0;
    let totalContractorExpense = 0;
    let totalEquipmentExpense = 0;
    let totalMiscExpense = 0;

    expenseCategoryStats.forEach(row => {
      const amt = Number(row.total_amount);
      if (row.category === 'CUSTOMER_PAYMENT') {
        totalCustomerReceived += amt;
      } else if (row.category === 'MATERIAL') {
        totalMaterialExpense += amt;
      } else if (row.category === 'LABOUR') {
        totalLabourExpense += amt;
      } else if (row.category === 'CONTRACTOR') {
        totalContractorExpense += amt;
      } else if (row.category === 'EQUIPMENT') {
        totalEquipmentExpense += amt;
      } else {
        totalMiscExpense += amt;
      }
    });

    const totalActualExpenses = totalMaterialExpense + totalLabourExpense + totalContractorExpense + totalEquipmentExpense + totalMiscExpense;
    const totalContractValue = Number(budgetStats.total_contract_value);
    const pendingCustomerPayments = Math.max(0, totalContractValue - totalCustomerReceived);
    const netCashflow = totalCustomerReceived - totalActualExpenses;

    // 3. Site-wise Financial Breakdown (Site-wise P&L)
    const [siteFinancials] = await db.query(`
      SELECT 
        p.id,
        p.project_name,
        p.project_code,
        p.site_location,
        p.budget,
        p.spent,
        p.progress_percent,
        COALESCE(rec.customer_received, 0) AS customer_received,
        COALESCE(exp.site_expenses, 0) AS site_expenses
      FROM projects p
      LEFT JOIN (
        SELECT project_id, SUM(amount) AS customer_received 
        FROM expenses WHERE category = 'CUSTOMER_PAYMENT' GROUP BY project_id
      ) rec ON p.id = rec.project_id
      LEFT JOIN (
        SELECT project_id, SUM(amount) AS site_expenses 
        FROM expenses WHERE category != 'CUSTOMER_PAYMENT' GROUP BY project_id
      ) exp ON p.id = exp.project_id
      ORDER BY p.id ASC
    `);

    const sitePL = siteFinancials.map(s => {
      const budget = Number(s.budget);
      const spent = Number(s.spent) || Number(s.site_expenses);
      const received = Number(s.customer_received);
      const estimatedProfit = budget - spent;
      const profitMarginPct = budget > 0 ? Math.round((estimatedProfit / budget) * 100) : 0;

      return {
        id: s.id,
        project_name: s.project_name,
        code: s.project_code,
        location: s.site_location,
        progress: s.progress_percent,
        budget,
        spent,
        customer_received: received,
        pending_customer: Math.max(0, budget - received),
        estimated_profit: estimatedProfit,
        profit_margin_pct: profitMarginPct,
        status: spent > budget ? 'BUDGET_EXCEEDED' : 'PROFITABLE'
      };
    });

    // 4. All Transactions Ledger (Recent Financial Entries)
    const [transactions] = await db.query(`
      SELECT 
        e.*,
        p.project_name
      FROM expenses e
      LEFT JOIN projects p ON e.project_id = p.id
      ORDER BY e.expense_date DESC, e.id DESC
      LIMIT 20
    `);

    res.json({
      summary: {
        totalContractValue,
        totalCustomerReceived,
        pendingCustomerPayments,
        totalActualExpenses,
        netCashflow,
        breakdown: {
          material: totalMaterialExpense,
          labour: totalLabourExpense,
          contractor: totalContractorExpense,
          equipment: totalEquipmentExpense,
          misc: totalMiscExpense
        }
      },
      sitePL,
      transactions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { project_id, category, amount, payment_mode, invoice_no, vendor_payee, expense_date, description } = req.body;
    const [result] = await db.query(`
      INSERT INTO expenses (project_id, category, amount, payment_mode, invoice_no, vendor_payee, expense_date, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [project_id, category, amount, payment_mode || 'BANK_TRANSFER', invoice_no, vendor_payee, expense_date || new Date(), description]);

    // If it's an expense, update projects.spent
    if (category !== 'CUSTOMER_PAYMENT') {
      await db.query(`
        UPDATE projects SET spent = spent + ? WHERE id = ?
      `, [amount, project_id]);
    }

    res.status(201).json({ id: result.insertId, message: 'Transaction recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

