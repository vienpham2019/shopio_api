"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");

const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  findAllPublishsForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedNull } = require("../utils");
const { mongoose } = require("mongoose");

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

// define base product class
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
  async createProduct(product_id) {
    return await product.create({
      ...this,
      _id: product_id,
    });
  }

  // Update Product
  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}

//   Define sub-class for diffrent product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create new Clothing error");
    }

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    // remove attr has null or undefined
    const objectParams = this;
    // check for relate update attr
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: removeUndefinedNull(objectParams.product_attributes),
        model: clothing,
      });
    }

    return await super.updateProduct(
      productId,
      removeUndefinedNull(objectParams)
    );
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic) {
      throw new BadRequestError("Create new Electronic error");
    }

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    // remove attr has null or undefined
    const objectParams = this;
    //check for relate update attr
    if (objectParams?.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: removeUndefinedNull(objectParams.product_attributes),
        model: electronic,
      });
    }

    return await super.updateProduct(
      productId,
      removeUndefinedNull(objectParams)
    );
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("Create new Furniture error");
    }

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new BadRequestError("Create new Product error");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    // remove attr has null or undefined
    const objectParams = this;
    // check for relate update attr
    if (objectParams?.product_attributes) {
      // update child
      await updateProductById({
        productId,
        payload: removeUndefinedNull(objectParams.product_attributes),
        model: furniture,
      });
    }

    return await super.updateProduct(
      productId,
      removeUndefinedNull(objectParams)
    );
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
