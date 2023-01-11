const express = require('express');
const { getAllCartProduct, createCartProduct, updateCartProduct, deleteCartProduct, addProductToCart, removeItem, getUserCart, increaseByOne, decreaseByOne } = require("../controllers/cartController");
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getAllCartProduct)
    .post(protect, addProductToCart);

router.get('/user', protect, getUserCart);
router.patch('/:productId/quantity/increase', increaseByOne)
router.patch('/:productId/quantity/decrease', decreaseByOne)

router
    .route('/:id')
    .delete(protect, removeItem)

module.exports = router;
