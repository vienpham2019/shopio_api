"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
const discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // fixed_amount or percentage
    discount_value: { type: Number, required: true },
    discount_code: { type: String, required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true, min: 1, default: 1 }, // max number of discount can use
    discount_used_count: { type: Number, required: true }, // number discount already use
    discount_users_used: { type: Array, default: [] }, //users
    discount_max_uses_per_user: { type: Number, required: true, min: 1 }, // number of time for user can use discount
    discount_min_order_value: { type: Number, required: true }, // minimun order total for discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: "User" },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, enum: ["all", "specific"] },
    discount_product_ids: { type: Array, default: [] }, // products can apply for this discount
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
