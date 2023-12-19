"use strict";

const { Schema, model, Types } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const orderProductSchema = new Schema(
  {
    product_id: {
      type: Types.ObjectId, // Assuming this refers to a Product model
      required: true,
      ref: "Product",
    },
    product_name: {
      type: String,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
      default: 0, // You can set a default quantity if needed
    },
    product_old_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    product_price: {
      type: Number,
      required: true,
    },
  },
  { _id: false } // Specify _id: false to exclude _id field from embedded documents
);

const cartOrdersSchema = new Schema(
  {
    order_shopId: {
      type: Types.ObjectId, // Assuming this refers to a Shop model
      required: true,
      ref: "User",
    },
    order_products: {
      type: [orderProductSchema],
      required: true,
      default: [],
    },
    order_version: { type: Number, required: true, default: 2000 },
  },
  { _id: false } // Specify _id: false to exclude _id field from embedded documents
);

// Declare the Schema of the Mongo model
const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_orders: { type: [cartOrdersSchema], required: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, cartSchema);
