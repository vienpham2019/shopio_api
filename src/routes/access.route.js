"use strict";

const express = require("express");
const router = express.Router();

const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");
const {
  signUp,
  logIn,
  logOut,
  handlerRefreshToken,
} = require("../controllers/access.controller");

router.post("/shop/signup", asyncHandler(signUp));
router.post("/shop/login", asyncHandler(logIn));

// authentication
router.use(authentication);

router.post("/shop/logout", asyncHandler(logOut));
router.post("/shop/handlerRefreshToken", asyncHandler(handlerRefreshToken));

module.exports = router;
