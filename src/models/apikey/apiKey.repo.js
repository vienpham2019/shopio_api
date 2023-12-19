"use strict";
const crypto = require("crypto");
const apikeyModel = require("./apikey.model");
const { ApiKeyPermissionEnum } = require("./apiKey.enum");

// Get
const findApiKey = async ({ key }) => {
  return await apikeyModel.findOne({ key, status: true }).lean();
};
// Create
const createApiKey = async ({
  permissions = [ApiKeyPermissionEnum.REGULAR],
}) => {
  return await apikeyModel.create({
    key: crypto.randomBytes(64).toString("hex"),
    permissions,
  });
};
// Update

// Delete

module.exports = {
  findApiKey,
  createApiKey,
};
