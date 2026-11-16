const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const projectRoutes = require('./routes/projectRoutes');
const materialRoutes = require('./routes/materialRoutes');
const labourRoutes = require('./routes/labourRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const reportRoutes = require('./routes/reportRoutes');
const accountsRoutes = require('./routes/accountsRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'HEALTHY',
    system: 'SitePilot Construction Management System API',
    database: 'MySQL (construction_db)',
    timestamp: new Date().toISOString()
  });
});

// Domain Routes
app.use('/api/projects', projectRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/labour', labourRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/accounts', accountsRoutes);

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;

