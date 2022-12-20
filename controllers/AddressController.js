
const User = require("../models/userModel");
const AddressModel = require("../models/AddressDetailsModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


exports.updateAddressDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("addressDetails");
    if (!user) return next(new AppError("No user found with id", 404));

    const addressExist = await AddressModel.findOne({ userId: user._id });
    if (!addressExist) {
        const newAddressDetails = await new AddressModel({ ...req.body, userId: user._id }).save();
        user.addressDetails = newAddressDetails;
        await user.save();

        res.status(200).json({
            message: "success",
            data: user
        });
    } else {
        user.addressDetails = await AddressModel.findOneAndUpdate(user.addressDetails?._id, req.body, { new: true });
        const userData = await user.save({ new: true });

        res.status(200).json({
            message: "success",
            data: userData
        });
    }
});