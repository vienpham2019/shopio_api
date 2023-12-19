"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { ApiKeyPermissionEnum } = require("./apiKey.enum");
const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";
// Declare the Schema of the Mongo model
const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: Object.values(ApiKeyPermissionEnum),
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
