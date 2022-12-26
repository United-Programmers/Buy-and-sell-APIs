const mongoose = require('mongoose');
const Product = require('./productModel'); //* I need the tour model in order to update the ratings by the new one created by the user

const reviewSchema = new mongoose.Schema(
    {
        reviewTitle: {
            type: String,
        },
        reviewDescription: {
            type: String,
        },
        reviewImages: [String],
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Products',
            required: [true, 'Review must belong to a product.']
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: [true, 'Review must belong to a user']
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

//* This line here it prevent duplications, this means the one user can not create multiple reviews on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName photo email phoneNumber addressDetails',
    })
    next();
});

// reviewSchema.pre(/^find/, function (next) {
//     this.populate({
//         path: 'product',
//         select: 'productName ratingsAverage ratingsQuantity price priceDiscount category type ageRange genderType summary description stock stockCity productWarranty size availability colors barCode itemWeight ProductDimensions manufacturer productsImageCover',
//     });
//     next();
// });

//* This calculate the average of each ratings
reviewSchema.statics.calcAverageRatings = async function (prodId) {
    /// Always remember the [this] keyword point to the model
    const stats = await this.aggregate([
        // if the product ID match with the one in the [product DB folder], then group and return the new object
        {
            $match: {
                product: prodId  //* this is the ID  of the product
            }
        },
        {
            //* this create a new object, with fields
            $group: {
                _id: '$tour',
                nRating: { $sum: 1 }, //* means sum all the rating of the product
                avgRating: { $avg: '$rating' } //* return the average rating of the product
            }
        }
    ]);

    //* Now that i have the ratings & the average, i need to update the old one on the product, so you do this 
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(prodId, {
            ratingsQuantity: stats[0].nRating, // update with the new one
            ratingsAverage: stats[0].avgRating // update with the new one
        });
    } else {
        await Product.findByIdAndUpdate(prodId, {
            ratingsQuantity: 0, // keep it to the default
            ratingsAverage: 4.5
        });
    }
};

//* save the review calculation
reviewSchema.post('save', function () {
    //* this func [calcAverageRatings] receives the product Id as a parameters
    this.constructor.calcAverageRatings(this.product);
});

//* This line here it serve in terms of updating the review and delete review
reviewSchema.pre(/^findOneAnd/, async function (next) {
    // r means average
    this.r = await this.findOne().clone();
    next();
});

//* when the top one is one updating in the review schema, now it is time to also update the ratings field that is on the tour
reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.product)
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;