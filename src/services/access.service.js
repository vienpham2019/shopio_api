"use strict";
const userModel = require("../models/user.model");
const byscrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtil");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  /*
    - This function for create new refresh token and access token when access token is expiered
    and put that refresh token in to use token of that user. 
    - If we detect refresh token already use we delete all refresh token and access token 
    and user have to login back to have new refresh token and access token. 
  */
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happed! Please re-login");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("User not registered");
    }

    const foundUser = await findByEmail({ email });
    if (!foundUser) {
      throw new AuthFailureError("User not registered");
    }

    // Create new refresh and access token
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update token
    await KeyTokenService.updateRefreshToken({
      token: keyStore,
      newRefreshToken: tokens.refreshToken,
    });

    return {
      user,
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    const deleteKeyStore = await KeyTokenService.removeKeyTokenById(
      keyStore._id
    );
    return deleteKeyStore;
  };
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
