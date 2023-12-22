"use strict";

const { Types } = require("mongoose");
const cartModel = require("./cart.model");
const { CartStateEnum } = require("./cart.enum");
const { BadRequestError } = require("../../core/error.response");
const { convertToObjectIdMongoDB } = require("../../utils");

// Get
const getCartByUserId = async ({ userId }) => {
  return await cartModel.findOne({ cart_userId: userId });
};

const getCartByUserIdAndShopId = async ({ userId, shopId }) => {
  const query = {
    cart_userId: userId,
    "cart_orders.order_shopId": shopId,
    cart_state: CartStateEnum.ACTIVE,
  };
  return await cartModel.findOne(query).lean();
};

// Create
const addOrCreateCartWithOrder = async ({ userId, shopId }) => {
  const query = {
    cart_userId: userId,
    cart_state: CartStateEnum.ACTIVE,
  };
  const update = {
    $addToSet: {
      cart_orders: { order_shopId: shopId },
    },
  };
  const options = {
    upsert: true,
    new: true,
  };
  return await cartModel.findOneAndUpdate(query, update, options);
};

// Update
const updateProductQuantity = async ({ userId, product }) => {
  const { _id, product_quantity } = product;
  const query = {
    cart_userId: userId,
    "cart_products.product_id": _id,
    cart_state: CartStateEnum.ACTIVE,
  };
  const updateSet = {
    $inc: {
      "cart_products.$.product_quantity": product_quantity,
    },
  };
  const options = { new: true };
  return await cartModel.findOneAndUpdate(query, updateSet, options);
};

const updateProductQuantityByOne = async ({ userId, product }) => {
  const query = {
    cart_userId: userId,
    "cart_orders.order_shopId": product.product_shopId,
    "cart_orders.order_products.product_id": product.product_id,
    cart_state: CartStateEnum.ACTIVE,
  };
  const update = {
    $inc: {
      "cart_orders.$[orderElem].order_products.$[productElem].product_quantity": 1,
      "cart_orders.$[orderElem].order_products.$[productElem].product_old_quantity": 1,
    },
  };
  const options = {
    arrayFilters: [
      { "orderElem.order_shopId": product.product_shopId },
      { "productElem.product_id": product.product_id },
    ],
    new: true,
  };
  return await cartModel.findOneAndUpdate(query, update, options);
};

const addProductToOrderProducts = async ({ userId, product }) => {
  const existingProduct = await cartModel.findOne({
    cart_userId: userId,
    "cart_orders.order_shopId": product.product_shopId,
    "cart_orders.order_products.product_id": product.product_id,
    cart_state: CartStateEnum.ACTIVE,
  });

  if (existingProduct) {
    // If the product already exists in order_products, return the cart
    return await updateProductQuantityByOne({ userId, product });
  }

  const query = {
    cart_userId: userId,
    "cart_orders.order_shopId": product.product_shopId,
    cart_state: CartStateEnum.ACTIVE,
  };
  const update = {
    $addToSet: {
      "cart_orders.$[orderElem].order_products": product,
    },
    $inc: { cart_count_product: 1 },
  };
  const options = {
    arrayFilters: [{ "orderElem.order_shopId": product.product_shopId }],
    new: true,
  };

  return await cartModel.findOneAndUpdate(query, update, options);
};

const removeProductFromUserCart = async ({ userId, productId, shopId }) => {
  const removeProductFromCart = await cartModel.updateOne(
    {
      cart_userId: userId,
      "cart_orders.order_shopId": shopId,
      cart_state: CartStateEnum.ACTIVE,
      "cart_orders.order_products.product_id": productId,
    },
    {
      $pull: {
        "cart_orders.$[orderElem].order_products": { product_id: productId },
      },
      $inc: { cart_count_product: -1 },
    },
    {
      arrayFilters: [{ "orderElem.order_shopId": shopId }],
      new: true,
    }
  );

  if (!removeProductFromCart) {
    throw new BadRequestError(`Product not found in cart`);
  }

  // Remove the entire order_products array if it's empty
  const removeEmptyOrderProducts = await cartModel.updateOne(
    {
      cart_userId: convertToObjectIdMongoDB(userId),
      cart_state: CartStateEnum.ACTIVE,
      "cart_orders.order_shopId": convertToObjectIdMongoDB(shopId),
      "cart_orders.order_products": { $exists: true, $eq: [] },
    },
    {
      $pull: {
        cart_orders: {
          order_shopId: convertToObjectIdMongoDB(shopId),
          order_products: { $exists: true, $eq: [] },
        },
      },
    }
  );

  if (removeEmptyOrderProducts) {
    return removeEmptyOrderProducts;
  }

  return removeProductFromCart;
};

// Delete
const deleteUserCart = async ({ userId }) => {
  try {
    const query = { cart_userId: userId };

    return await cartModel.deleteOne(query);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCartByUserIdAndShopId,
  getCartByUserId,
  addOrCreateCartWithOrder,
  updateProductQuantity,
  updateProductQuantityByOne,
  addProductToOrderProducts,
  deleteUserCart,
  removeProductFromUserCart,
};
