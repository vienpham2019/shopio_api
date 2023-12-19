"use strict";

const electronicModel = require("../../../models/product/electronic.model");
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
    return await super.deleteDraftProduct({
      productId,
      shopId,
      attributesModel: electronicModel,
    });
  }
}

module.exports = Electronic;
