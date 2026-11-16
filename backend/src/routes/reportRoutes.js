const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.get('/dashboard', reportController.getDashboardStats);
router.get('/dpr', reportController.getDprReports);
router.post('/dpr', reportController.createDprReport);

module.exports = router;

