"use strict";
const { Types } = require("mongoose");
const keytokenModel = require("./keytoken.model");

// Get
const findKeyTokenByUserId = async ({ userId }) => {
  return await keytokenModel
    .findOne({ user: new Types.ObjectId(userId) })
    .lean();
};
const findByRefreshTokenUsed = async (refreshToken) => {
  return await keytokenModel
    .findOne({ refreshTokensUsed: refreshToken })
    .lean();
};
const findByRefreshToken = async (refreshToken) => {
  return await keytokenModel.findOne({ refreshToken }).lean();
};
// Create
const createKeyToken = async ({
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
// Update
const updateRefreshToken = async ({ token, newRefreshToken }) => {
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
// Delete

const removeKeyTokenById = async (id) => {
  return await keytokenModel.deleteOne(id).lean();
};

const deleteKeyTokenById = async (userId) => {
  return await keytokenModel
    .deleteOne({
      user: new Types.ObjectId(userId),
    })
    .lean();
};

module.exports = {
  findKeyTokenByUserId,
  findByRefreshTokenUsed,
  findByRefreshToken,
  createKeyToken,
  updateRefreshToken,
  removeKeyTokenById,
  deleteKeyTokenById,
};
