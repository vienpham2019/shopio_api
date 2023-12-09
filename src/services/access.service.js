"use strict";
const userModel = require("../models/user.model");
const byscrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { getInfoData } = require("../utils/index");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  /*
      1 - Check email in bd 
      2 - Check Password in db 
      3 - Create accesstoken and refreshtoken
      4 - Generate tokens 
      5 - Get data and return 
    */
  static logIn = async ({ email, password, refreshToken = null }) => {
    // Check email in DB
    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("Shop not registered");
    }

    // Check password in DB
    const matchPassword = byscrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      throw new AuthFailureError("Authentication Error");
    }

    // Create private and public
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    // Generate tokens
    const tokens = await createTokenPair(
      { userId: foundUser._id, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundUser._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundUser,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email unique
    const existsEmail = await userModel.findOne({ email }).lean();

    if (existsEmail) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await byscrypt.hash(password, 10);

    const newUser = await userModel.create({
      name,
      email,
      password: passwordHash,
      role: [RoleShop["SHOP"]],
    });

    if (newUser) {
      // created privateKey and publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Keys store error!");
      }

      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newUser._id,
          email,
        },
        publicKey,
        privateKey
      );
      return {
        user: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newUser,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
