"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const {
  addOrCreateCartWithOrder,
  getCartByUserIdAndShopId,
  addProductToOrderProducts,
  deleteUserCart,
  removeProductFromUserCart,
  getCartByUserId,
} = require("../models/cart/cart.repo");
const { findProduct } = require("../models/product/product.repo");

/*
    - Add product to Cart [User]
    - Reduce product quantity by one [User]
    - Increase product quantity by one [User]
    - Get cart lists [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

class CartService {
  // Get
  static async getUserCart({ userId }) {
    const foundCart = await getCartByUserId({ userId });
    if (!foundCart) {
      throw new NotFoundError(`Cart not found`);
    }
    return foundCart;
  }
  // Create
  static async addToCart({ userId, product }) {
    // check for
    const foundProduct = await findProduct({
      productId: product._id,
      unSelect: [],
    });
    if (!foundProduct) {
      throw new NotFoundError(`Product not found`);
    }

    const { product_shopId, product_name, product_price, _id } = foundProduct;

    const addToCartProduct = {
      product_id: _id,
      product_shopId,
      product_price,
      product_name,
    };

    // Check if the user has a cart with matching product_shopId
    const existingCart = await getCartByUserIdAndShopId({
      userId,
      shopId: addToCartProduct.product_shopId,
    });
    if (!existingCart) {
      await addOrCreateCartWithOrder({
        userId,
        shopId: addToCartProduct.product_shopId,
      });
    }

    // if cart exist then update product quantity
    return await addProductToOrderProducts({
      userId,
      product: addToCartProduct,
    });
  }
  // Update
  static async removeProductFromUserCart({ userId, productId }) {
    const foundCart = await getCartByUserId({ userId });
    if (!foundCart) {
      throw new NotFoundError(`Cart not found`);
    }
    if (foundCart?.cart_orders.length === 0) {
      throw new NotFoundError(`Cart empty!`);
    }
    const foundProduct = await findProduct({
      productId,
      unSelect: [],
    });
    if (!foundProduct) {
      throw new NotFoundError(`Product not found`);
    }

    const removeProduct = await removeProductFromUserCart({
      userId,
      productId,
      shopId: foundProduct.product_shopId,
    });

    if (removeProduct.modifiedCount === 0) {
      throw new NotFoundError(`Product not in cart`);
    }
    return removeProduct;
  }
  // Delete
  static async deleteUserCart({ userId }) {
    const foundCart = await getCartByUserId({ userId });
    if (!foundCart) {
      throw new NotFoundError(`Cart not found`);
    }
    return await deleteUserCart({ userId });
  }
}

module.exports = CartService;
