const OrderModel = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");

/**
 * get all assigned orders
 */
exports.getAllAssignedOrders = catchAsync(async (req, res, next) => {
    let driverId = req.user._id;

    console.log(driverId);

    let assignedOrders = await OrderModel.find({
        assignedTo: driverId
    })

    return res.status(200).json({
        status: "success",
        data: assignedOrders
    })
})