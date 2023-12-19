"use strict";

const express = require("express");
const { checkApiKey, checkPermission } = require("../auth/checkAuth");
const { ApiKeyPermissionEnum } = require("../models/apikey/apiKey.enum");
const router = express.Router();

// check apiKey
router.use(checkApiKey);
// check permission
router.use(checkPermission(ApiKeyPermissionEnum.REGULAR));

router.use("/v1/api/cart", require("./cart.route"));
router.use("/v1/api/discount", require("./discount.route"));
router.use("/v1/api/product", require("./product.route"));
router.use("/v1/api/user", require("./user.route"));
router.use("/v1/api", require("./access.route"));

module.exports = router;
