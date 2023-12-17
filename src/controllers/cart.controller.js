"use strict";

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "Add product to cart Success!",
      metadata: await CartService.addToCart({
        product: req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
