"use strict";

const express = require("express");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const {
  getAllDiscountCodeByShop,
  getAllDiscountCodeByUser,
  getAllDiscountCodesWithProduct,
  getDiscountAmount,
  createDiscountCode,
  updateDiscountCode,
  cancleDiscountCode,
  deleteDiscountCode,
} = require("../controllers/discount.controller");
const router = express.Router();

router.get("/shop/:shopId", asyncHandler(getAllDiscountCodeByUser));
router.get("/product", asyncHandler(getAllDiscountCodesWithProduct));

// Authentication
router.use(authentication);
router.get("/shop", asyncHandler(getAllDiscountCodeByShop));

router.post("/shop", asyncHandler(createDiscountCode));

router.patch("/amount", asyncHandler(getDiscountAmount));
router.patch("/shop/:discountId", asyncHandler(updateDiscountCode));
router.patch("/cancle", asyncHandler(cancleDiscountCode));

router.delete("/shop", asyncHandler(deleteDiscountCode));

module.exports = router;