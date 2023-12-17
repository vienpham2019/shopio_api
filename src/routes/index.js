"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(checkApiKey);
// check permission
router.use(checkPermission("0000"));

router.use("/v1/api/cart", require("./cart.route"));
router.use("/v1/api/discount", require("./discount.route"));
router.use("/v1/api/product", require("./product.route"));
router.use("/v1/api", require("./access.route"));

module.exports = router;
