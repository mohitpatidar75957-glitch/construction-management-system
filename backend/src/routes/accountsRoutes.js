const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/accountsController');

router.get('/overview', accountsController.getAccountsOverview);
router.post('/transactions', accountsController.createTransaction);

module.exports = router;

