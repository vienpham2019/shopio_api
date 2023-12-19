"use strict";
const byscrypt = require("bcrypt");
const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  getUserByEmail,
  createNewUser,
  updateUserToShop,
  getUserById,
} = require("../models/user/user.repo");
const { UserRoleEnum } = require("../models/user/user.enum");

class UserService {
  // Get
  // Create
  static async createUser({ name, email, password }) {
    const existsEmail = await getUserByEmail({
      email,
    });

    if (existsEmail) {
      throw new BadRequestError("Error: Email already registered!");
    }

    const passwordHash = await byscrypt.hash(password, 10);

    const newUser = {
      user_name: name,
      user_email: email,
      user_password: passwordHash,
    };

    return await createNewUser({
      payload: newUser,
    });
  }
  // Update
  static async setUserToShop({ userId }) {
    const foundUser = await getUserById({ userId });
    if (!foundUser) {
      throw new BadRequestError(`User not found`);
    }
    if (foundUser.user_roles.includes(UserRoleEnum.SHOP)) {
      throw new BadRequestError(`User already shop`);
    }
    const updateUser = await updateUserToShop({ userId });
    if (!updateUser) {
      throw new ForbiddenError(`Update user error`);
    }
    return {
      updateCount: 1,
    };
  }
  // Delete
}

module.exports = UserService;
