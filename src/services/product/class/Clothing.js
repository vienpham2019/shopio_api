"use strict";

const clothingModel = require("../../../models/product/clothing.model");
const Product = require("./product");

class Clothing extends Product {
  static async createProduct(payload) {
    return await super.createProduct({
      payload,
      attributesModel: clothingModel,
    });
  }

  static async updateProduct({ productId, shopId, unSelect, payload }) {
    return await super.updateProduct({
      productId,
      shopId,
      payload,
      unSelect,
      attributesModel: clothingModel,
    });
  }

  static async deleteDraftProduct({ productId, shopId }) {
    return await super.deleteDraftProduct({
      productId,
      shopId,
      attributesModel: clothingModel,
    });
  }
}

module.exports = Clothing;
