const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [[projectStats]] = await db.query(`
      SELECT 
        COUNT(*) AS total_projects,
        COALESCE(SUM(budget), 0) AS total_budget,
        COALESCE(SUM(spent), 0) AS total_spent,
        COALESCE(AVG(progress_percent), 0) AS avg_progress
      FROM projects
    `);

    const [projects] = await db.query(`
      SELECT id, project_name, progress_percent, status 
      FROM projects 
      ORDER BY progress_percent DESC
    `);

    const images = [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=150&auto=format&fit=crop&q=80'
    ];

    const siteStatus = projects.map((p, idx) => {
      let statusType = 'success';
      let statusLabel = 'On Track';
      if (p.progress_percent < 40) {
        statusType = 'danger';
        statusLabel = 'Delayed';
      } else if (p.progress_percent < 60) {
        statusType = 'warning';
        statusLabel = 'Attention';
      }

      return {
        id: p.id,
        name: p.project_name,
        progress: Number(p.progress_percent),
        status: statusLabel,
        statusType,
        img: images[idx % images.length]
      };
    });

    const [materials] = await db.query(`
      SELECT id, material_name, current_stock, min_threshold, unit 
      FROM materials 
      ORDER BY (current_stock / min_threshold) ASC 
      LIMIT 4
    `);

    const matImages = [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80'
    ];

    const materialsAlerts = materials.map((m, idx) => {
      const current = Number(m.current_stock);
      const min = Number(m.min_threshold);
      const isUrgent = current <= min;
      const isLow = current <= (min * 1.5);

      return {
        id: m.id,
        name: m.material_name,
        note: `Stock: ${current.toLocaleString('en-IN')} ${m.unit}`,
        tag: isUrgent ? 'Urgent' : isLow ? 'Low' : 'Normal',
        type: isUrgent ? 'urgent' : isLow ? 'low' : 'normal',
        img: matImages[idx % matImages.length]
      };
    });

    const [dprRows] = await db.query(`
      SELECT d.id, d.report_date, d.milestone_activity, d.progress_percent_achieved, p.project_name
      FROM daily_progress_reports d
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.report_date DESC, d.id DESC LIMIT 2
    `);

    const [expenseRows] = await db.query(`
      SELECT id, expense_date, category, amount, payment_mode, vendor_payee
      FROM expenses
      ORDER BY expense_date DESC, id DESC LIMIT 2
    `);

    const activities = [];
    dprRows.forEach(dpr => {
      activities.push({
        id: `dpr-${dpr.id}`,
        time: new Date(dpr.report_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        title: `${dpr.project_name}: ${dpr.milestone_activity}`,
        tag: `${dpr.progress_percent_achieved}% Done`,
        type: 'update'
      });
    });

    expenseRows.forEach(exp => {
      activities.push({
        id: `exp-${exp.id}`,
        time: new Date(exp.expense_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        title: `Payment: ₹${(Number(exp.amount) / 100000).toFixed(1)} L to ${exp.vendor_payee}`,
        tag: exp.payment_mode.replace('_', ' '),
        type: 'success'
      });
    });

    const totalBudget = Number(projectStats.total_budget || 0);
    const avgProgress = Math.round(Number(projectStats.avg_progress || 0));

    res.json({
      kpi: {
        activeSites: String(projects.length).padStart(2, '0'),
        activeSitesDelta: '+1',
        totalContractValue: totalBudget >= 10000000 ? `₹${(totalBudget / 10000000).toFixed(1)} Cr` : `₹${(totalBudget / 100000).toFixed(1)} L`,
        contractValueDelta: '+12%',
        workCompleted: avgProgress,
        pendingPayments: '₹38.5 L',
        pendingPaymentsDelta: '+8%'
      },
      siteStatus,
      materialsAlerts,
      recentActivity: activities,
      progressTrend: [
        { week: 'Week 1', progress: Math.max(15, Math.round(avgProgress * 0.4)) },
        { week: 'Week 2', progress: Math.max(25, Math.round(avgProgress * 0.65)) },
        { week: 'Week 3', progress: Math.max(35, Math.round(avgProgress * 0.85)) },
        { week: 'Week 4', progress: avgProgress }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDprReports = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = `
      SELECT d.*, p.project_name 
      FROM daily_progress_reports d 
      LEFT JOIN projects p ON d.project_id = p.id
    `;
    const params = [];
    if (projectId) {
      query += ' WHERE d.project_id = ?';
      params.push(projectId);
    }
    query += ' ORDER BY d.report_date DESC, d.id DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createDprReport = async (req, res) => {
  try {
    const { project_id, report_date, weather, milestone_activity, work_description, progress_percent_achieved, issues_or_delays, supervisor_name } = req.body;
    const [result] = await db.query(
      `INSERT INTO daily_progress_reports (project_id, report_date, weather, milestone_activity, work_description, progress_percent_achieved, issues_or_delays, supervisor_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, report_date || new Date(), weather || 'Clear / Sunny', milestone_activity, work_description, progress_percent_achieved || 0, issues_or_delays, supervisor_name]
    );

    if (progress_percent_achieved) {
      await db.query(
        `UPDATE projects SET progress_percent = ? WHERE id = ?`,
        [progress_percent_achieved, project_id]
      );
    }

    res.status(201).json({ id: result.insertId, message: 'DPR recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
