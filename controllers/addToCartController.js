//*  Functions handler
/*

 ===> Add to cart (product)
 ===> Remove to cart (product)
 ===> Clear the entire cart (all products)

*/

const AddToCart = require('../models/addToCartModel');
const { deleteOne, updateOne, createOne, getAll } = require('../controllers/handleFactory');

exports.getAllCartProduct = getAll(AddToCart);
exports.createCartProduct = createOne(AddToCart);
exports.updateCartProduct = updateOne(AddToCart);
exports.deleteCartProduct = deleteOne(AddToCart);

