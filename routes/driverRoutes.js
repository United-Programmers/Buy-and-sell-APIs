const { protect } = require('../controllers/authController');
const { getAllAssignedOrders } = require('../controllers/driverController');

const router = require('express').Router()

router.get('/orders',protect, getAllAssignedOrders)

module.exports = router;