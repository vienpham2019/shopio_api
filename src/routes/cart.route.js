"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const { addToCart, deleteUserCart } = require("../controllers/cart.controller");

// authentication
router.use(authentication);

router.post("/addToCart", asyncHandler(addToCart));

router.delete("/deleteCart", asyncHandler(deleteUserCart));

module.exports = router;
