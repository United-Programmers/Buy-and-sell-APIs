/* eslint-disable prettier/prettier */
const express = require('express');
const { getProductById, checkID, updateProduct, getAllProducts, createProduct, deleteProduct, enableProduct, disableProduct, deactivateProduct, getProductBySellerID } = require('../controllers/productController');
const { uploadProductImages, resizeProductImages } = require('../controllers/imageController');
const reviewRouter = require('../routes/reviewRoutes');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
// router.param('id', checkID);

// Create a review for a product
router.use('/:prodId/reviews', reviewRouter)  //* merge routes

// router.route('/top-5-cheap').get(controllers.aliasTopTours, controllers.getAllTours);
// router.route('/tour-stats').get(controllers.getTourStats);
// router.route('/monthly-plan/:year').get(protect, restrictTo('admin', 'lead-guide', 'guide'), controllers.getMonthlyPlan);

router.route('/user/:id').get(protect, getProductBySellerID) //* Get product by user ID

//* get tour by Id
router.route('/:id/:x?/:y?').get(getProductById)
router.patch('/:id').get(protect, updateProduct)

router.route('/').get(getAllProducts)

router
    .route('/:id')
    .patch(protect, restrictTo("admin", 'super-admin', 'seller'), uploadProductImages, resizeProductImages, updateProduct)
    .post(protect, restrictTo("admin", 'super-admin', 'seller'), uploadProductImages, resizeProductImages, createProduct)
    .delete(protect, restrictTo("admin", 'super-admin'), deleteProduct);

router.route('/disable/:id').post(protect, restrictTo("admin", 'super-admin', 'seller'), disableProduct) //* Disable products when it's out of stock
router.route('/enable/:id').post(protect, restrictTo("admin", 'super-admin', 'seller'), enableProduct) //* Enable products when it's in stock
router.route('/deactivate/:id').post(protect, restrictTo('seller'), deactivateProduct) //* Seller

module.exports = router;
