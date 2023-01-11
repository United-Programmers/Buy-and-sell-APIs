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
const { decodeToken } = require("./authController");
const { deleteOne, updateOne, createOne, getAll } = require("./handleFactory");

exports.getAllCartProduct = getAll(CartModel);
exports.createCartProduct = createOne(CartModel);
exports.updateCartProduct = updateOne(CartModel);
exports.deleteCartProduct = deleteOne(CartModel);

/**
 * Add product to cart
 */
exports.addProductToCart = catchAsync(async (req, res) => {
  const { productId, color, size, quantity } = req.body;

  let decodedJwtToken = await decodeToken(
    req.headers.authorization.split(" ")[1]
  );
  let userId = decodedJwtToken.id;

  const productExist = await Products.findById(productId);
  const cartExist = await CartModel.findOne({ userId });

  if (!productExist) {
    throw new AppError("No product found with this id", 404);
  }

  if (cartExist) {
    const indexOfProduct = cartExist.items.findIndex(
      (item) => item.product.toString() == productId.toString()
    );

    if (indexOfProduct > -1) {
      cartExist.items[indexOfProduct].totalProductQuantity += quantity;
      cartExist.items[indexOfProduct].totalProductPrice =
        cartExist.items[indexOfProduct].totalProductQuantity *
        productExist.price;
      cartExist.items[indexOfProduct].color = color;
      cartExist.items[indexOfProduct].size = size;

      cartExist.totalQuantity += quantity;
      cartExist.totalPrice += quantity * productExist.price;
    } else {
      cartExist.items.push({
        product: productId,
        color: color,
        size: size,
        totalProductQuantity: quantity,
        totalProductPrice: quantity * productExist.price,
      });

      cartExist.totalQuantity += quantity;
      cartExist.totalPrice += quantity * productExist.price;
    }

    await cartExist.save();

    return res.status(200).json({
      status: "success",
      data: cartExist,
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
        totalProductPrice: quantity * productExist.price,
      },
    ],
    totalQuantity: quantity,
    totalPrice: quantity * productExist.price,
  }).save();

  return res.status(200).json({
    status: "success",
    data: newCart,
  });
});

/**
 * remove cart item
 */
exports.removeItem = catchAsync(async (req, res) => {
  const productId = req.params.id;
  let decodedJwtToken = await decodeToken(
    req.headers.authorization.split(" ")[1]
  );

  let cart = await CartModel.findOne({
    userId: decodedJwtToken.id,
  });

  if (!cart) {
    throw new AppError("no cart found with supplied id", 404);
  }

  let productIndex = cart.items.findIndex(item => item.product == productId);

  if(productIndex < 0){
    return res.status(200).json({
        status: "failed",
        message: "item not found in cart",
        data: cart
    })
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
exports.getUserCart = catchAsync(async (req, res) => {
    let decodedJwtToken = await decodeToken(
        req.headers.authorization.split(" ")[1]
      );
    
      let cart = await CartModel.findOne({
        userId: decodedJwtToken.id,
      });

      if(!cart){
        throw new AppError("No cart exist for this user", 404);
      }

      return res.status(200).json({
        status: "success",
        data: cart
      })
})