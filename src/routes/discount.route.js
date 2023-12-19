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
const { checkUserRole } = require("../auth/checkAuth");
const { UserRoleEnum } = require("../models/user/user.enum");
const router = express.Router();

router.get("/shop/:shopId", asyncHandler(getAllDiscountCodeByUser));
router.get("/product", asyncHandler(getAllDiscountCodesWithProduct));

// Authentication
router.use(authentication);
router.patch("/cancle", asyncHandler(cancleDiscountCode));
router.patch("/amount", asyncHandler(getDiscountAmount));

// Check for valid role
router.use(checkUserRole(UserRoleEnum.SHOP));

router.get("/shop", asyncHandler(getAllDiscountCodeByShop));
router.post("/shop", asyncHandler(createDiscountCode));
router.patch("/shop/:discountId", asyncHandler(updateDiscountCode));
router.delete("/shop", asyncHandler(deleteDiscountCode));

module.exports = router;
