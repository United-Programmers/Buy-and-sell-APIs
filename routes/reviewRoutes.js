const express = require('express');
const { uploadProductImages, resizeProductImages, uploadReviewImages, resizeReviewImages } = require('../controllers/imageController');
const { getAllReviews, getReview, updateReview, deleteReview, createReview, setProductIdAndUserId } = require("../controllers/reviewController");
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllReviews)
    .post(protect, uploadReviewImages, resizeReviewImages, setProductIdAndUserId, createReview);

router
    .route('/:id')
    .get(getReview)
    .patch(protect, uploadReviewImages, resizeReviewImages, updateReview)
    .delete(protect, deleteReview)

module.exports = router;
