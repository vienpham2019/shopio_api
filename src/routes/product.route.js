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
  deleteDraftProduct,
} = require("../controllers/product.controller");
const { checkUserRole } = require("../auth/checkAuth");
const { UserRoleEnum } = require("../models/user/user.enum");

router.get("/search", asyncHandler(searchProductByUser));
router.get("", asyncHandler(getAllProducts));
router.get("/:productId", asyncHandler(getProduct));

// Authentication
router.use(authentication);
router.use(checkUserRole(UserRoleEnum.SHOP));
// get
router.get("/drafts/all", asyncHandler(getAllDraftsForShop));
router.get("/published/all", asyncHandler(getAllPublishsForShop));

// create
router.post("", asyncHandler(createNewProduct));
router.post("/publish/:productId", asyncHandler(publishProductByShop));
router.post("/unpublish/:productId", asyncHandler(unPublishProductByShop));

// update
router.patch("/:productId", asyncHandler(updateProduct));

// delete
router.delete("/drafts/:productId", asyncHandler(deleteDraftProduct));

module.exports = router;
