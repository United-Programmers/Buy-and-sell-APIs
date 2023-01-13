const OrderModel = require("../models/orderModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

/**
 * get all assigned orders
 */
exports.getAllAssignedOrders = catchAsync(async (req, res, next) => {
  let driverId = req.user._id;

  console.log(driverId);

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
  let { orderId, answer, reason, orderUniqueId } = req.body;
  let userId = req.user.id;

  console.log(userId)

  let order = await OrderModel.findById(orderId);
  if (!order) {
    throw new AppError("no order found with provided id", 404);
  }

  if(order.assignedTo !== userId){
    throw new AppError("you are not authorized to perform this action", 401);
  }

  order.status = status;
  let result = await order.save();

  return res.status(200).json({
    status: "success",
    data: result,
  });
});
