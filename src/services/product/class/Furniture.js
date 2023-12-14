"use strict";

const furnitureModel = require("../../../models/product/furniture.model");

const {
  updateProductById,
  createProductAttributes,
} = require("../../../models/repositories/product.repo");
const { removeUndefinedNull } = require("../../../utils");
const Product = require("./product");

class Furniture extends Product {
  async createProduct() {
    const { attributes, productId } = await createProductAttributes({
      payload: {
        ...this.product_attributes,
        product_shop: this.product_shop,
      },
      model: furnitureModel,
    });

    this.product_attributes = attributes;

    return await super.createProduct(productId);
  }

  async updateProduct(productId) {
    const objectParams = this;

    if (objectParams.product_attributes) {
      objectParams.product_attributes = await updateProductById({
        productId,
        payload: removeUndefinedNull(objectParams.product_attributes),
        model: furnitureModel,
      });
    }

    return await super.updateProduct(
      productId,
      removeUndefinedNull(objectParams)
    );
  }
}

module.exports = Furniture;
