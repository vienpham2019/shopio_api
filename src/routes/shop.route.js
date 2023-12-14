"use strict";

const express = require("express");
const { asyncHandler } = require("../helpers/asyncHandler");
const { authentication } = require("../auth/authUtil");

const router = express.Router();

// Authentication
router.use(authentication);

module.exports = router;
