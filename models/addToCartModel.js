/// Model Fields
/*

UserId, ProdId, Colors, and Size, Quantity
Feel free to add any other necessary filed that i left out

*/

const mongoose = require("mongoose");


const AddToCartSchema = new mongoose.Schema(
    {
        color: {
            type: String,
        },
        size: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        userId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'The user id is required']
        },
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Products',
            required: [true, 'The product id is required']
        }
    },
);

const AddToCart = mongoose.model("AddToCart", AddToCartSchema);

AddToCartSchema.pre(/^find/, function (next) {
    this.populate('userId').populate({
        path: 'productId',
        select:
            "productName  slug  ratingsAverage   ratingsQuantity  price priceDiscount type category ageRange genderType summary productName colors availability manufacturer productsImageCover productsImages bestSeller"
    })
    next();
});



module.exports = AddToCart;
