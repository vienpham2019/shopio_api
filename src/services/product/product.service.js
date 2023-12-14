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

  static async createProduct({ type, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).createProduct();
  }

  // PATCH //
  static async updateProduct({ type, productId, shopId, payload }) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new BadRequestError("Invalid product Id");
    }
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Type ${type}`);
    }
    return new productClass(payload).updateProduct({
      productId,
      shopId,
    });
  }
  // END PATCH //

  // PUT //
  static async publishProductByShop({ productId, shopId }) {
    return await publishProductByShop({ productId, shopId });
  }
  static async unPublishProductByShop({ productId, shopId }) {
    return await unPublishProductByShop({ productId, shopId });
  }

  // End PUT //

  // QUERY //
  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    return await findAllDraftsForShop({ shopId, limit, skip });
  }

  static async findAllPublishsForShop({ shopId, limit = 50, skip = 0 }) {
    return await findAllPublishsForShop({ shopId, limit, skip });
  }

  static async searchProductByUser({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = {},
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumbnail"],
    });
  }

  static async findProduct({ productId }) {
    if (!mongoose.isValidObjectId(productId)) {
      throw new BadRequestError("Invalid product Id");
    }
    return await findProduct({ productId, unSelect: ["__v"] });
  }

  // END QUERY //
}

// register product type
ProductFactory.registerProductType("Electronic", require("./class/Electronic"));
ProductFactory.registerProductType("Clothing", require("./class/Clothing"));
ProductFactory.registerProductType("Furniture", require("./class/Furniture"));

module.exports = ProductFactory;
