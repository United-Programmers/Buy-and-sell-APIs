const { protect } = require('../controllers/authController');
const { getAllAssignedOrders, updateOrderStatus } = require('../controllers/driverController');

const router = require('express').Router()

router.get('/orders',protect, getAllAssignedOrders)
router.patch('/order/status', updateOrderStatus)

module.exports = router;