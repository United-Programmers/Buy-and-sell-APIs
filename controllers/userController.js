const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  geSuspended,
  getActive,
  getUnverified,
  getStudents,
  getTutors,
} = require("./handleFactory");
const {
  Suspended,
  UnSuspended,
  Approved,
  Declined,
} = require("../utils/verifyEmail");
const AddressDetailsModel = require("./../models/AddressDetailsModel");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "phoneNumber",
    "email",
    "photo"
  );
  if (req.file) filteredBody.photo = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      data: updatedUser,
    },
  });
});

// update address details
exports.updateAddressDetails = async (req, res) => {
  const { id } = req.params;
  const { province, city, postalCode, surBurb, street, complex } = req.body;

  try {
    const user = await User.findById(id).populate("addressDetails");
    console.log(user);
    if (!user) {
      res.status(404).json("No user found with id");
    }

    const addressExist = await AddressDetailsModel.findOne({
      userId: user._id,
    });
    console.log(addressExist);

    if (!addressExist) {
      const newAddressDetails = await new AddressDetailsModel({
        ...req.body,
        userId: user._id,
      }).save();
      user.addressDetails = newAddressDetails;
      await user.save();
      console.log("not exist so save");

      res.status(201).json({ message: "Address updated successfully" , user});
    } else {
      console.log("exists ");

      res.status(201).json({ message: "Address updated successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(201).json({
    status: "success",
    data: null,
  });
});

exports.susPendUser = catchAsync(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, { status: false });
  if (!data) return next(new AppError("No user with this Id", 400));
  const Email = data.email;
  const Name = data.firstName;
  Suspended(Email, Name);
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.unSusPendUser = catchAsync(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, { status: true });
  if (!data) return next(new AppError("No user with this Id", 400));
  const Email = data.email;
  const Name = data.firstName;
  UnSuspended(Email, Name);
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.ApprovedTutor = catchAsync(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, { verified: true });
  if (!data) return next(new AppError("No user with this Id", 400));
  const Email = data.email;
  const Name = data.firstName;
  Approved(Email, Name);
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.DeclineTutor = catchAsync(async (req, res, next) => {
  const data = await User.findByIdAndUpdate(req.params.id, { verified: false });
  if (!data) return next(new AppError("No user with this Id", 400));
  const Email = data.email;
  const Name = data.firstName;
  Declined(Email, Name);
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
exports.getSusPendUser = geSuspended(User, false);
exports.getNonActive = getActive(User, false);
exports.getUnVerify = getUnverified(User, false);
exports.geTutorsRouteFunc = getTutors(User, "tutor");
exports.getStudentRouteFunc = getStudents(User, "student");
