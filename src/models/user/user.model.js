"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required
const { UserRoleEnum, UserStatusEnum } = require("./user.enum");

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "Users";

// Declare the Schema of the Mongo model
const userSchema = new Schema(
  {
    user_name: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    user_email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_status: {
      type: String,
      enum: Object.values(UserStatusEnum),
      default: UserStatusEnum.INACTIVE,
    },
    user_verify: {
      type: Schema.Types.Boolean,
      default: false,
    },
    user_roles: {
      type: [String],
      default: [UserRoleEnum.USER],
      enum: Object.values(UserRoleEnum),
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);
