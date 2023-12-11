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

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined || obj[k] === null) {
      delete obj[k];
    }
  });
  return obj;
};

const removeNestedObjectParser = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const res = removeUndefineObject(obj[k]);
      Object.keys(res).forEach((a) => {
        obj[`${k}.${a}`] = res[a];
      });
      delete obj[k];
    }
  });
  return obj;
};

const isEmptyObject = (obj) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object;
};

module.exports = {
  isEmptyObject,
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefineObject,
  removeNestedObjectParser,
};
