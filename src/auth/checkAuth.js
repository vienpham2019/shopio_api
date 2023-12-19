"use strict";

const { ForbiddenError, BadRequestError } = require("../core/error.response");
const { asyncHandler } = require("../helpers/asyncHandler");
const { findApiKey } = require("../models/apikey/apiKey.repo");
const { getUserById } = require("../models/user/user.repo");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "athorization",
};

const checkApiKey = asyncHandler(async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      // return res.status(403).json({
      //   message: "API Key not found",
      // });
      throw new ForbiddenError("API Key not found");
    }

    // check objKey
    const objKey = await findApiKey({ key });
    if (!objKey) {
      // return res.status(403).json({
      //   message: "Invalid API Key",
      // });
      throw new ForbiddenError("Invalid API Key");
    }

    req.objKey = objKey;
    return next();
  } catch (error) {
    throw error;
  }
});

const checkPermission = (permission) => {
  return asyncHandler((req, res, next) => {
    try {
      if (!req?.objKey?.permissions) {
        throw new ForbiddenError("Permission denied");
      }
      const validPermission = req.objKey.permissions.includes(permission);
      if (!validPermission) {
        throw new ForbiddenError("Permission denied");
      }
      return next();
    } catch (error) {
      throw error;
    }
  });
};

const checkUserRole = (role) => {
  return asyncHandler(async (req, res, next) => {
    try {
      const foundUser = await getUserById({ userId: req.user.userId });
      const validUserRole = foundUser.user_roles.includes(role);
      if (!validUserRole) {
        throw new BadRequestError("Request denied");
      }
      return next();
    } catch (error) {
      throw error;
    }
  });
};

module.exports = {
  checkApiKey,
  checkPermission,
  checkUserRole,
};
