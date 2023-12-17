"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  getCartByUserId,
  createCart,
  addProductToCart,
  updateProductQuantity,
} = require("../models/repositories/cart.repo");

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
  // Create
  // Update
  static async addToCart({ userId, product }) {
    // Check for exists cart
    const foundCart = await getCartByUserId({ userId });
    if (!foundCart || foundCart?.cart_products.length === 0) {
      return await addProductToCart({ userId, product });
    }

    const existingProduct = foundCart.cart_products.find(
      (cartProduct) =>
        cartProduct.product_id.toString() === product._id.toString()
    );

    console.log(existingProduct);

    if (!existingProduct) {
      return await addProductToCart({ userId, product });
    }

    return await updateProductQuantity({ userId, product });
  }
  // Delete
}

module.exports = CartService;
