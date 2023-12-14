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
router.get("/:product_id", asyncHandler(getProduct));

// Authentication
router.use(authentication);

// update product
router.patch("/:product_id", asyncHandler(updateProduct));

// create product
router.post("", asyncHandler(createNewProduct));
router.post("/publish/:id", asyncHandler(publishProductByShop));
router.post("/unpublish/:id", asyncHandler(unPublishProductByShop));

// query
router.get("/drafts/all", asyncHandler(getAllDraftsForShop));
router.get("/published/all", asyncHandler(getAllPublishsForShop));

module.exports = router;
