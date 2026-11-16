const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.get('/', equipmentController.getAllEquipment);
router.post('/', equipmentController.addEquipment);
router.put('/:id', equipmentController.updateEquipmentStatus);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;

