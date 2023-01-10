const express = require('express');
const { getAllCartProduct, createCartProduct, updateCartProduct, deleteCartProduct, addProductToCart } = require("../controllers/cartController");
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllCartProduct)
    .post(addProductToCart);

router
    .route('/:id')
    .patch(protect, updateCartProduct)
    .delete(protect, deleteCartProduct)

module.exports = router;
