"use strict";

const express = require("express");
const ProductController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
// const { authentication } = require("../../auth/authUtil");
const router = express.Router();

// create product
router.post("", asyncHandler(ProductController.createNewProduct));

module.exports = router;
