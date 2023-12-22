"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const {
  addToCart,
  deleteUserCart,
  removeProductFromUserCart,
  getUserCart,
} = require("../controllers/cart.controller");

// authentication
router.use(authentication);
router.get("", asyncHandler(getUserCart));
router.post("/addToCart", asyncHandler(addToCart));
router.patch("/removeProduct", asyncHandler(removeProductFromUserCart));

router.delete("/deleteCart", asyncHandler(deleteUserCart));

module.exports = router;
