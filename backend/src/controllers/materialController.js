const db = require('../config/db');

exports.getAllMaterials = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = `
      SELECT m.*, p.project_name 
      FROM materials m 
      LEFT JOIN projects p ON m.project_id = p.id
    `;
    const params = [];
    if (projectId) {
      query += ' WHERE m.project_id = ?';
      params.push(projectId);
    }
    query += ' ORDER BY m.id DESC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMaterial = async (req, res) => {
  try {
    const { project_id, material_name, category, unit, current_stock, min_threshold, unit_price, supplier_name } = req.body;
    const [result] = await db.query(
      `INSERT INTO materials (project_id, material_name, category, unit, current_stock, min_threshold, unit_price, supplier_name) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_id, material_name, category, unit, current_stock || 0, min_threshold || 10, unit_price || 0, supplier_name]
    );
    res.status(201).json({ id: result.insertId, message: 'Material stock recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMaterialStock = async (req, res) => {
  try {
    const { current_stock, unit_price, min_threshold } = req.body;
    await db.query(
      `UPDATE materials SET current_stock=?, unit_price=?, min_threshold=? WHERE id=?`,
      [current_stock, unit_price, min_threshold, req.params.id]
    );
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    await db.query('DELETE FROM materials WHERE id = ?', [req.params.id]);
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

