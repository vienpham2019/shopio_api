"use strict";

const express = require("express");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const { setUserToShop } = require("../controllers/user.controller");

const router = express.Router();

// Authentication
router.use(authentication);

router.patch("/setToShop", asyncHandler(setUserToShop));
module.exports = router;
