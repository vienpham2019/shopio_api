"use strict";

const { mongoose } = require("mongoose");
const { BadRequestError } = require("../../core/error.response");
const {
  findAllDraftsForShop,
  findAllPublishsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
} = require("../../models/repositories/product.repo");

// define Factory class to create product
class ProductFactory {
  static productRegistry = {}; // key - class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).createProduct();
  }

  // PATCH //
  static async updateProduct(type, product_id, payload) {
    if (!mongoose.isValidObjectId(product_id)) {
      throw new BadRequestError("Invalid product Id");
    }
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).updateProduct(product_id);
  }
  // END PATCH //

  // PUT //
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }
  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  // End PUT //

  // QUERY //
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await findAllPublishsForShop({ query, limit, skip });
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumbnail"],
    });
  }

  static async findProduct({ product_id }) {
    if (!mongoose.isValidObjectId(product_id)) {
      throw new BadRequestError("Invalid product Id");
    }
    return await findProduct({ product_id, unSelect: ["__v"] });
  }

  // END QUERY //
}

// register product type
ProductFactory.registerProductType("Electronic", require("./class/Electronic"));
ProductFactory.registerProductType("Clothing", require("./class/Clothing"));
ProductFactory.registerProductType("Furniture", require("./class/Furniture"));

module.exports = ProductFactory;
