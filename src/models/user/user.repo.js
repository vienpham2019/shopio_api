"use strict";

const { getSelectData } = require("../../utils");
const { UserRoleEnum } = require("./user.enum");
const userModel = require("./user.model");

// Get
const getUserById = async ({ userId, select = [] }) => {
  return await userModel.findById(userId).select(getSelectData(select)).lean();
};
const getUserByEmail = async ({ email, select = [] }) => {
  return await userModel
    .findOne({ user_email: email })
    .select(getSelectData(select))
    .lean();
};
// Create
const createNewUser = async ({ payload }) => {
  return await userModel.create(payload);
};
// Update
const updateUserToShop = async ({ userId, select = [] }) => {
  const query = {
    _id: userId,
  };
  const update = {
    $addToSet: {
      user_roles: UserRoleEnum.SHOP,
    },
  };
  const options = {};
  return await userModel
    .findOneAndUpdate(query, update, options)
    .select(getSelectData(select))
    .lean();
};
// Delete

module.exports = {
  createNewUser,
  getUserByEmail,
  getUserById,
  updateUserToShop,
};
