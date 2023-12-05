"use strict";
const shopModel = require("../models/shop.model");
const byscrypt = require("bcrypt");
const crypto = require("crypto");

const RoleShop = {
  SHOP: "00001",
  WRITER: "00002",
  EDITOR: "00003",
  ADMIN: "00004",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // check email unique
      const existsEmail = await shopModel.findOne({ email }).lean();

      if (existsEmail) {
        return {
          code: "xxx",
          message: "Email already register!",
        };
      }

      const passwordHash = await byscrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        role: [RoleShop["SHOP"]],
      });

      if (newShop) {
        // created private key and public key
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
        });

        console.log(privateKey, publicKey); // save collection key store
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
