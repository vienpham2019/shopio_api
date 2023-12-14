"use strict";

const { BadRequestError } = require("../../../core/error.response");
const productModel = require("../../../models/product/product.model");
const {
  insertInventory,
} = require("../../../models/repositories/inventory.repo");

const {
  updateProductById,
} = require("../../../models/repositories/product.repo");

class Product {
  constructor({
    product_name,
    product_thumbnail,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumbnail = product_thumbnail;
    this.product_description = product_description;
    this.product_type = product_type;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //   create product
  async createProduct(productd) {
    const newProduct = await productModel.create({
      ...this,
      _id: productd,
    });

    if (!newProduct) throw new BadRequestError("Create new Product Error");

    await insertInventory({
      productId: newProduct._id,
      shopId: this.product_shop,
      stock: this.product_quantity,
    });

    return newProduct;
  }

  // Update Product
  async updateProduct({ productId, shopId, payload }) {
    return await updateProductById({
      productId,
      shopId,
      payload,
      model: productModel,
      unSelect: [],
    });
  }
}

module.exports = Product;
