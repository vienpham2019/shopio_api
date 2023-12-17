"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const { addToCart } = require("../controllers/cart.controller");

// authentication
router.use(authentication);

router.patch("/addToCart", asyncHandler(addToCart));

module.exports = router;
