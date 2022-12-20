/* eslint-disable prettier/prettier */
const express = require('express');
const controllers = require('../controllers/tourController');
const { uploadTourImages, resizeTourImages } = require('../controllers/imageController');
// const reviewRouter = require('../routes/reviewRoutes');
// const bookingRouter = require('../routes/bookingRoutes');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.param('id', controllers.checkID);

//* Creating a review on a tour
//? These 2 routes will merge they are params, one into reviewRouter.js & the other into bookingRouter.js
// router.use('/:tourId/reviews', reviewRouter)  //* merge routes
// router.use('/:tourId/bookings', bookingRouter)//* merge routes

// router.route('/top-5-cheap').get(controllers.aliasTopTours, controllers.getAllTours);
// router.route('/tour-stats').get(controllers.getTourStats);
// router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), controllers.getMonthlyPlan);

//* get tour by Id
router.route('/:id/:x?/:y?').get(controllers.getParams);
router.patch('/:id').get(protect, restrictTo('admin', 'lead-guide', 'guide'), controllers.updateTour);


router
    .route('/')
    .get(controllers.getAllTours)
    .post(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, controllers.createTour);

router
    .route('/:id')
    .patch(protect, restrictTo('admin', 'lead-guide'), uploadTourImages, resizeTourImages, controllers.updateTour)
    .delete(protect, restrictTo('admin', 'lead-guide', 'guide'), controllers.deleteTour);

module.exports = router;
