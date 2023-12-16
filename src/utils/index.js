"use strict";

const _ = require("lodash");

const { Types } = require("mongoose");

const convertToObjectIdMongoDB = (id) => new Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const getSkip = ({ limit, page }) => {
  return (page - 1) * limit;
};

const getSortBy = (sortType) => {
  return sortType === "ctime" ? { _id: -1 } : { _id: 1 };
};

const removeUndefinedNull = (obj) => {
  for (const key in obj) {
    if (obj[key] && typeof obj[key] === "object") {
      obj[key] = removeUndefinedNull(obj[key]); // Recursively check nested objects
      Object.keys(obj[key]).forEach((a) => {
        obj[`${key}.${a}`] = obj[key][a];
      });
      delete obj[key];
    } else if (obj[key] === undefined || obj[key] === null || obj[key] === "") {
      delete obj[key]; // Delete keys with undefined or null values
    }
  }
  return obj;
};

const isEmptyObject = (obj) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};

const isInValidDate = (start_date, end_date) => {
  let current_date = new Date();
  start_date = new Date(start_date);
  end_date = new Date(end_date);
  return current_date >= start_date || start_date >= end_date;
};

module.exports = {
  isEmptyObject,
  getInfoData,
  getSelectData,
  getSkip,
  getSortBy,
  getUnSelectData,
  removeUndefinedNull,
  convertToObjectIdMongoDB,
  isInValidDate,
};
