"use strict";
const byscrypt = require("bcrypt");
const { BadRequestError } = require("../core/error.response");
const {
  getUserByEmail,
  createNewUser,
  updateUserToShop,
} = require("../models/user/user.repo");

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
    return await updateUserToShop({ userId });
  }
  // Delete
}

module.exports = UserService;
