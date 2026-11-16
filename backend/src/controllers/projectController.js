const db = require('../config/db');

exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { project_name, project_code, site_location, client_name, contractor_name, budget, start_date, completion_date, status, progress_percent } = req.body;
    const [result] = await db.query(
      `INSERT INTO projects (project_name, project_code, site_location, client_name, contractor_name, budget, start_date, completion_date, status, progress_percent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [project_name, project_code, site_location, client_name, contractor_name, budget || 0, start_date, completion_date, status || 'IN_PROGRESS', progress_percent || 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { project_name, site_location, client_name, contractor_name, budget, spent, start_date, completion_date, status, progress_percent } = req.body;
    await db.query(
      `UPDATE projects SET project_name=?, site_location=?, client_name=?, contractor_name=?, budget=?, spent=?, start_date=?, completion_date=?, status=?, progress_percent=? 
       WHERE id=?`,
      [project_name, site_location, client_name, contractor_name, budget, spent, start_date, completion_date, status, progress_percent, req.params.id]
    );
    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

