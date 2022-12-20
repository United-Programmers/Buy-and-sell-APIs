/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'please product name is required'],
            unique: true,
            trim: true,
        },
        slug: String,
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: val => Math.round(val * 10) / 10 //from 4.66666,  to 4.7
        },
        ratingsQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) should be below regular price'
            }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'Please summery is required']
        },
        description: {
            type: String,
            trim: true,
            required: [true, 'Please description is required']
        },
        productsImageCover: {
            type: String,
            required: [true, 'Please image cover is required']
        },
        productsImages: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },

        //* when the seller delete an item 
        deactivate: {
            type: Boolean,
            default: true,
            select: false
        },
        Users: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "User"
            }
        ]
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

productSchema.index({ price: 1, ratingsAverage: -1 })
productSchema.index({ slug: 1 })

productSchema.pre(/^find/, function (next) {
    this.find({ deactivate: { $ne: false } });  // do not select a product that is equal to false
    next();
});

productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

productSchema.pre('save', function (next) {
    this.slug = slugify(this.productName, { lower: true });
    next();
});


productSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});

productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'Users',
        select: '-__v -passwordChangedAt'
    });
    next();
});

const Products = mongoose.model('Products', productSchema);
module.exports = Products;
