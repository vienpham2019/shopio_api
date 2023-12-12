"use strict";

const _ = require("lodash");

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

function removeUndefinedNull(obj) {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      obj[key] = removeUndefinedNull(obj[key]); // Recursively check nested objects
      Object.keys(obj[key]).forEach((a) => {
        obj[`${key}.${a}`] = obj[key][a];
      });
      delete obj[key];
    } else if (obj[key] === undefined || obj[key] === null) {
      delete obj[key]; // Delete keys with undefined or null values
    }
  }
  return obj;
}

const isEmptyObject = (obj) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};

module.exports = {
  isEmptyObject,
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedNull,
};
