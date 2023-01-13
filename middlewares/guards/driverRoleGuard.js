/**
 * This middleware is responsible for the authorization of user with role of driver 
 */

const AppError = require("../../utils/appError");
const catchAsync = require("../../utils/catchAsync");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");


exports.driverRoleGuard = catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
  
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if(decodedToken.role !== "driver"){
        return next(
            new AppError("You are not authorized to perform this action ", 401)
        )
    }

    return next();
})