const express = require('express');
const router = express.Router();
const labourController = require('../controllers/labourController');

router.get('/', labourController.getLabourAttendance);
router.post('/', labourController.recordLabour);
router.put('/:id', labourController.updatePaymentStatus);
router.delete('/:id', labourController.deleteLabour);

module.exports = router;

