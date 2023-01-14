const OrderModel = require("../models/orderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * get all assigned orders
 */
exports.getAllAssignedOrders = catchAsync(async (req, res, next) => {
  let driverId = req.user._id;

  let assignedOrders = await OrderModel.find({
    assignedTo: driverId,
  });

  return res.status(200).json({
    status: "success",
    data: assignedOrders,
  });
});

/**
 * update order status
 */
exports.updateOrderStatus = catchAsync(async (req, res) => {
  let { orderId, answer, reason, orderUniqueCode, deliveredTime } = req.body;
  let userId = req.user._id.toString();

  if (answer !== "yes" && answer !== "no") {
    throw new AppError("invalid answer supplied", 403);
  }

  let order = await OrderModel.findById(orderId);
  if (!order) {
    throw new AppError("no order found with provided id", 404);
  }

  if (order.status === "Delivered" || order.status === "Cancelled") {
    throw new AppError("this order cannot be modified", 403);
  }

  if (order.assignedTo.toString() !== userId) {
    throw new AppError("you are not authorized to perform this action", 401);
  }

  if (order.uniqueCode !== orderUniqueCode) {
    throw new AppError("uniquedCode supplied is not valid for this order", 403);
  }

  if (answer === "yes") {
    if (!deliveredTime) throw new AppError("delivery time is required", 400);

    order.deliveredTime = deliveredTime;
    order.deliveredDate = new Date();
    order.status = "Delivered";
  } else {
    if (!reason) throw new AppError("reason is required", 400);

    order.orderNote = reason;
    order.status = "Cancelled";
  }

  let result = await order.save();

  return res.status(200).json({
    status: "success",
    data: result,
  });
});
