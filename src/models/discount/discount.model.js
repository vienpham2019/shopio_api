"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { DiscountAppliesToEnum, DiscountTypeEnum } = require("./discount.enum");
const productModel = require("../product/product.model");
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {
      type: String,
      default: DiscountTypeEnum.FIXED,
      enum: Object.values(DiscountTypeEnum),
    }, // fixed_amount or percentage
    discount_value: { type: Number, required: true },
    discount_code: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Custom validator to check for empty spaces
          return !/\s/.test(v); // Returns true if there are no spaces
        },
        message: (props) => `${props.value} contains empty spaces!`,
      },
    },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true, min: 1, default: 1 }, // max number of discount can use
    discount_used_count: { type: Number, required: true, default: 0 }, // number discount already use
    discount_users_used: { type: Array, default: [] }, //users
    discount_max_uses_per_user: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    }, // number of time for user can use discount
    discount_min_order_value: { type: Number, required: true }, // minimun order total for discount
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: {
      type: String,
      enum: Object.values(DiscountAppliesToEnum),
      required: true,
    },
    discount_product_ids: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    }, // products can apply for this discount
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
