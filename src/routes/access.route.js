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

router.post("/signup", asyncHandler(signUp));
router.post("/login", asyncHandler(logIn));

// authentication
router.use(authentication);

router.post("/logout", asyncHandler(logOut));
router.post("/handlerRefreshToken", asyncHandler(handlerRefreshToken));

module.exports = router;
