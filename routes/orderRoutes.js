const express = require("express");
const { protect } = require("../controllers/authController");
const {
  createOrder,
  getUserOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const router = express.Router({ mergeParams: true });

router.route("/").post(protect, createOrder).get(protect, getUserOrders);

router.patch("/", updateOrderStatus);

module.exports = router;
