const db = require('../config/db');

exports.getLabourAttendance = async (req, res) => {
  try {
    const { projectId, date } = req.query;
    let query = `
      SELECT l.*, p.project_name 
      FROM labour_attendance l 
      LEFT JOIN projects p ON l.project_id = p.id
    `;
    const params = [];
    const conditions = [];

    if (projectId) {
      conditions.push('l.project_id = ?');
      params.push(projectId);
    }
    if (date) {
      conditions.push('l.work_date = ?');
      params.push(date);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY l.work_date DESC, l.id DESC';

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.recordLabour = async (req, res) => {
  try {
    const { project_id, worker_name, category, contractor_agency, daily_wage, attendance_status, work_date, payment_status } = req.body;
    const [result] = await db.query(
      `INSERT INTO labour_attendance (project_id, worker_name, category, contractor_agency, daily_wage, attendance_status, work_date, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, worker_name, category || 'GENERAL_LABOUR', contractor_agency, daily_wage || 500, attendance_status || 'PRESENT', work_date || new Date(), payment_status || 'PENDING']
    );
    res.status(201).json({ id: result.insertId, message: 'Labour record saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_status, attendance_status } = req.body;
    await db.query(
      `UPDATE labour_attendance SET payment_status = COALESCE(?, payment_status), attendance_status = COALESCE(?, attendance_status) WHERE id = ?`,
      [payment_status, attendance_status, req.params.id]
    );
    res.json({ message: 'Labour record updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLabour = async (req, res) => {
  try {
    await db.query('DELETE FROM labour_attendance WHERE id = ?', [req.params.id]);
    res.json({ message: 'Labour entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

