//*  Functions handler
/*

 ===> Add to cart (product)
 ===> Remove to cart (product)
 ===> Clear the entire cart (all products)

*/

const CartModel = require("../models/cartModel");
const Products = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { decodeToken, checkIfEmailExists } = require("./authController");
const { getAll } = require("./handleFactory");

/**
 * get all carts
 */
exports.getAllCartProduct = getAll(CartModel);

/**
 * Add product to cart
 */
exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, color, size, quantity } = req.body;
  let userId = req.user;

  const product = await Products.findById(productId);
  const cart = await CartModel.findOne({ userId });

  if (!product) {
    throw new AppError("No product found with this id", 404);
  }

  if (cart) {
    const indexOfProduct = cart.items.findIndex(
      (item) => item.product.toString() == productId.toString()
    );

    if (indexOfProduct > -1) {
      cart.items[indexOfProduct].totalProductQuantity += quantity;
      cart.items[indexOfProduct].totalProductPrice =
        cart.items[indexOfProduct].totalProductQuantity * product.price;
      cart.items[indexOfProduct].color = color;
      cart.items[indexOfProduct].size = size;

      cart.totalQuantity += quantity;
      cart.totalPrice += quantity * product.price;
    } else {
      cart.items.push({
        product: productId,
        color: color,
        size: size,
        totalProductQuantity: quantity,
        totalProductPrice: quantity * product.price,
      });

      cart.totalQuantity += quantity;
      cart.totalPrice += quantity * product.price;
    }

    await cart.save();

    return res.status(200).json({
      status: "success",
      data: cart,
    });
  }

  // create cart if not exist
  let newCart = await new CartModel({
    userId: userId,
    items: [
      {
        product: productId,
        color: color,
        size: size,
        totalProductQuantity: quantity,
        totalProductPrice: quantity * product.price,
      },
    ],
    totalQuantity: quantity,
    totalPrice: quantity * product.price,
  }).save();

  return res.status(200).json({
    status: "success",
    data: newCart,
  });
});

/**
 * remove cart item
 */
exports.removeItem = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  let userId = req.user;

  let cart = await CartModel.findOne({
    userId,
  });

  if (!cart) {
    throw new AppError("no cart found with supplied id", 404);
  }

  let productIndex = cart.items.findIndex((item) => item.product == productId);

  if (productIndex < 0) {
    return res.status(200).json({
      status: "failed",
      message: "item not found in cart",
      data: cart,
    });
  }

  cart.totalQuantity -= cart.items[productIndex].totalProductQuantity;
  cart.totalPrice -= cart.items[productIndex].totalProductPrice;
  cart.items.splice(productIndex, 1);

  let result = await cart.save();

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * Get user cart
 */
exports.getUserCart = catchAsync(async (req, res, next) => {
  let userId = req.user;

  let cart = await CartModel.findOne({
    userId,
  });

  if (!cart) {
    throw new AppError("No cart exist for this user", 404);
  }

  return res.status(200).json({
    status: "success",
    data: cart,
  });
});

/**
 * increase product quantity by one
 */
exports.increaseByOne = catchAsync(async (req, res, next) => {
  let { productId } = req.params;
  let userId = req.user;

  let cart = await CartModel.findOne({
    userId
  });

  let productIndexInCart = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  console.log(productIndexInCart);

  if (productIndexInCart < 0) {
    throw new AppError("product not found in cart", 404);
  }

  cart.items[productIndexInCart].totalProductQuantity += 1;
  recalculateCart(cart);

  let result = await cart.save();

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * decrease product quantity by one
 */
exports.decreaseByOne = catchAsync(async (req, res, next) => {
  let { productId } = req.params;
  let userId = req.user;

  let cart = await CartModel.findOne({
    userId
  });

  let productIndexInCart = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString()
  );

  if (productIndexInCart < 0) {
    throw new AppError("product not found in cart", 404);
  }

  cart.items[productIndexInCart].totalProductQuantity <= 1
    ? (cart.items[productIndexInCart].totalProductQuantity = 1)
    : (cart.items[productIndexInCart].totalProductQuantity -= 1);
  recalculateCart(cart);

  let result = await cart.save();

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

/**
 * recalculate cart total item and price
 */

const recalculateCart = (cart) => {
  let price = [];
  let quantity = [];
  cart.items.forEach((item) => {
    quantity.push(item.totalProductQuantity);
    price.push(item.totalProductQuantity * item.totalProductPrice);
  });

  cart.totalQuantity = quantity.reduce((a, b) => total);
  cart.totalPrice = price.reduce((a, b) => total);

  console.log(cart);

  return cart;
};
