"use strict";

const furnitureModel = require("../../../models/product/furniture.model");

const {
  updateProductById,
  createProductAttributes,
} = require("../../../models/repositories/product.repo");
const { removeUndefinedNull } = require("../../../utils");
const Product = require("./product");

class Furniture extends Product {
  static async createProduct(payload) {
    return await super.createProduct({
      payload,
      attributesModel: furnitureModel,
    });
  }

  static async updateProduct({ productId, shopId, unSelect, payload }) {
    return await super.updateProduct({
      productId,
      shopId,
      payload,
      unSelect,
      attributesModel: furnitureModel,
    });
  }

  static async deleteDraftProduct({ productId, shopId }) {
    return await deleteDraftProduct({
      productId,
      shopId,
      attributesModel: furnitureModel,
    });
  }
}

module.exports = Furniture;
