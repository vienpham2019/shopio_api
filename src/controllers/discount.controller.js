"use strict";

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  // [Shop | Admin]
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code Success!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // [Shop]
  updateDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Update discount code Success!",
      metadata: await DiscountService.updateDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // [Shop]
  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Delete discount code Success!",
      metadata: await DiscountService.deleteDiscountCode({
        code: req.params.cod,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // [Shop | User]
  getAllDiscountCodeByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount code Success!",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  // [User]
  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount codes Success!",
      metadata: await DiscountService.getAllDiscountCodesWithProduct(req.query),
    }).send(res);
  };

  // [User]
  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Get discount amount Success!",
      metadata: await DiscountService.getDiscountAmount(req.body),
    }).send(res);
  };

  // [User]
  cancleDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Cancle discount codes Success!",
      metadata: await DiscountService.cancleDiscountCode(req.query),
    }).send(res);
  };
}

module.exports = new DiscountController();
