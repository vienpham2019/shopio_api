"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  //  Get
  getUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Get user cart Success!",
      metadata: await CartService.getUserCart({
        userId: req.user.userId,
      }),
    }).send(res);
  };
  // Create
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add product to cart Success!",
      metadata: await CartService.addToCart({
        product: req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };

  // Update
  removeProductFromUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Remove product from cart Success!",
      metadata: await CartService.removeProductFromUserCart({
        productId: req.body._id,
        userId: req.user.userId,
      }),
    }).send(res);
  };
  // Delete
  deleteUserCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete user cart Success!",
      metadata: await CartService.deleteUserCart({
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
