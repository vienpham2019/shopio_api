"use strict";
const shopModel = require("../models/shop.model");
const byscrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtil");
const { getInfoData } = require("../utils/index");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // check email unique

    const existsEmail = await shopModel.findOne({ email }).lean();

    if (existsEmail) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await byscrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      role: [RoleShop["SHOP"]],
    });

    if (newShop) {
      // created privateKey and publicKey
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const publicKeyString = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!publicKeyString) {
        throw new BadRequestError("Error: Keys store error!");
      }

      // create token pair
      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      console.log(tokens);
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };
}

module.exports = AccessService;
