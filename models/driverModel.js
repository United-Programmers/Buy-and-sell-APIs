const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { string, boolean } = require("joi");

const driverSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 3,
    max: 255,
    required: [true, "Please provide your first name"],
    trim: true,
  },
  lastName: {
    type: String,
    min: 3,
    max: 255,
    required: [true, "Please provide your last name"],
    trim: true,
  },
  phoneNumber: {
    type: Number,
    trim: true,
  },
  agreed: {
    type: Boolean,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "is invalid"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["driver"],
    default: "driver",
    trim: true,
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
    trim: true,
  },
  passwordConfirm: {
    type: String,
    required: [false, "Please confirm your password"],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  //Drivers field
  employmentHistory: {
    type: String,
  },
  drivingRecord: {
    type: String,
  },
  physicalAbilities: {
    type: String,
  },
  availability: {
    type: boolean,
  },
  paymentInfo: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: true,
  },
  status: {
    type: Boolean,
    default: true,
    select: true,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  addressDetails: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "AddressDetails",
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

driverSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

driverSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

driverSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

driverSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

driverSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const DriverModel = mongoose.model("Driver", driverSchema);

module.exports = DriverModel;
