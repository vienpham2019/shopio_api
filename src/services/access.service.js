"use strict";
const byscrypt = require("bcrypt");
const crypto = require("crypto");
// const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const UserService = require("./user.service");
const { getUserByEmail } = require("../models/user/user.repo");
const {
  deleteKeyTokenById,
  updateRefreshToken,
  removeKeyTokenById,
  createKeyToken,
} = require("../models/keytoken/keyToken.repo");
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
      await deleteKeyTokenById(userId);
      throw new ForbiddenError("Something wrong happed! Please re-login");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("User not registered");
    }

    const foundUser = await getUserByEmail({ email });
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
    await updateRefreshToken({
      token: keyStore,
      newRefreshToken: tokens.refreshToken,
    });

    return {
      user,
      tokens,
    };
  };

  static logOut = async (keyStore) => {
    return await removeKeyTokenById(keyStore._id);
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
    const foundUser = await getUserByEmail({ email });
    if (!foundUser) {
      throw new BadRequestError("Shop not registered");
    }

    // Check password in DB
    const matchPassword = byscrypt.compare(password, foundUser.user_password);
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

    await createKeyToken({
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
    const newUser = await UserService.createUser({ name, email, password });

    if (!newUser) {
      throw new BadRequestError(`Can't registered`);
    }

    return {};
  };
}

module.exports = AccessService;
