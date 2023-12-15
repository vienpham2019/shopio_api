"use strict";

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product/product.service");

class ProductController {
  createNewProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!",
      metadata: await ProductService.createProduct({
        type: req.body.product_type,
        payload: {
          ...req.body,
          product_shopId: req.user.userId,
        },
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product success!",
      metadata: await ProductService.updateProduct({
        productId: req.params.productId,
        shopId: req.user.userId,
        payload: req.body,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product success!",
      metadata: await ProductService.publishProductByShop({
        shopId: req.user.userId,
        productId: req.params.productId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "UnPublish Product success!",
      metadata: await ProductService.unPublishProductByShop({
        shopId: req.user.userId,
        productId: req.params.productId,
      }),
    }).send(res);
  };

  // QUERY //
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts Product success!",
      metadata: await ProductService.findAllDraftsForShop({
        shopId: req.user.userId,
        ...req.query,
      }),
    }).send(res);
  };

  getAllPublishsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish Product success!",
      metadata: await ProductService.findAllPublishsForShop({
        shopId: req.user.userId,
        ...req.query,
      }),
    }).send(res);
  };

  searchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Search product success!",
      metadata: await ProductService.searchProductByUser(req.query),
    }).send(res);
  };

  getAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Get All Products success!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  getProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Product success!",
      metadata: await ProductService.findProduct({
        productId: req.params.productId,
      }),
    }).send(res);
  };
  // END QUERY //

  // Delete
  deleteDraftProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete product success!",
      metadata: await ProductService.deleteDraftProduct({
        productId: req.params.productId,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
