"use strict";

const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // refresh token
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
