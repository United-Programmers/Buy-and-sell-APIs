const express = require('express');
const { getAllCartProduct, createCartProduct, updateCartProduct, deleteCartProduct, addProductToCart, removeItem, getUserCart } = require("../controllers/cartController");
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllCartProduct)
    .post(protect, addProductToCart);

router.get('/user', protect, getUserCart);

router
    .route('/:id')
    .patch(protect, updateCartProduct)
    .delete(protect, removeItem)

module.exports = router;
