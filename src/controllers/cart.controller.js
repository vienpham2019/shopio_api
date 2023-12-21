"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  //  Get
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
