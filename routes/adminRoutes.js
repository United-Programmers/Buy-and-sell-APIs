const express = require('express');
const { adminAssignOrderToDriver } = require('../controllers/adminController');
const router = express.Router();

router.post('/order/assign', adminAssignOrderToDriver);


module.exports = router;