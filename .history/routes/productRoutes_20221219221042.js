/* eslint-disable prettier/prettier */
const express = require('express');
const { getProductById, checkID, updateProduct, getAllProducts, createProduct } = require('../controllers/productController');
const { uploadTourImages, resizeTourImages } = require('../controllers/imageController');
// const reviewRouter = require('../routes/reviewRoutes');
// const bookingRouter = require('../routes/bookingRoutes');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
router.param('id', checkID);

//* Creating a review on a tour
//? These 2 routes will merge they are params, one into reviewRouter.js & the other into bookingRouter.js
// router.use('/:tourId/reviews', reviewRouter)  //* merge routes
// router.use('/:tourId/bookings', bookingRouter)//* merge routes

// router.route('/top-5-cheap').get(controllers.aliasTopTours, controllers.getAllTours);
// router.route('/tour-stats').get(controllers.getTourStats);
// router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), controllers.getMonthlyPlan);

//* get tour by Id
router.route('/:id/:x?/:y?').get(getProductById);
router.patch('/:id').get(protect, updateProduct);


router
    .route('/')
    .get(getAllProducts)
    .post(protect, createProduct);

router
    .route('/:id')
    .patch(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
