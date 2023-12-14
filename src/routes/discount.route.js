"use strict";

const express = require("express");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const {
  getAllDiscountCodeByShop,
  getAllDiscountCodesWithProduct,
  getDiscountAmount,
  createDiscountCode,
  updateDiscountCode,
  cancleDiscountCode,
  deleteDiscountCode,
} = require("../controllers/discount.controller");
const router = express.Router();

router.get("/:shopId", asyncHandler(getAllDiscountCodeByShop));
router.get("/:productId", asyncHandler(getAllDiscountCodesWithProduct));
router.get("/amount", asyncHandler(getDiscountAmount));

// Authentication
router.use(authentication);

router.patch("/:discountId", asyncHandler(updateDiscountCode));
router.patch("/cancle", asyncHandler(cancleDiscountCode));
router.post("", asyncHandler(createDiscountCode));

router.delete("/:id", asyncHandler(deleteDiscountCode));

module.exports = router;
