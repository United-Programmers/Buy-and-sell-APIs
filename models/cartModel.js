/// Model Fields
/*

UserId, ProdId, Colors, and Size, Quantity
Feel free to add any other necessary filed that i left out

*/

const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "user id is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        color: String,
        size: String,
        totalProductQuantity: Number,
        totalProductPrice: Number,
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CartModel = mongoose.model("Cart", cartSchema);

cartSchema.pre(/^find/, function (next) {
  this.populate("userId").populate({
    path: "productId",
    select:
      "productName  slug  ratingsAverage   ratingsQuantity  price priceDiscount type category ageRange genderType summary productName colors availability manufacturer productsImageCover productsImages bestSeller",
  });
  next();
});

module.exports = CartModel;
