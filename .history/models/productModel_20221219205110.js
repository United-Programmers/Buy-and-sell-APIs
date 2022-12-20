/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: [true, 'please product name is required'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal then 40 characters'],
            minlength: [10, 'A tour name must have more or equal then 10 characters']
        },
        slug: String, //* This field get it data from the middleware down bellow
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium, difficult'
            }
        },
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
            // validate: {
            //     validator: function (val) {
            //         return val < this.price;
            //     },
            //     message: 'Discount price ({VALUE}) should be below regular price'
            // }
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a cover image']
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false //* this means do not return this field to the user 
        },
        //* this will record an array of all the date that a tour will captured, this will come from the Front-End
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        },

        upcomingStatus: {
            type: Boolean,
            default: true
        },

        //* View lecturer 150       
        // startLocation: {
        //     type: {
        //         type: String,
        //         default: 'Point',
        //         enum: ['Point']
        //     },
        //     coordinates: [String], 
        //     address: String,
        //     description: String,
        // },

        //* This is an Embedded object
        //* This object will received the id of locations that belong to this tour
        // locations: [{
        //     type: {
        //         type: String,
        //         default: 'Point',
        //         enum: ['Point']
        //     },
        //     coordinates: [Number], 
        //     address: String,
        //     description: String,
        //     day: Number
        // }],

        //* Lecturer 152 Referencing
        guides: [
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

//* this will sort the price field in descending order & ratingsAverage field in ascending
// Note: you use index to make this 2 field to be fast when you are doing query, don't use it on every field, use it only to the field that are query the most.
tourSchema.index({ price: 1, ratingsAverage: -1 })
tourSchema.index({ slug: 1 })
tourSchema.index({ startLocation: '2dsphere' })

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

//? Note: instead of me referencing the review table inside the tourModel schema, that will be too long, of data, but we have something called [virtual Populate] using virtual i can reference a review table.
//* Now when you want to see specific tour with it reviews you will see all the reviews appeared 
//* 157
tourSchema.virtual('reviews', { // [reviews] this is now the array field name that will contain all the reviews
    ref: 'Review', // this is the name of the Table
    foreignField: 'tour', // this is the field name that is inside reviewModel.js
    localField: '_id'
})

tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

tourSchema.pre(/^find/, function (next) {
    this.find({ secretTour: { $ne: true } });
    this.start = Date.now(); //* i'm setting a new field to my schema, call [start = Date.now()]
    next();
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds!`);
    next();
});


tourSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
