"use strict";

const cartModel = require("../cart/cart.model");

// Get
const getCartByUserId = async ({ userId }) => {
  return await cartModel.findOne({ cart_userId: userId });
};

// Create

// Update
const addProductToCart = async ({ userId, product }) => {
  product.product_id = product._id;
  const query = { cart_userId: userId, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
    $inc: {
      cart_count_product: 1,
    },
  };
  const options = { upsert: true, new: true };
  return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
};

const updateProductQuantity = async ({ userId, product }) => {
  const { _id, product_quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.product_id": _id,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.product_quantity": product_quantity,
    },
  };
  const options = { new: true };
  return await cartModel.findOneAndUpdate(query, updateSet, options);
};
// Delete

module.exports = {
  getCartByUserId,
  addProductToCart,
  updateProductQuantity,
};
