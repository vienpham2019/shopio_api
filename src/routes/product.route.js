"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const {
  searchProductByUser,
  getAllProducts,
  getProduct,
  updateProduct,
  createNewProduct,
  publishProductByShop,
  unPublishProductByShop,
  getAllDraftsForShop,
  getAllPublishsForShop,
} = require("../controllers/product.controller");

router.get("/search/:keySearch", asyncHandler(searchProductByUser));
router.get("", asyncHandler(getAllProducts));
router.get("/:productId", asyncHandler(getProduct));

// Authentication
router.use(authentication);

// update product
router.patch("/:productId", asyncHandler(updateProduct));

// create product
router.post("", asyncHandler(createNewProduct));
router.post("/publish/:productId", asyncHandler(publishProductByShop));
router.post("/unpublish/:productId", asyncHandler(unPublishProductByShop));

// query
router.get("/drafts/all", asyncHandler(getAllDraftsForShop));
router.get("/published/all", asyncHandler(getAllPublishsForShop));

module.exports = router;
