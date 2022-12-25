const mongoose = require("mongoose");

const AddressDetailSchema = new mongoose.Schema({
  province: {
    type: String,
  },
  city: {
    type: String,
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  surBurb: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    trim: true,
  },
  complex: {
    type: String,
    trim: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const AddressDetailsModel = mongoose.model(
  "AddressDetails",
  AddressDetailSchema
);
module.exports = AddressDetailsModel;
