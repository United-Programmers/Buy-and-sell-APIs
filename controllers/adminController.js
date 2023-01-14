const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { assignOrderToDriver } = require("./orderController");

/**
 * assign order to driver
 */
exports.adminAssignOrderToDriver = catchAsync(async (req, res, next) => {
    let {driverEmail, orderId} = req.body;

    if(Object.keys(req.body).length < 1) throw new AppError("request body cannot be empty", 400);

    let {driver , order } = await assignOrderToDriver(driverEmail, orderId);

    return res.status(200).json({
        status: "success",
        data: "order assigned to driver successfully"
    })
})