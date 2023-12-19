"use strict";

const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.service");

class UserController {
  // Get
  // Create
  // Update
  setUserToShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Success set user to shop!",
      metadata: await UserService.setUserToShop({
        userId: req.user.userId,
      }),
    }).send(res);
  };
  // Delete
}
module.exports = new UserController();
