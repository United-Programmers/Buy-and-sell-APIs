/* eslint-disable prettier/prettier */
const Products = require('../models/productModel');

//* Note this file here you use it in a controller only if you want to apply features on the API, features like [sort, pagination, limit, ect...]
// const APIFeatures = require('../utils/apiFeatures');

//* Note:  In all your controllers you will always need this 2 files, one to throw a catch error, and the other one to throw a request error(if the user made a wrong request)
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const { deleteOne, updateOne, createOne, getOne, getAll } = require('../controllers/handleFactory');

exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

//* This is a middleware that check if the params user [ID] exist in the list of all my tour and then execute, if it does not exist then return this result
exports.checkID = (req, res, next, val) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID",
        });
    }
    next();
};

//* This middleware check if the request that the user made does not contain name and price, than it return an Error(this middleware get executed)
exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: "fail",
            message: "The Price or the Name is missing",
        });
    }
    next();
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllTours = getAll(Tour)
//* I'm passing this to populate the reviews
exports.getParams = getOne(Tour, { path: 'reviews' })
exports.updateTour = updateOne(Tour)
exports.createTour = createOne(Tour)
exports.deleteTour = deleteOne(Tour)



//* AGGREGATION [pipeline] ==> you can find this inside MongoDB Documentations
exports.getTourStats = catchAsync(async (req, res, next) => {
    const tour = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            //* Why? Pipeline, i use pipeline to get the number of tour that have similar [ratings], [min price], [max price], ect... 
            //* if 3 tour has same price, or same ratings, so it will return that to me.
            $group: {
                // _id: '$ratingsAverage',
                _id: '$difficulty', // this will return to me the number of tour that has [difficult] [medium], & [easy]
                numTours: { $sum: 1 },
                numRatings: { $sum: '$ratingsQuantity' }, //* This will calculate the number of ratings of all the tour
                avgRating: { $avg: '$ratingsAverage' }, //* This will calculate the avg rating of all the tour
                avgPrice: { $avg: '$price' }, //* the avg price of all the tour
                minPrice: { $min: '$price' }, //* the min price of all the tour
                maxPrice: { $max: '$price' } //* the max price of all the tour
            }
        },
        {
            $sort: { avgPrice: 1 } //* am sorting the field call <avgPrice> 
        }
    ]);
    res.status(200).json({
        status: "success",
        requestedAt: req.requestTime,
        data: {
            tour
        }
    });
});

//*Note; to see more of this go to mongoDB documentation go under Reference => Server => Reference => Operators => query
//* AGGREGATION [unwind] 
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // 2022
    const tour = await Tour.aggregate([
        {
            //* [unwind] help you filter the tours that are running on a specific date 
            $unwind: '$startDates'
        },
        {
            //* here i'm matching
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            //* here i'm returning the result to the user
            $group: {
                _id: { $month: '$startDates' }, //*  the month of when is the going to happen 
                numTourStarts: { $sum: 1 }, //* the number of tours that are happening in that month
                tours: { $push: '$name' } //* return an array of all tour names that are happening in the specified month
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        { //* [Project] removes this =>  _id: { $month: '$startDates' } from my tour response
            $project: {
                _id: 0
            }
        },
        { //* [Sort] from the bigger month to the smallest one
            $sort: { numTourStarts: -1 }
        },
        {//* [limit] only 12 month
            $limit: 12
        }
    ]);

    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: tour.length,
        data: {
            tour
        }
    });
});

