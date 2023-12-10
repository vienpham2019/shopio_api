"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createNewProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product success!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish Product success!",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  // QUERY //
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts Product success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish Product success!",
      metadata: await ProductService.findAllPublishsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  searchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "SearchProduct success!",
      metadata: await ProductService.searchProductByUser(req.params),
    }).send(res);
  };
  // END QUERY //
}

module.exports = new ProductController();
