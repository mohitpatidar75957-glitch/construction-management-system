const db = require('../config/db');

exports.getAllEquipment = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = `
      SELECT e.*, p.project_name 
      FROM equipment e 
      LEFT JOIN projects p ON e.project_id = p.id
    `;
    const params = [];
    if (projectId) {
      query += ' WHERE e.project_id = ?';
      params.push(projectId);
    }
    query += ' ORDER BY e.id DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addEquipment = async (req, res) => {
  try {
    const { project_id, equipment_name, model_no, ownership, daily_rental_cost, fuel_litres_per_day, status, operator_name, last_service_date } = req.body;
    const [result] = await db.query(
      `INSERT INTO equipment (project_id, equipment_name, model_no, ownership, daily_rental_cost, fuel_litres_per_day, status, operator_name, last_service_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, equipment_name, model_no, ownership || 'OWNED', daily_rental_cost || 0, fuel_litres_per_day || 0, status || 'OPERATIONAL', operator_name, last_service_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Equipment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEquipmentStatus = async (req, res) => {
  try {
    const { status, operator_name, fuel_litres_per_day, last_service_date } = req.body;
    await db.query(
      `UPDATE equipment SET status = COALESCE(?, status), operator_name = COALESCE(?, operator_name), fuel_litres_per_day = COALESCE(?, fuel_litres_per_day), last_service_date = COALESCE(?, last_service_date) WHERE id = ?`,
      [status, operator_name, fuel_litres_per_day, last_service_date, req.params.id]
    );
    res.json({ message: 'Equipment status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    await db.query('DELETE FROM equipment WHERE id = ?', [req.params.id]);
    res.json({ message: 'Equipment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

