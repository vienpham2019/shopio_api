"use strict";

const { BadRequestError } = require("../../../core/error.response");
const productModel = require("../../../models/product/product.model");
const {
  createInventory,
  deleteInventory,
} = require("../../../models/inventory/inventory.repo");

const {
  updateProductById,
  createProductAttributes,
  deleteDraftProduct,
} = require("../../../models/product/product.repo");
const { removeUndefinedNull } = require("../../../utils");

class Product {
  //   create product
  static async createProduct({ payload, attributesModel }) {
    const attributes_payload = removeUndefinedNull(payload.product_attributes);
    const { attributes, productId } = await createProductAttributes({
      payload: {
        ...attributes_payload,
        product_shopId: payload.product_shopId,
      },
      model: attributesModel,
    });

    payload.product_attributes = attributes;

    const newProduct = await productModel.create({
      ...payload,
      _id: productId,
    });

    if (!newProduct) throw new BadRequestError("Create new Product Error");

    await createInventory({
      productId: newProduct._id,
      shopId: newProduct.product_shopId,
      stock: newProduct.product_quantity,
    });

    return newProduct;
  }

  // Update Product
  static async updateProduct({
    productId,
    shopId,
    payload,
    unSelect,
    attributesModel,
  }) {
    const updateProd = payload;
    if (updateProd.product_attributes) {
      updateProd.product_attributes = await updateProductById({
        productId,
        shopId,
        payload: removeUndefinedNull(updateProd.product_attributes),
        model: attributesModel,
        unSelect,
      });
    }

    return await updateProductById({
      productId,
      shopId,
      payload: removeUndefinedNull(updateProd),
      model: productModel,
      unSelect: [],
    });
  }

  static async deleteDraftProduct({ productId, shopId, attributesModel }) {
    await deleteInventory({ productId, shopId });
    return await deleteDraftProduct({ productId, shopId, attributesModel });
  }
}

module.exports = Product;
