const express = require('express');
const { getAllCartProduct, createCartProduct, updateCartProduct, deleteCartProduct } = require("../controllers/addToCartController");
const { protect, restrictTo } = require('./../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllCartProduct)
    .post(protect, createCartProduct);

router
    .route('/:id')
    .patch(protect, updateCartProduct)
    .delete(protect, deleteCartProduct)

module.exports = router;
