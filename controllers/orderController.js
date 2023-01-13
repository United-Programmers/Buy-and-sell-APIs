const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { decodeToken } = require("./authController");

/**
 * create new order
 */
exports.createOrder = catchAsync(async (req, res) => {
  const { cartId } = req.body;
  let userId = req.user;

  let cart = await CartModel.findById(cartId).populate({
    path: "items.product",
    select:
      "_id productName price category type summary summary productWarranty barCode itemWeight ProductDimensions",
  });

  // check if cart empty
  if (cart.items.length < 1) {
    throw new AppError("No item in cart, add item to proceed", 400);
  }

  let order = await new OrderModel({
    ...req.body,
    userId,
    products: cart.items,
    totalPrice: cart.totalPrice,
  }).save({ new: true });

  // clear user cart items
  cart.items.splice(0, cart.items.length);
  cart.totalPrice = 0;
  cart.totalQuantity = 0;
  await cart.save();

  return res.status(200).json({
    status: "success",
    data: order,
  });
});

/**
 * get user orders
 */
exports.getUserOrders = catchAsync(async (req, res) => {
  const { filter } = req.query;
  let userId = req.user._id;
  let orders;

  if (filter) {
    orders = await OrderModel.find({
      userId: userId.toString(),
      status: filter,
    });
  } else {
    orders = await OrderModel.find({
      userId: userId.toString(),
    });
  }

  return res.status(200).json({
    status: "success",
    data: orders,
  });
});

/**
 * update order status
 */
exports.updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId, status } = req.body;

  let order = await OrderModel.findById(orderId);

  if (!order) {
    throw new AppError("No order found with supplied id", 404);
  }

  order.status = status;
  let result = await order.save({ new: true });

  return res.status(200).json({
    status: "success",
    data: result,
  });
});
