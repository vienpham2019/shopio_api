"use strict";

const { BadRequestError } = require("../../../core/error.response");
const electronicModel = require("../../../models/product/electronic.model");
const {
  createProductAttributes,
  updateProductById,
  deleteDraftProduct,
} = require("../../../models/repositories/product.repo");

const { removeUndefinedNull } = require("../../../utils");
const Product = require("./product");

class Electronic extends Product {
  static async createProduct(payload) {
    return await super.createProduct({
      payload,
      attributesModel: electronicModel,
    });
  }

  static async updateProduct({ productId, shopId, unSelect, payload }) {
    return await super.updateProduct({
      productId,
      shopId,
      payload,
      unSelect,
      attributesModel: electronicModel,
    });
  }

  static async deleteDraftProduct({ productId, shopId }) {
    await super.deleteDraftProduct({ productId, shopId });
    return await deleteDraftProduct({
      productId,
      shopId,
      attributesModel: electronicModel,
    });
  }
}

module.exports = Electronic;
