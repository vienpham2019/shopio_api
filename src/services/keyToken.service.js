"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async ({ userId }) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeKeyTokenById = async (id) => {
    return await keytokenModel.deleteOne(id).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken }).lean();
  };

  static updateRefreshToken = async ({ token, newRefreshToken }) => {
    return await keytokenModel
      .updateMany(
        { _id: new Types.ObjectId(token._id) },
        {
          $set: {
            refreshToken: newRefreshToken,
          },
          $addToSet: {
            refreshTokensUsed: token.refreshToken,
          },
        }
      )
      .lean();
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel
      .deleteOne({
        user: new Types.ObjectId(userId),
      })
      .lean();
  };
}

module.exports = KeyTokenService;
