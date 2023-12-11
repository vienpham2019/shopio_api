"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtil");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.searchProductByUser)
);
router.get("", asyncHandler(ProductController.getAllProducts));
router.get("/:product_id", asyncHandler(ProductController.getProduct));

router.use(authentication);
// create product
router.post("", asyncHandler(ProductController.createNewProduct));
router.post(
  "/publish/:id",
  asyncHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(ProductController.unPublishProductByShop)
);

// query
router.get("/drafts/all", asyncHandler(ProductController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(ProductController.getAllPublishsForShop)
);

module.exports = router;
