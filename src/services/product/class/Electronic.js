"use strict";

const electronicModel = require("../../../models/product/electronic.model");
const {
  createProductAttributes,
  updateProductById,
} = require("../../../models/repositories/product.repo");

const { removeUndefinedNull } = require("../../../utils");
const Product = require("./product");

class Electronic extends Product {
  async createProduct() {
    const { attributes, productId } = await createProductAttributes({
      payload: {
        ...this.product_attributes,
        product_shop: this.product_shop,
      },
      model: electronicModel,
    });

    this.product_attributes = attributes;

    return await super.createProduct(productId);
  }

  async updateProduct({ productId, shopId }) {
    const objectParams = this;

    if (objectParams?.product_attributes) {
      objectParams.product_attributes = await updateProductById({
        productId,
        shopId,
        payload: removeUndefinedNull(objectParams.product_attributes),
        model: electronicModel,
      });
    }

    return await super.updateProduct({
      productId,
      shopId,
      payload: removeUndefinedNull(objectParams),
    });
  }
}

module.exports = Electronic;
